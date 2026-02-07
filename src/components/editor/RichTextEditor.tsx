'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
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
  Upload,
  MoveLeft,
  MoveRight,
  Sigma,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MathExtension } from './extensions/MathExtension';
import { TextDirection } from './extensions/TextDirection';
import { ResizableImage } from './extensions/ResizableImage';
import { uploadFileToDrive } from '@/lib/upload'; // Import the new upload utility
import { Loader2 } from 'lucide-react'; // Import Loader2 icon

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  googleDriveParentFolderId?: string; // New prop for Google Drive parent folder
  onEditorReady?: (editor: Editor) => void; // Prop to pass editor instance up
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'ابدأ الكتابة هنا...',
  editable = true,
  className = '',
  googleDriveParentFolderId, // Destructure the new prop
  onEditorReady,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorPicker, setColorPicker] = useState('#000000');
  const [bgColorPicker, setBgColorPicker] = useState('#ffff00');
  const [isUploading, setIsUploading] = useState(false); // New state for upload loading

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ResizableImage.configure({
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
      MathExtension,
      TextDirection,
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
      // استخدام setTimeout لتجنب خطأ flushSync أثناء دورة حياة React
      setTimeout(() => {
        if (editor && !editor.isDestroyed && content !== editor.getHTML()) {
          editor.commands.setContent(content);
        }
      }, 0);
    }
  }, [content, editor]);

  // Pass editor instance to parent component when it's ready
  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor);
  }, [editor, onEditorReady]);

  const insertMathSymbol = useCallback((latex: string) => {
    if (editor) {
      editor.chain().focus().insertContent({ type: 'mathLive', attrs: { latex } }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor || !googleDriveParentFolderId) {
      alert('لا يمكن رفع الملف. تأكد من تحديد المجلد الأب لـ Google Drive.');
      return;
    }

    // Check file size (client-side validation for immediate feedback)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('حجم الصورة كبير جداً! الحد الأقصى 2 ميجابايت');
      return;
    }

    setIsUploading(true);
    try {
      const { fileUrl } = await uploadFileToDrive(file, googleDriveParentFolderId);
      editor.chain().focus().setImage({ src: fileUrl }).run();
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      alert('فشل رفع الصورة إلى Google Drive.');
    } finally {
      setIsUploading(false);
      // Clear the file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [editor, googleDriveParentFolderId]);

  const addImageFromDrive = useCallback(() => {
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

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const setTextDirection = useCallback((direction: 'ltr' | 'rtl') => {
    if (editor) {
      editor.chain().focus().setTextDirection(direction).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const uploadInputId = 'rich-text-image-upload';

  return (
    <div className={`border rounded-lg ${className}`}>
      <input
        ref={fileInputRef}
        id={uploadInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        aria-label="تحميل صورة"
        aria-labelledby="upload-image-button"
        disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
            disabled={isUploading}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
            disabled={isUploading}
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
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight({ color: bgColorPicker }).run()}
              className={editor.isActive('highlight') ? 'bg-muted' : ''}
              title="تمييز"
              disabled={isUploading}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            <input
              type="color"
              value={bgColorPicker}
              onChange={(e) => setBgColorPicker(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
              title="لون التمييز"
              disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
          >
            <MoveRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTextDirection('rtl')}
            title="اتجاه من اليمين لليسار (RTL)"
            disabled={isUploading}
          >
            <MoveLeft className="h-4 w-4" />
          </Button>

          {/* Insert */}
          <div className="w-px h-8 bg-border mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImageFromDrive}
            id="upload-image-button" // Add ID for aria-labelledby
            title="رفع صورة إلى Google Drive"
            disabled={isUploading || !googleDriveParentFolderId}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImageUrl}
            title="إدراج صورة من رابط"
            disabled={isUploading}
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
            disabled={isUploading}
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addTable}
            title="جدول"
            disabled={isUploading}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (typeof editor.chain().focus().setMathLive === 'function') {
                editor.chain().focus().setMathLive().run();
              }
            }}
            className={editor.isActive('mathLive') ? 'bg-muted' : ''}
            title="معادلة رياضية"
            disabled={isUploading}
          >
            <Sigma className="h-4 w-4" />
          </Button>

          {/* Number Sets - مجموعات الأعداد */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{N}')}
            title="الأعداد الطبيعية (N)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            N
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{Z}')}
            title="الأعداد الصحيحة (Z)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            Z
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{D}')}
            title="الأعداد العشرية (D)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            D
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{Q}')}
            title="الأعداد الناطقة (Q)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            Q
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{R}')}
            title="الأعداد الحقيقية (R)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            R
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMathSymbol('\\mathbb{C}')}
            title="الأعداد المركبة (C)"
            className="font-serif font-bold w-7 px-0"
            disabled={isUploading}
          >
            C
          </Button>

          {/* Undo/Redo */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || isUploading}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || isUploading}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
}
