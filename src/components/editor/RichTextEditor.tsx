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
import { cn } from '@/lib/utils';
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
  Save,
  Indent,
  ChevronDown,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useId } from 'react';
import { MathExtension } from './extensions/MathExtension';
import { TextDirection } from './extensions/TextDirection';
import { ResizableImage } from './extensions/ResizableImage';
import { AutoDirection } from './extensions/AutoDirection';
import { FontSize } from './FontSize';
import { FontFamily } from './FontFamily';
import { uploadFileToDrive } from '@/lib/upload'; // Import the new upload utility
import { Loader2 } from 'lucide-react'; // Import Loader2 icon

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  googleDriveParentFolderId?: string; // New prop for Google Drive parent folder
  stage?: string;
  subject?: string;
  teacher?: string;
  lesson?: string;
  onEditorReady?: (editor: Editor) => void; // Prop to pass editor instance up
  id?: string;
  onSave?: () => void;
}

// الألوان القياسية المقترحة للمنصة
const PRESET_COLORS = [
  '#000000', '#4B5563', '#DC2626', '#EA580C', '#D97706', 
  '#16A34A', '#059669', '#2563EB', '#7C3AED', '#DB2777',
];

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'];

const FONT_FAMILIES = [
  { label: 'افتراضي', value: '' },
  { label: 'Inter', value: 'var(--font-inter), sans-serif' },
  { label: 'Cairo', value: 'var(--font-cairo), sans-serif' },
  { label: 'Tajawal', value: 'var(--font-tajawal), sans-serif' },
  { label: 'Amiri', value: 'var(--font-amiri), serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Segoe UI', value: '"Segoe UI", sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Garamond', value: 'Garamond, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
];

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'ابدأ الكتابة هنا...',
  editable = true,
  className = '',
  googleDriveParentFolderId, // Destructure the new prop
  stage,
  subject,
  teacher,
  lesson,
  onEditorReady,
  id,
  onSave,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorPicker, setColorPicker] = useState('#000000');
  const [bgColorPicker, setBgColorPicker] = useState('#ffff00');
  const [isUploading, setIsUploading] = useState(false); // New state for upload loading
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isFontFamilyOpen, setIsFontFamilyOpen] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target as Node)) {
        setIsFontSizeOpen(false);
      }
      if (fontFamilyRef.current && !fontFamilyRef.current.contains(event.target as Node)) {
        setIsFontFamilyOpen(false);
      }
    };

    if (isColorPickerOpen || isFontSizeOpen || isFontFamilyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorPickerOpen, isFontSizeOpen, isFontFamilyOpen]);

  const generatedId = useId();

  // Generate unique IDs for internal inputs
  const uniqueId = id || `rte-${generatedId.replace(/:/g, '')}`;
  const uploadInputId = `${uniqueId}-image-upload`;
  const textColorInputId = `${uniqueId}-text-color`;
  const bgColorInputId = `${uniqueId}-bg-color`;

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
      AutoDirection,
      FontSize,
      FontFamily,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const currentFontSize = editor.getAttributes('textStyle').fontSize;
      if (currentFontSize) {
        setFontSize(currentFontSize);
      }
      const currentFontFamily = editor.getAttributes('textStyle').fontFamily;
      if (currentFontFamily) {
        setFontFamily(currentFontFamily);
      } else {
        setFontFamily('');
      }
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
    if (!file || !editor) {
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
      const result = await uploadFileToDrive(file, {
        stage: stage || 'General',
        subject: subject || 'General',
        teacher: teacher || 'User',
        lesson: lesson || 'Uploads',
      });
      
      editor.chain().focus().setImage({ src: result.fileUrl }).run();
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
  }, [editor, stage, subject, teacher, lesson]);

  const addImageFromDrive = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addImageUrl = useCallback(() => {
    const url = window.prompt('أدخل رابط الصورة:');
    if (url && editor) {
      let finalUrl = url.trim();

      // تحسين: معالجة روابط Google Drive تلقائياً لتمر عبر البروكسي لتجنب مشاكل 403
      const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/) || finalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      const isDrive = (finalUrl.includes('drive.google.com') || finalUrl.includes('googleusercontent.com')) && idMatch && idMatch[1];

      if (isDrive) {
        finalUrl = `/api/images/proxy?fileId=${idMatch[1]}&t=image.jpg`;
      } else if (finalUrl.startsWith('http')) {
        // تمرير الروابط الخارجية الأخرى عبر البروكسي لضمان ظهورها (تجاوز CORS/Hotlink)
        finalUrl = `/api/images/proxy?url=${encodeURIComponent(finalUrl)}`;
      }

      editor.chain().focus().setImage({ src: finalUrl }).run();
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

  const insertTab = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent('\u2003').run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg ${className}`} id={id}>
      <input
        ref={fileInputRef}
        id={uploadInputId}
        name={uploadInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        aria-label="تحميل صورة"
        aria-labelledby="upload-image-button"
        disabled={isUploading}
      />
      {editable && (
        <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-2 border-b bg-muted">
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

          {/* Font Family */}
          <div className="w-px h-8 bg-border mx-1" />
          <div className="relative flex items-center" ref={fontFamilyRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2 min-w-[6rem] justify-between"
              disabled={isUploading}
              title="نوع الخط"
              onClick={() => setIsFontFamilyOpen(!isFontFamilyOpen)}
              type="button"
            >
              <span className="text-sm font-medium truncate max-w-[5rem]">
                {FONT_FAMILIES.find(f => f.value === fontFamily)?.label || 'خط'}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
            {isFontFamilyOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 w-40 p-1 bg-white dark:bg-slate-950 rounded-md border shadow-md max-h-60 overflow-y-auto">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.label}
                    className={cn(
                      "w-full text-right px-2 py-1 text-sm hover:bg-muted rounded-sm transition-colors",
                      fontFamily === font.value && "bg-muted font-medium"
                    )}
                    style={{ fontFamily: font.value || 'inherit' }}
                    onClick={() => {
                      if (font.value) {
                        editor.chain().focus().setFontFamily(font.value).run();
                      } else {
                        editor.chain().focus().unsetFontFamily().run();
                      }
                      setFontFamily(font.value);
                      setIsFontFamilyOpen(false);
                    }}
                    type="button"
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="w-px h-8 bg-border mx-1" />
          <div className="relative flex items-center" ref={fontSizeRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2 min-w-[3.5rem] justify-between"
              disabled={isUploading}
              title="حجم الخط"
              onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
              type="button"
            >
              <span className="text-sm font-medium">{fontSize.replace('px', '')}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
            {isFontSizeOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 w-24 p-1 bg-white dark:bg-slate-950 rounded-md border shadow-md max-h-60 overflow-y-auto">
                <div className="p-1 mb-1 border-b">
                  <input
                    type="number"
                    className="w-full text-sm p-1 border rounded bg-transparent"
                    placeholder="حجم"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value;
                        const size = `${val}px`;
                        editor.chain().focus().setFontSize(size).run();
                        setFontSize(size);
                        setIsFontSizeOpen(false);
                      }
                    }}
                  />
                </div>
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    className={cn(
                      "w-full text-right px-2 py-1 text-sm hover:bg-muted rounded-sm transition-colors",
                      fontSize === `${size}px` && "bg-muted font-medium"
                    )}
                    onClick={() => {
                      const newSize = `${size}px`;
                      editor.chain().focus().setFontSize(newSize).run();
                      setFontSize(newSize);
                      setIsFontSizeOpen(false);
                    }}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1">
            <div className="relative" ref={colorPickerRef}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 px-2"
                disabled={isUploading}
                title="لون النص"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                type="button"
              >
                <div 
                  className="w-4 h-4 rounded-sm border border-muted-foreground/20" 
                  style={{ backgroundColor: colorPicker }} 
                />
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
              {isColorPickerOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 w-auto p-3 bg-white dark:bg-slate-950 rounded-md border shadow-md min-w-[180px]">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-md border border-muted-foreground/20 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setColorPicker(color);
                        editor.chain().focus().setColor(color).run();
                        setIsColorPickerOpen(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">مخصص:</span>
                  <input
                    id={textColorInputId}
                    type="color"
                    value={colorPicker}
                    onChange={(e) => {
                      setColorPicker(e.target.value);
                      editor.chain().focus().setColor(e.target.value).run();
                    }}
                    className="w-full h-6 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
              </div>
              )}
            </div>

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
            <label htmlFor={bgColorInputId} className="sr-only">لون التمييز</label>
            <input
              id={bgColorInputId}
              name={bgColorInputId}
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

          {/* Tab & Save */}
          <div className="w-px h-8 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertTab}
            title="إزاحة (Tab)"
            disabled={isUploading}
          >
            <Indent className="h-4 w-4" />
          </Button>
          {onSave && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSave}
              title="حفظ"
              disabled={isUploading}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}

          {/* Insert */}
          <div className="w-px h-8 bg-border mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImageFromDrive}
            id="upload-image-button" // Add ID for aria-labelledby
            title="رفع صورة إلى Google Drive"
            disabled={isUploading}
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
