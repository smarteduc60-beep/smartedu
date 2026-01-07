'use client';

import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';

// تعريف العنصر المخصص لـ TypeScript لتجنب الأخطاء
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function MathComponent({ node, updateAttributes, selected, editor, getPos }: NodeViewProps) {
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const mfRef = useRef<HTMLElement>(null);
  
  // استخدام refs لتخزين القيم المتغيرة وتجنب إعادة تشغيل الـ useEffect عند كل تغيير
  const editorRef = useRef(editor);
  const getPosRef = useRef(getPos);
  const nodeRef = useRef(node);

  // تحديث الـ refs عند كل render لضمان دقة البيانات
  useEffect(() => {
    editorRef.current = editor;
    getPosRef.current = getPos;
    nodeRef.current = node;
  });

  // 1. تحميل مكتبة MathLive بشكل ديناميكي (Lazy Loading)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // التحقق مما إذا كانت المكتبة محملة مسبقاً لتجنب التكرار
      if (window.customElements.get('math-field')) {
        setIsLibLoaded(true);
      } else {
        import('mathlive')
          .then((mod) => {
            // تعيين مسار الخطوط إلى CDN لحل مشكلة عدم العثور عليها في بيئة Next.js
            mod.MathfieldElement.fontsDirectory = 'https://cdn.jsdelivr.net/npm/mathlive/dist/fonts/';

            setIsLibLoaded(true);
          })
          .catch((err) => console.error('Failed to load mathlive:', err));
      }
    }
  }, []);

  // 2. معالجة تحديثات المستخدم (الكتابة في المحرر)
  const handleInput = useCallback((e: Event) => {
    const target = e.target as any;
    // تحديث القيمة في Tiptap فقط
    updateAttributes({ latex: target.value });
  }, [updateAttributes]);

  // 3. إعداد المستمعين (Listeners) عند جاهزية العنصر
  useEffect(() => {
    const mf = mfRef.current;
    if (mf && isLibLoaded) {
      // تعيين القيمة الأولية
      if ((mf as any).value !== node.attrs.latex) {
        (mf as any).value = node.attrs.latex || '';
      }

      // تحديث وضع القراءة (Read-Only) بناءً على حالة المحرر
      (mf as any).readOnly = !editor.isEditable;

      // تفعيل لوحة المفاتيح الافتراضية لتسهيل إدراج الرموز
      (mf as any).mathVirtualKeyboardPolicy = editor.isEditable ? 'manual' : 'auto';

      // معالجة مفتاح Enter للخروج من المعادلة وإنشاء سطر جديد
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          
          const currentGetPos = getPosRef.current;
          const currentNode = nodeRef.current;
          const currentEditor = editorRef.current;

          if (typeof currentGetPos === 'function') {
            currentEditor
              .chain()
              .focus()
              .setTextSelection(currentGetPos() + currentNode.nodeSize)
              .enter()
              .run();
          }
        }
      };

      // إخفاء لوحة المفاتيح عند فقدان التركيز (النقر خارج المعادلة)
      const handleFocusOut = () => {
        if (typeof window !== 'undefined' && (window as any).mathVirtualKeyboard) {
          (window as any).mathVirtualKeyboard.hide();
        }
      };

      // إضافة مستمع الحدث
      mf.addEventListener('keydown', handleKeyDown);
      mf.addEventListener('input', handleInput);
      mf.addEventListener('focusout', handleFocusOut);

      return () => {
        mf.removeEventListener('keydown', handleKeyDown);
        mf.removeEventListener('input', handleInput);
        mf.removeEventListener('focusout', handleFocusOut);
      };
    }
  }, [isLibLoaded, handleInput, editor.isEditable]); // تم تقليص الاعتمادات لتحسين الأداء والاستقرار

  // 4. مزامنة التغييرات الخارجية (مثل Undo/Redo)
  useEffect(() => {
    const mf = mfRef.current;
    if (mf && isLibLoaded) {
      // التحقق لتجنب مشاكل المؤشر (Cursor Jumping)
      if ((mf as any).value !== node.attrs.latex) {
        (mf as any).value = node.attrs.latex || '';
      }
    }
  }, [node.attrs.latex, isLibLoaded]);

  if (!isLibLoaded) {
    return (
      <NodeViewWrapper className="inline-block p-2 border rounded bg-muted text-muted-foreground text-xs">
        جاري تحميل المحرر الرياضي...
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-block align-middle mx-1">
      <math-field
        ref={mfRef}
        style={{
          display: 'inline-block',
          minWidth: '20px',
          padding: '2px 4px',
          borderRadius: '4px',
          border: selected ? '2px solid #3b82f6' : '1px solid transparent', // تمييز أزرق عند التحديد
          backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          cursor: 'text',
          outline: 'none',
        }}
      />
    </NodeViewWrapper>
  );
}