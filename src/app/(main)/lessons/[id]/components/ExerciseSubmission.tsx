"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleSubmission, type SubmissionState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Lightbulb, Loader2, Paperclip, Send, X } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import MathContent from "@/components/MathContent";

const initialState: SubmissionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>جاري التقييم...</span>
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          <span>إرسال الإجابة</span>
        </>
      )}
    </Button>
  );
}

export default function ExerciseSubmission({ exercise }: { exercise: Exercise }) {
  const [state, formAction] = useFormState(handleSubmission, initialState);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="exerciseId" value={exercise.id} />
        
        <div>
          <Label htmlFor="answer-textarea">اكتب إجابتك هنا أو ارفق ملفًا</Label>
          <Textarea
            id="answer-textarea"
            name="answer"
            placeholder="اكتب إجابتك هنا..."
            rows={5}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
            <Label htmlFor="file-upload">إرفاق ملف (اختياري)</Label>
            <div className="flex items-center gap-2">
                <Input 
                    id="file-upload" 
                    name="submissionFile" 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4 ml-2"/>
                    <span>اختر ملفًا</span>
                </Button>
                {fileName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                        <span>{fileName}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveFile}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
             <p className="text-xs text-muted-foreground">يمكنك إرفاق صورة أو ملف PDF لحلك.</p>
        </div>


        {state?.error && (
            <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {state.error}
            </p>
        )}
        <SubmitButton />
      </form>

      {state?.feedback && (
        <Card className="bg-secondary/50 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
                <CheckCircle2 />
                <span>تقييم الذكاء الاصطناعي</span>
            </CardTitle>
            <CardDescription>هذه هي الملاحظات على إجابتك.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">التقييم:</h4>
              <div className="text-muted-foreground">
                <MathContent content={state.feedback || ''} />
              </div>
            </div>
             {state.score !== undefined && (
              <div>
                <h4 className="font-semibold mb-2">الدرجة:</h4>
                <div className="flex items-center gap-2">
                    <div className="w-full bg-muted rounded-full h-4">
                         <div
                            className="bg-primary h-4 rounded-full"
                            style={{ width: `${state.score * 10}%` }}
                         ></div>
                    </div>
                    <span className="font-bold text-lg text-primary">{state.score}/10</span>
                </div>
              </div>
            )}
          </CardContent>
          {state.suggestedPrompts && state.suggestedPrompts.length > 0 && (
            <CardFooter className="flex flex-col items-start gap-2">
                 <h4 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>نقاط للتفكير</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                    {state.suggestedPrompts.map((prompt, index) => (
                        <Button key={index} variant="outline" size="sm">
                            {prompt}
                        </Button>
                    ))}
                </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
