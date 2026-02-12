"use server";

import { z } from "zod";
import { getAiFeedback } from "@/ai/flows/ai-submission-feedback";

export type SubmissionState = {
  feedback?: string;
  score?: number;
  suggestedPrompts?: string[];
  error?: string;
};

const submissionSchema = z.object({
  answer: z.string(),
  exerciseId: z.string(),
  submissionFile: z.instanceof(File).optional(),
});

export async function handleSubmission(
  prevState: SubmissionState,
  formData: FormData
): Promise<SubmissionState> {
  try {
    const parsed = submissionSchema.safeParse({
      answer: formData.get("answer"),
      exerciseId: formData.get("exerciseId"),
      submissionFile: formData.get("submissionFile"),
    });

    if (!parsed.success) {
      return { error: "البيانات المدخلة غير صالحة." };
    }

    const { answer, exerciseId, submissionFile } = parsed.data;

    if (!answer && (!submissionFile || submissionFile.size === 0)) {
        return { error: "يجب عليك كتابة إجابة أو إرفاق ملف." };
    }

    // Fetch exercise from API
    const exerciseRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/exercises/${exerciseId}`);
    if (!exerciseRes.ok) {
      return { error: "لم يتم العثور على التمرين." };
    }
    const exercise = await exerciseRes.json();

    // TODO: Get student from session instead of mock
    const student = { id: 1, level_id: 1, ai_evaluation_mode: 'auto' };

    let fileDataUri: string | undefined = undefined;
    if (submissionFile && submissionFile.size > 0) {
        const fileBuffer = Buffer.from(await submissionFile.arrayBuffer());
        fileDataUri = `data:${submissionFile.type};base64,${fileBuffer.toString("base64")}`;
    }

    const feedbackResponse = await getAiFeedback({
      studentId: student.id,
      exerciseId: exercise.id,
      answer: answer,
      modelAnswer: exercise.model_answer,
      studentProfile: `المستوى: ${student.level_id}, نمط التقييم: ${student.ai_evaluation_mode}`,
      submissionFile: fileDataUri
    });

    if (!feedbackResponse) {
      return { error: "حدث خطأ أثناء الحصول على تقييم الذكاء الاصطناعي." };
    }

    return {
      feedback: feedbackResponse.feedback,
      score: feedbackResponse.score,
      suggestedPrompts: feedbackResponse.suggestedPrompts,
    };
  } catch (e) {
    console.error(e);
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." };
  }
}
