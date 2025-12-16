'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ExerciseSubmissionFormProps {
  exercise: {
    id: number;
    question: string;
    questionFileUrl?: string;
    maxScore?: number;
  };
  onSubmissionComplete?: () => void;
}

export default function ExerciseSubmissionForm({ exercise, onSubmissionComplete }: ExerciseSubmissionFormProps) {
  const { toast } = useToast();
  const [answer, setAnswer] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [submission, setSubmission] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() && !imageFile) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة إجابة أو رفع صورة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('exerciseId', exercise.id.toString());
      formData.append('answerText', answer);
      if (imageFile) {
        formData.append('answerImage', imageFile);
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmission(result.data);
        toast({
          title: "تم الإرسال",
          description: "تم حفظ إجابتك بنجاح",
        });
      } else {
        toast({
          title: "فشل الإرسال",
          description: result.error || "حدث خطأ",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الإجابة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEvaluate = async () => {
    if (!submission) {
      toast({
        title: "خطأ",
        description: "يجب إرسال الإجابة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch(`/api/submissions/${submission.id}/evaluate`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setSubmission(result.data);
        toast({
          title: "تم التقييم",
          description: `درجتك: ${result.data.score}/${exercise.maxScore || 10}`,
        });
        if (onSubmissionComplete) {
          onSubmissionComplete();
        }
      } else {
        toast({
          title: "فشل التقييم",
          description: result.error || "حدث خطأ",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التقييم",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>إجابتك</span>
          {submission && (
            <Badge variant={submission.score >= (exercise.maxScore || 10) * 0.6 ? 'default' : 'destructive'}>
              {submission.score}/{exercise.maxScore || 10}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="answer">الإجابة النصية</Label>
          <Textarea
            id="answer"
            placeholder="اكتب إجابتك هنا..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            disabled={!!submission}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">أو ارفع صورة للحل</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={!!submission}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="معاينة"
                className="max-w-full h-auto max-h-64 rounded-lg border"
              />
            </div>
          )}
        </div>

        {submission?.feedback && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-sm">ملاحظات الذكاء الاصطناعي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{submission.feedback}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          {!submission ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              <Send className="ml-2 h-4 w-4" />
              إرسال الإجابة
            </Button>
          ) : (
            <Button onClick={handleEvaluate} disabled={isEvaluating || !!submission.score} className="flex-1">
              {isEvaluating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {submission.score ? 'تم التقييم' : 'تقييم بالذكاء الاصطناعي'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
