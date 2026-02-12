'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";
import { useSession } from "next-auth/react";

// دالة مساعدة لتحويل روابط Google Drive القديمة أو المباشرة إلى روابط Proxy
const getProxiedUrl = (url: string) => {
  if (!url) return "";
  // إضافة لاحقة وهمية للصورة لكي يتعرف عليها مكون FileUpload والمتصفح كصورة
  const suffix = "&t=image.jpg";
  if (url.startsWith('/api/images/proxy')) return url.includes(suffix) ? url : `${url}${suffix}`;
  
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if ((url.includes('drive.google.com') || url.includes('googleusercontent.com')) && idMatch && idMatch[1]) {
    return `/api/images/proxy?fileId=${idMatch[1]}${suffix}`;
  }
  
  return url;
};

interface SupervisorInfo {
  subject: { id: number; name: string };
  level: { id: number; name: string; stage: { name: string } };
}

interface CreateLessonClientProps {
  googleDriveParentFolderId: string | null;
}

export default function CreateLessonClient({ googleDriveParentFolderId }: CreateLessonClientProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [supervisorInfo, setSupervisorInfo] = useState<SupervisorInfo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    imageUrl: '',
    pdfUrl: '',
    isPublic: false,
  });

  // حالات للتحكم في ظهور المرفقات وحالة الرفع
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [showPptUpload, setShowPptUpload] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    const fetchSupervisorInfo = async () => {
      try {
        const response = await fetch('/api/subject-supervisor/dashboard');
        const result = await response.json();
        
        console.log('Supervisor API Response:', result);
        
        if (result.success && result.data?.supervisor) {
          const { subject, level } = result.data.supervisor;
          
          if (!subject || !level) {
            toast({
              title: 'خطأ في البيانات',
              description: 'يرجى التواصل مع المدير لإعداد المادة والمستوى الخاص بك',
              variant: 'destructive',
            });
            return;
          }
          
          setSupervisorInfo({
            subject,
            level,
          });
        } else {
          toast({
            title: 'خطأ',
            description: result.error || 'فشل في جلب معلومات المشرف',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching supervisor info:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في الاتصال بالخادم',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisorInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان الدرس',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال محتوى الدرس',
        variant: 'destructive',
      });
      return;
    }

    if (!supervisorInfo) {
      toast({
        title: 'خطأ',
        description: 'لم يتم العثور على معلومات المشرف',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        title: formData.title.trim(),
        content: formData.content,
        videoUrl: formData.videoUrl?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        pdfUrl: formData.pdfUrl?.trim() || null,
        subjectId: supervisorInfo.subject.id,
        levelId: supervisorInfo.level.id,
        type: formData.isPublic ? 'public' : 'private',
      };

      console.log('Sending payload size:', JSON.stringify(payload).length, 'bytes');

      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`فشل في الحفظ: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'تم الإنشاء',
          description: 'تم إنشاء الدرس بنجاح',
        });
        router.push('/dashboard/subject-supervisor/lessons');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إنشاء الدرس. قد يكون الملف كبيراً جداً',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">إنشاء درس جديد</h1>
        <p className="text-muted-foreground">
          املأ النموذج أدناه لإضافة درس جديد. يمكنك اختيار ما إذا كان الدرس عامًا لجميع الطلاب أو خاصًا بطلابك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            {supervisorInfo && `${supervisorInfo.subject.name} - ${supervisorInfo.level.name} (${supervisorInfo.level.stage.name})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
              <Input 
                id="title" 
                placeholder="مثال: مقدمة في الجبر" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة</Label>
                <Input 
                  id="subject" 
                  value={supervisorInfo?.subject.name || ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المستوى</Label>
                <Input 
                  id="level" 
                  value={supervisorInfo ? `${supervisorInfo.level.name} (${supervisorInfo.level.stage.name})` : ''} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <RichTextEditor 
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="اكتب محتوى الدرس هنا..."
                googleDriveParentFolderId={googleDriveParentFolderId || undefined}
                stage={supervisorInfo?.level.stage.name}
                subject={supervisorInfo?.subject.name}
                teacher={session?.user?.name || "Supervisor"}
                lesson={formData.title || "New Lesson"}
              />
              <p className="text-xs text-muted-foreground">
                استخدم شريط الأدوات لتنسيق النص وإضافة معادلات رياضية. يمكنك الآن رفع الصور مباشرة.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch 
                id="lesson-type" 
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label htmlFor="lesson-type">جعله درسًا عامًا (متاح لجميع الطلاب في هذا المستوى)</Label>
            </div>

            {/* قسم المرفقات والقائمة المنسدلة */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  المرفقات
                </Label>
                
                <Select 
                  disabled={isFileUploading || submitting} 
                  onValueChange={(value) => {
                    if (value === 'image') setShowImageUpload(true);
                    if (value === 'pdf') setShowPdfUpload(true);
                    if (value === 'ppt') setShowPptUpload(true);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="إضافة مرفق..." />
                  </SelectTrigger>
                  <SelectContent>
                    {!showImageUpload && <SelectItem value="image">صورة الدرس</SelectItem>}
                    {!showPdfUpload && <SelectItem value="pdf">ملف الدرس (PDF)</SelectItem>}
                    {!showPptUpload && <SelectItem value="ppt" disabled>ملف عرض تقديمي (PowerPoint) - قريباً</SelectItem>}
                    <SelectItem value="video" disabled>فيديو (قريباً)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">رابط الفيديو (يوتيوب)</Label>
                  <Input 
                    id="video-url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    disabled={submitting}
                  /> 
                </div>

                {showImageUpload && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <FileUpload
                      label="صورة الدرس"
                      accept="image/*"
                      maxSizeMB={5}
                      value={formData.imageUrl}
                      onChange={(fileInfo) => {
                        setFormData({ ...formData, imageUrl: getProxiedUrl(fileInfo?.fileUrl || "") });
                      }}
                      onUploadStatusChange={setIsFileUploading}
                      parentFolderId={googleDriveParentFolderId || undefined}
                      description="قم بتحميل صورة الغلاف للدرس (JPG, PNG, GIF, حتى 5 ميجابايت)"
                      stage={supervisorInfo?.level.stage.name}
                      subject={supervisorInfo?.subject.name}
                      teacher="Supervisor"
                      lesson={formData.title}
                    />
                  </div>
                )}

                {showPdfUpload && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <FileUpload
                      label="ملف الدرس (PDF)"
                      accept=".pdf"
                      maxSizeMB={10}
                      value={formData.pdfUrl}
                      onChange={(fileInfo) => setFormData({ ...formData, pdfUrl: fileInfo?.fileUrl || "" })}
                      onUploadStatusChange={setIsFileUploading}
                      parentFolderId={googleDriveParentFolderId || undefined}
                      description="قم بتحميل ملف PDF للدرس (حتى 10 ميجابايت)"
                      stage={supervisorInfo?.level.stage.name}
                      subject={supervisorInfo?.subject.name}
                      teacher="Supervisor"
                      lesson={formData.title}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.back()}
                disabled={submitting || isFileUploading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={submitting || isFileUploading}>
                {submitting || isFileUploading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>{isFileUploading ? "جاري رفع الملفات..." : "جاري الحفظ..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    <span>حفظ الدرس</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}