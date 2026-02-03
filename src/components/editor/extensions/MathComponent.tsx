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
  const [isFocused, setIsFocused] = useState(false);
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
        // دالة لتحميل المكتبة مع إعادة المحاولة في حال الفشل (ChunkLoadError)
        const loadMathLive = (retries: number) => {
          import('mathlive')
            .then((mod) => {
              // تعيين مسار الخطوط إلى CDN لحل مشكلة عدم العثور عليها في بيئة Next.js
              mod.MathfieldElement.fontsDirectory = 'https://cdn.jsdelivr.net/npm/mathlive/dist/fonts/';
              setIsLibLoaded(true);
            })
            .catch((err) => {
              console.error('Failed to load mathlive:', err);
              if (retries > 0) {
                setTimeout(() => loadMathLive(retries - 1), 1500);
              }
            });
        };
        loadMathLive(3);
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
      
      // التركيز تلقائياً إذا كانت المعادلة فارغة (عند الإنشاء الجديد)
      if (!node.attrs.latex && editor.isEditable) {
        setTimeout(() => {
          // التأكد من أن العنصر لا يزال موجوداً ومتصلاً بالـ DOM قبل التركيز
          if (mfRef.current && mfRef.current.isConnected) {
            try {
              mfRef.current.focus();
            } catch (e) {
              console.warn('Failed to focus math field:', e);
            }
          }
        }, 50);
      }

      // تحديث وضع القراءة (Read-Only) بناءً على حالة المحرر
      (mf as any).readOnly = !editor.isEditable;

      // تفعيل لوحة المفاتيح الافتراضية لتسهيل إدراج الرموز
      (mf as any).mathVirtualKeyboardPolicy = editor.isEditable ? 'manual' : 'auto';

      // معالجة مفتاح Enter للخروج من المعادلة وإنشاء سطر جديد
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          
          // إخفاء لوحة المفاتيح عند الضغط على Enter
          if (typeof window !== 'undefined' && (window as any).mathVirtualKeyboard) {
            (window as any).mathVirtualKeyboard.hide();
          }
          mf.classList.add('hide-controls');

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
        setIsFocused(false);
        if (typeof window !== 'undefined' && (window as any).mathVirtualKeyboard) {
          (window as any).mathVirtualKeyboard.hide();
        }
          mf.classList.add('hide-controls');
      };

      // إظهار لوحة المفاتيح عند التركيز (الضغط داخل المربع)
      const handleFocusIn = () => {
        setIsFocused(true);
        if (editor.isEditable && typeof window !== 'undefined' && (window as any).mathVirtualKeyboard) {
          (window as any).mathVirtualKeyboard.show();
        }
        mf.classList.remove('hide-controls');
      };

      // إضافة مستمع الحدث
      mf.addEventListener('keydown', handleKeyDown);
      mf.addEventListener('input', handleInput);
      mf.addEventListener('focusout', handleFocusOut);
      mf.addEventListener('focusin', handleFocusIn);

      // إخفاء الأيقونات افتراضياً إذا لم يكن العنصر نشطاً
      if (document.activeElement !== mf) {
        mf.classList.add('hide-controls');
      }

      return () => {
        mf.removeEventListener('keydown', handleKeyDown);
        mf.removeEventListener('input', handleInput);
        mf.removeEventListener('focusout', handleFocusOut);
        mf.removeEventListener('focusin', handleFocusIn);
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

  // 5. إعداد لوحة المفاتيح المخصصة (هندسة)
  useEffect(() => {
    if (isLibLoaded && typeof window !== 'undefined' && (window as any).mathVirtualKeyboard) {
      const kbd = (window as any).mathVirtualKeyboard;
      
      const geometryLayer = {
        label: 'هندسة',
        tooltip: 'رموز الهندسة',
        rows: [
          [
            { latex: '\\angle', label: '∠' },
            { latex: '\\triangle', label: '△' },
            { latex: '\\perp', label: '⊥' },
            { latex: '\\parallel', label: '∥' },
            { latex: '^\\circ', label: '°' },
            { latex: '\\pi', label: 'π' },
            { latex: '\\infty', label: '∞' },
          ],
          [
            { latex: '\\cong', label: '≅' },
            { latex: '\\sim', label: '∼' },
            { latex: '\\approx', label: '≈' },
            { latex: '\\neq', label: '≠' },
            { latex: '\\pm', label: '±' },
            { latex: '\\sqrt{#@}', label: '√' },
          ],
          [
            { latex: '\\overline{#@}', label: 'AB' }, // قطعة مستقيمة
            { latex: '\\overrightarrow{#@}', label: 'AB→' }, // شعاع
            { latex: '\\overleftrightarrow{#@}', label: 'AB↔' }, // مستقيم
            { latex: '\\widehat{#@}', label: 'ABC' }, // زاوية
            { latex: '\\frac{#@}{#?}', label: 'x/y' }, // كسر
          ]
        ]
      };

      try {
        kbd.layouts = ['numeric', 'symbols', geometryLayer, 'alphabetic', 'greek'];
      } catch (e) {
        console.warn('Failed to configure math keyboard:', e);
      }
    }
  }, [isLibLoaded]);

  if (!isLibLoaded) {
    return (
      <NodeViewWrapper className="inline-block p-2 border rounded bg-muted text-muted-foreground text-xs">
        جاري تحميل المحرر الرياضي...
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-block align-middle mx-1">
      <style>{`
        math-field.hide-controls::part(menu-toggle),
        math-field.hide-controls::part(virtual-keyboard-toggle) {
          display: none;
        }
      `}</style>
      <math-field
        ref={mfRef}
        style={{
          display: 'inline-block',
          minWidth: '30px', // زيادة العرض الأدنى ليسهل النقر عليه
          padding: '4px 8px',
          borderRadius: '4px',
          // محاكاة مظهر Word: إطار رمادي وخلفية فاتحة عند التركيز أو التحديد أو إذا كانت فارغة
          border: (selected || isFocused || !node.attrs.latex) ? '1px solid #94a3b8' : '1px solid transparent',
          backgroundColor: (selected || isFocused || !node.attrs.latex) ? '#f1f5f9' : 'transparent',
          cursor: 'text',
          outline: 'none',
        }}
      />
    </NodeViewWrapper>
  );
}