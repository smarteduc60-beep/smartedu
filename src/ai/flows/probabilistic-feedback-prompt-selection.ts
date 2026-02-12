'use server';
/**
 * @fileOverview This file implements a Genkit flow for selecting the most relevant feedback prompts for student submissions using a probabilistic model.
 *
 * - probabilisticFeedbackPromptSelection - A function that handles the selection of feedback prompts.
 * - ProbabilisticFeedbackPromptSelectionInput - The input type for the probabilisticFeedbackPromptSelection function.
 * - ProbabilisticFeedbackPromptSelectionOutput - The return type for the probabilisticFeedbackPromptSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentProfileSchema = z.object({
  stage: z.string().describe('The educational stage of the student (e.g., primary, secondary).'),
  level: z.string().describe('The grade level of the student (e.g., 1st grade, 2nd grade).'),
  ai_evaluation_mode: z.enum(['manual', 'auto']).describe('The AI evaluation mode set by the student.'),
});

const SubmissionContentSchema = z.object({
  answer: z.string().describe('The student\'s answer to the exercise question.'),
  question: z.string().describe('The exercise question.'),
  model_answer: z.string().describe('The model answer to the exercise.'),
});

const ProbabilisticFeedbackPromptSelectionInputSchema = z.object({
  studentProfile: StudentProfileSchema.describe('The profile of the student.'),
  submissionContent: SubmissionContentSchema.describe('The content of the student submission.'),
  availablePrompts: z.array(z.string()).describe('The list of available feedback prompts.'),
});

export type ProbabilisticFeedbackPromptSelectionInput = z.infer<typeof ProbabilisticFeedbackPromptSelectionInputSchema>;

const ProbabilisticFeedbackPromptSelectionOutputSchema = z.object({
  selectedPrompt: z.string().describe('The most relevant feedback prompt selected by the AI.'),
});

export type ProbabilisticFeedbackPromptSelectionOutput = z.infer<typeof ProbabilisticFeedbackPromptSelectionOutputSchema>;


export async function probabilisticFeedbackPromptSelection(input: ProbabilisticFeedbackPromptSelectionInput): Promise<ProbabilisticFeedbackPromptSelectionOutput> {
  return probabilisticFeedbackPromptSelectionFlow(input);
}

const probabilisticFeedbackPromptSelectionPrompt = ai.definePrompt({
  name: 'probabilisticFeedbackPromptSelectionPrompt',
  input: {
    schema: ProbabilisticFeedbackPromptSelectionInputSchema,
  },
  output: {
    schema: ProbabilisticFeedbackPromptSelectionOutputSchema,
  },
  prompt: `You are an AI assistant designed to select the most relevant feedback prompt for a student submission.

  Given the following student profile:
  {{studentProfile}}

  And the following submission content:
  {{submissionContent}}

  From the following available prompts:
  {{#each availablePrompts}}
  - {{{this}}}
  {{/each}}

  Select the single most relevant feedback prompt.  Just respond with the text of the single most relevant prompt.
  `,
});

const probabilisticFeedbackPromptSelectionFlow = ai.defineFlow(
  {
    name: 'probabilisticFeedbackPromptSelectionFlow',
    inputSchema: ProbabilisticFeedbackPromptSelectionInputSchema,
    outputSchema: ProbabilisticFeedbackPromptSelectionOutputSchema,
  },
  async input => {
    const {output} = await probabilisticFeedbackPromptSelectionPrompt(input);
    return {
      selectedPrompt: output!.selectedPrompt,
    };
  }
);
