'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Mathematics } from '@tiptap/extension-mathematics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Link2,
  Table as TableIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sigma,
  Upload,
  MoveLeft,
  MoveRight,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import MathSymbolsToolbar from './MathSymbolsToolbar';
import MathPreviewBox from './MathPreviewBox';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'ابدأ الكتابة هنا...',
  editable = true,
  className = '',
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorPicker, setColorPicker] = useState('#000000');
  const [bgColorPicker, setBgColorPicker] = useState('#ffff00');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
          displayMode: false,
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // تحديث محتوى المحرر عندما يتغير content من الخارج (مثل توليد AI)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      // التحقق من حجم الصورة
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert('حجم الصورة كبير جداً! الحد الأقصى 2 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addImageUrl = useCallback(() => {
    const url = window.prompt('أدخل رابط الصورة:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('أدخل الرابط:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addGeoGebra = useCallback(() => {
    const url = window.prompt('أدخل رابط GeoGebra:');
    if (url && editor) {
      const iframe = `<iframe src="${url}" width="800" height="600" style="border: 1px solid #ccc" frameborder="0"></iframe>`;
      editor.chain().focus().insertContent(iframe).run();
    }
  }, [editor]);

  const addMathEquation = useCallback(() => {
    const latex = window.prompt('أدخل المعادلة الرياضية (LaTeX):', 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
    if (latex && editor) {
      editor.chain().focus().insertContent(`<span data-type="math" data-latex="${latex}">$${latex}$</span>`).run();
    }
  }, [editor]);

  // دالة لإدراج رمز رياضي من الشريط
  const insertMathSymbol = useCallback((latex: string) => {
    if (editor) {
      editor.chain().focus().insertContent(` ${latex} `).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const setTextDirection = useCallback((direction: 'ltr' | 'rtl') => {
    if (editor) {
      // الحصول على العنصر الرئيسي للمحرر
      const editorElement = editor.view.dom;
      
      // تطبيق الاتجاه على المحرر بالكامل
      if (direction === 'rtl') {
        editorElement.setAttribute('dir', 'rtl');
        editorElement.style.textAlign = 'right';
      } else {
        editorElement.setAttribute('dir', 'ltr');
        editorElement.style.textAlign = 'left';
      }
      
      // إعادة التركيز على المحرر
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        aria-label="تحميل صورة"
      />
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
            title="غامق"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
            title="مائل"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-muted' : ''}
            title="تسطير"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          {/* Headings */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          {/* Colors */}
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={colorPicker}
              onChange={(e) => {
                setColorPicker(e.target.value);
                editor.chain().focus().setColor(e.target.value).run();
              }}
              className="w-8 h-8 rounded cursor-pointer"
              title="لون النص"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight({ color: bgColorPicker }).run()}
              className={editor.isActive('highlight') ? 'bg-muted' : ''}
              title="تمييز"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <input
              type="color"
              value={bgColorPicker}
              onChange={(e) => setBgColorPicker(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
              title="لون التمييز"
            />
          </div>

          {/* Lists */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            title="قائمة نقطية"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            title="قائمة مرقمة"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          {/* Text Alignment */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
            title="محاذاة لليسار"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
            title="محاذاة للوسط"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
            title="محاذاة لليمين"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}
            title="ضبط"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          {/* Text Direction */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTextDirection('ltr')}
            title="اتجاه من اليسار لليمين (LTR)"
          >
            <MoveRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTextDirection('rtl')}
            title="اتجاه من اليمين لليسار (RTL)"
          >
            <MoveLeft className="h-4 w-4" />
          </Button>

          {/* Insert */}
          <div className="w-px h-8 bg-border mx-1" />
          
          {/* Math Symbols Toolbar */}
          <MathSymbolsToolbar onInsert={insertMathSymbol} />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="تحميل صورة"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImageUrl}
            title="صورة من رابط"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-muted' : ''}
            title="رابط"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addMathEquation}
            title="معادلة رياضية"
          >
            <Sigma className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
            title="جدول"
          >
            <TableIcon className="h-4 w-4" />
          </Button>

          {/* Undo/Redo */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} className="min-h-[200px]" />
      
      {/* مربع المعاينة المباشرة */}
      {editable && <MathPreviewBox content={content} />}
    </div>
  );
}
