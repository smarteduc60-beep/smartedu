'use server';

/**
 * @fileOverview An AI agent providing feedback on student exercise submissions.
 *
 * - getAiFeedback - A function that handles the AI feedback process.
 * - AiFeedbackInput - The input type for the getAiFeedback function.
 * - AiFeedbackOutput - The return type for the getAiFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiFeedbackInputSchema = z.object({
  studentId: z.number().describe('The ID of the student submitting the answer.'),
  exerciseId: z.number().describe('The ID of the exercise being answered.'),
  answer: z.string().describe('The student’s answer to the exercise.'),
  modelAnswer: z.string().describe('The model answer to the exercise.'),
  studentProfile: z.string().describe('The student profile including learning history and preferences.'),
  submissionFile: z.string().optional().describe(
    "An optional file (image or PDF) submitted by the student, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AiFeedbackInput = z.infer<typeof AiFeedbackInputSchema>;

const AiFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-generated feedback on the student’s answer.'),
  score: z.number().describe('The score assigned to the student’s answer, from 0 to 10. A score of 10 represents a perfect answer.'),
  suggestedPrompts: z.array(z.string()).describe('List of suggested prompts.'),
});
export type AiFeedbackOutput = z.infer<typeof AiFeedbackOutputSchema>;

export async function getAiFeedback(input: AiFeedbackInput): Promise<AiFeedbackOutput> {
  return aiFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiFeedbackPrompt',
  input: {schema: AiFeedbackInputSchema},
  output: {schema: AiFeedbackOutputSchema},
  prompt: `أنت مساعد تعليمي يعمل بالذكاء الاصطناعي، ومهمتك تقديم ملاحظات موجزة للطلاب باللغة العربية.

مهمتك هي تقييم إجابة الطالب. قد تحتوي إجابة الطالب المكتوبة على النتيجة النهائية فقط، بينما يحتوي الملف المرفق (صورة أو PDF) على خطوات الحل التفصيلية.

- يجب عليك تحليل الملف المرفق لفهم طريقة الطالب وخطواته. هذا هو المصدر الأساسي للتقييم.
- الإجابة المكتوبة هي على الأرجح النتيجة النهائية. قارنها بالإجابة النموذجية.
- قدّم درجة من 0 إلى 10 بناءً على صحة الإجابة النهائية والطريقة الموضحة في الملف. الإجابة المثالية يجب أن تحصل على 10 درجات.
- يجب أن تكون ملاحظاتك قصيرة وموجزة وباللغة العربية.
- قدّم قائمة من التوجيهات المقترحة باللغة العربية لمساعدة الطالب.

ملف الطالب: {{{studentProfile}}}
الإجابة النموذجية: {{{modelAnswer}}}
إجابة الطالب المكتوبة (النتيجة النهائية): {{{answer}}}
{{#if submissionFile}}
الملف المرفق من الطالب (خطوات الحل): {{media url=submissionFile}}
{{/if}}

إليك التقييم:
  `,
});

const aiFeedbackFlow = ai.defineFlow(
  {
    name: 'aiFeedbackFlow',
    inputSchema: AiFeedbackInputSchema,
    outputSchema: AiFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
