'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStages, useLevels, useSubjects, useLessons } from "@/hooks";
import { Save, Loader2, Paperclip, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";

// دالة مساعدة لتحويل روابط Google Drive القديمة أو المباشرة إلى روابط Proxy
// هذا يضمن ظهور الصورة حتى لو فشل السيرفر في تحديد نوع الملف كصورة
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

interface CreateLessonClientProps {
  googleDriveParentFolderId: string | null;
}

export default function CreateLessonClient({ googleDriveParentFolderId }: CreateLessonClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { stages, isLoading: stagesLoading } = useStages();
  const { levels, isLoading: levelsLoading } = useLevels();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { createLesson } = useLessons();
  
  const [teacherSubject, setTeacherSubject] = useState<any>(null);
  const [teacherStage, setTeacherStage] = useState<any>(null);
  const [availableLevels, setAvailableLevels] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [levelId, setLevelId] = useState<string>("");
  const [uploadedImageFileId, setUploadedImageFileId] = useState<string | null>(null);
  const [uploadedPdfFileId, setUploadedPdfFileId] = useState<string | null>(null);
  const [uploadedPptFileId, setUploadedPptFileId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالات للتحكم في ظهور المرفقات وحالة الرفع
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [showPptUpload, setShowPptUpload] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const [userDetails, setUserDetails] = useState<any>(null);

  // 1. جلب بيانات المعلم بشكل مستقل فور تحميل الصفحة
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserDetails(data.data);
          }
        })
        .catch((err) => console.error('Error fetching user details:', err));
    }
  }, [session?.user?.id]);

  // Set teacher's subject, stage and available levels
  useEffect(() => {
    // ننتظر توفر بيانات المستخدم والقوائم الأساسية
    // أزلنا الشرط الصارم (length === 0) للسماح بالعمل حتى لو كانت بعض القوائم فارغة مؤقتاً
    if (!userDetails || !subjects || !stages) return;

    if (userDetails.userDetails?.subjectId) {
      const userSubjectId = userDetails.userDetails.subjectId;
      const subject = subjects.find((s: any) => s.id === userSubjectId);

      if (subject) {
        setTeacherSubject(subject);
        const stage = stages.find((st: any) => st.id === subject.stageId || st.id === subject.stage_id);
        
        if (stage) {
          setTeacherStage(stage);
          // تصفية المستويات فقط إذا كانت قائمة المستويات موجودة
          const stageLevels = levels ? levels.filter((l: any) => l.stageId === stage.id) : [];
          setAvailableLevels(stageLevels);
        }
      }
    }
  }, [userDetails, subjects, stages, levels]);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, status: 'approved' | 'draft' = 'approved') => {
    e.preventDefault();
    
    if (!title || !content || !teacherSubject || !levelId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createLesson({
      title,
      content,
      videoUrl: videoUrl || undefined,
      imageUrl: imageUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      subjectId: teacherSubject.id,
      levelId: parseInt(levelId),
      status,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "نجح",
        description: status === 'draft' ? "تم حفظ المسودة بنجاح" : "تم نشر الدرس بنجاح",
      });
      router.push("/dashboard/teacher/lessons");
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل في إنشاء الدرس",
        variant: "destructive",
      });
    }
  };

  // A teacher can only create private lessons, so we don't show the switch.
  // We assume the form submission will enforce this.

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">إنشاء درس جديد</h1>
        <p className="text-muted-foreground">
          املأ النموذج أدناه لإضافة درس جديد. ستكون كل الدروس التي تنشئها خاصة بطلابك المرتبطين بك.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدرس</CardTitle>
          <CardDescription>
            {teacherSubject && teacherStage && `${teacherSubject.name} - ${teacherStage.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, 'approved')} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
              <Input 
                id="title" 
                placeholder="مثال: مقدمة في الجبر" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">المادة</Label>
                <Input 
                  id="subject" 
                  value={teacherSubject?.name || 'جاري التحميل...'}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">المرحلة</Label>
                <Input 
                  id="stage" 
                  value={teacherStage?.name || 'جاري التحميل...'}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">المستوى الدراسي *</Label>
              <Select value={levelId} onValueChange={setLevelId} disabled={!teacherStage || availableLevels.length === 0}>
                <SelectTrigger id="level">
                  <SelectValue placeholder={!teacherStage ? "جاري التحميل..." : "اختر المستوى"} />
                </SelectTrigger>
                <SelectContent>
                  {availableLevels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                اختر المستوى الدراسي المناسب لهذا الدرس
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <RichTextEditor 
                content={content}
                onChange={(newContent) => setContent(newContent)}
                placeholder="اكتب محتوى الدرس هنا..."
                googleDriveParentFolderId={googleDriveParentFolderId || undefined}
              />
              <p className="text-xs text-muted-foreground">
                استخدم شريط الأدوات لتنسيق النص وإضافة معادلات رياضية
              </p>
            </div>

            {/* قسم المرفقات والقائمة المنسدلة */}
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  المرفقات
                </Label>
                
                <Select 
                  disabled={isFileUploading || isSubmitting} 
                  onValueChange={(value) => {
                    if (value === 'image') setShowImageUpload(true);
                    if (value === 'pdf') setShowPdfUpload(true);
                    if (value === 'ppt') setShowPptUpload(true);
                    if (value === 'video') { /* يمكن إضافة منطق الفيديو هنا مستقبلاً */ }
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
                {/* حقل الفيديو - يظهر دائماً لأنه مجرد رابط نصي */}
                <div className="space-y-2">
                  <Label htmlFor="video-url">رابط الفيديو (يوتيوب)</Label>
                  <Input 
                    id="video-url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={isSubmitting} // لا يتعطل أثناء رفع الملفات
                  />
                </div>

                {showImageUpload && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <FileUpload
                      label="صورة الدرس"
                      accept="image/*"
                      maxSizeMB={5}
                      value={imageUrl}
                      onChange={(fileInfo) => {
                        setImageUrl(getProxiedUrl(fileInfo?.fileUrl || ""));
                      }}
                      onUploadStatusChange={setIsFileUploading}
                      parentFolderId={googleDriveParentFolderId || undefined}
                      description="قم بتحميل صورة الغلاف للدرس (JPG, PNG, GIF, حتى 5 ميجابايت)"
                      stage={teacherStage?.name}
                      subject={teacherSubject?.name}
                      teacher={session?.user?.name || "Teacher"}
                      lesson={title}
                    />
                  </div>
                )}

                {showPdfUpload && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <FileUpload
                      label="ملف الدرس (PDF)"
                      accept=".pdf"
                      maxSizeMB={10}
                      value={pdfUrl}
                      onChange={(fileInfo) => setPdfUrl(fileInfo?.fileUrl || "")}
                      onUploadStatusChange={setIsFileUploading}
                      parentFolderId={googleDriveParentFolderId || undefined}
                      description="قم بتحميل ملف PDF للدرس (حتى 10 ميجابايت)"
                      stage={teacherStage?.name}
                      subject={teacherSubject?.name}
                      teacher={session?.user?.name || "Teacher"}
                      lesson={title}
                    />
                  </div>
                )}

                {showPptUpload && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <FileUpload
                      label="ملف عرض تقديمي (PowerPoint)"
                      accept=".ppt,.pptx"
                      maxSizeMB={10}
                      value={pptUrl}
                      onChange={(fileInfo) => {
                        setPptUrl(fileInfo?.fileUrl || "");
                      }}
                      onUploadStatusChange={setIsFileUploading}
                      parentFolderId={googleDriveParentFolderId || undefined}
                      description="قم بتحميل ملف عرض تقديمي (PowerPoint) للدرس (حتى 10 ميجابايت)"
                      stage={teacherStage?.name}
                      subject={teacherSubject?.name}
                      teacher={session?.user?.name || "Teacher"}
                      lesson={title}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={isSubmitting || isFileUploading}
              >
                {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileText className="ml-2 h-4 w-4" />}
                <span>حفظ كمسودة</span>
              </Button>
              <Button type="submit" disabled={isSubmitting || isFileUploading}>
                {isSubmitting || isFileUploading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>{isFileUploading ? "جاري رفع الملفات..." : "جاري الحفظ..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    <span>نشر الدرس</span>
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