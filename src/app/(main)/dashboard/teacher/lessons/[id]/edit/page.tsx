'use client';

import { useState, useEffect, use } from "react";
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
import { useStages, useLevels, useSubjects } from "@/hooks";
import { Save, Loader2, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor";
import { FileUpload } from "@/components/FileUpload";

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { stages } = useStages();
  const { levels } = useLevels();
  const { subjects } = useSubjects();
  
  const [teacherSubject, setTeacherSubject] = useState<any>(null);
  const [teacherStage, setTeacherStage] = useState<any>(null);
  const [availableLevels, setAvailableLevels] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [levelId, setLevelId] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالات للتحكم في ظهور المرفقات وحالة الرفع
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [showPptUpload, setShowPptUpload] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  // 1. جلب بيانات المعلم (المادة والمرحلة)
  useEffect(() => {
    const setTeacherInfo = async () => {
      if (!session?.user?.id || !subjects || !stages || !levels) return;
      if (subjects.length === 0 || stages.length === 0 || levels.length === 0) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        const result = await response.json();

        if (result.success && result.data?.userDetails?.subjectId) {
          const userSubjectId = result.data.userDetails.subjectId;
          const subject = subjects.find((s: any) => s.id === userSubjectId);

          if (subject) {
            setTeacherSubject(subject);
            const stage = stages.find((st: any) => st.id === subject.stageId || st.id === subject.stage_id);
            
            if (stage) {
              setTeacherStage(stage);
              const stageLevels = levels.filter((l: any) => l.stageId === stage.id);
              setAvailableLevels(stageLevels);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };

    setTeacherInfo();
  }, [session, subjects, stages, levels]);

  // 2. جلب بيانات الدرس الحالي وملء النموذج
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        
        if (!response.ok) {
          throw new Error(`فشل في جلب البيانات: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          const lesson = result.data;
          setTitle(lesson.title);
          setContent(lesson.content || "");
          setVideoUrl(lesson.videoUrl || "");
          setImageUrl(lesson.imageUrl || "");
          setPdfUrl(lesson.pdfUrl || "");
          // setPptUrl(lesson.pptUrl || ""); // تفعيل هذا السطر عند إضافة الحقل لقاعدة البيانات
          
          if (lesson.levelId) {
            setLevelId(String(lesson.levelId));
          }

          // إظهار حقول الرفع تلقائياً إذا كان هناك ملفات موجودة
          if (lesson.imageUrl) setShowImageUpload(true);
          if (lesson.pdfUrl) setShowPdfUpload(true);
          // if (lesson.pptUrl) setShowPptUpload(true);
        } else {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على الدرس",
            variant: "destructive",
          });
          router.push("/dashboard/teacher/lessons");
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات الدرس",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchLesson();
  }, [lessonId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          videoUrl: videoUrl || null,
          imageUrl: imageUrl || null,
          pdfUrl: pdfUrl || null,
          // pptUrl: pptUrl || null,
          subjectId: teacherSubject.id,
          levelId: parseInt(levelId),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "تم التحديث",
          description: "تم تعديل الدرس بنجاح",
        });
        router.push("/dashboard/teacher/lessons");
      } else {
        throw new Error(result.error || "فشل في تحديث الدرس");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل بيانات الدرس...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">تعديل الدرس</h1>
        <p className="text-muted-foreground">
          قم بتعديل محتوى الدرس أو المرفقات أدناه.
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدرس *</Label>
              <RichTextEditor 
                content={content}
                onChange={(newContent) => setContent(newContent)}
                placeholder="اكتب محتوى الدرس هنا..."
              />
            </div>

            {/* قسم المرفقات - مطابق لصفحة الإنشاء */}
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
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={isSubmitting}
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
                        setImageUrl(fileInfo?.fileUrl || "");
                      }}
                      onUploadStatusChange={setIsFileUploading}
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
              <Button type="submit" disabled={isSubmitting || isFileUploading}>
                {isSubmitting || isFileUploading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    <span>{isFileUploading ? "جاري رفع الملفات..." : "جاري الحفظ..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    <span>حفظ التعديلات</span>
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