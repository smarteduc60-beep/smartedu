import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';

// New, smarter function to handle exercise completion and send a detailed NOTIFICATION
async function handleExerciseCompletion(prisma: PrismaClient, studentId: string, submissionId: number) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                subject: { select: { name: true } }
              }
            }
          }
        },
        student: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!submission || !submission.exercise || !submission.student) {
        console.log('handleExerciseCompletion: Submission, exercise, or student not found.');
        return;
    }

    const { exercise, student } = submission;
    const lesson = exercise.lesson;

    const allAttempts = await prisma.submission.findMany({
      where: { studentId: student.id, exerciseId: exercise.id, status: 'graded' },
      orderBy: { submittedAt: 'asc' },
    });
    
    const attemptCount = allAttempts.length;
    if (attemptCount === 0) {
        console.log('handleExerciseCompletion: No graded attempts found.');
        return;
    }

    const maxAttempts = exercise.maxAttempts ?? Infinity;
    
    let bestScore = -1;
    let bestSubmission = allAttempts[0];
    
    for (const attempt of allAttempts) {
      const score = Number(attempt.finalScore ?? attempt.aiScore ?? -1);
      if (score > bestScore) {
        bestScore = score;
        bestSubmission = attempt;
      }
    }

    const maxScore = Number(exercise.maxScore ?? 20);
    
    const isMaxAttemptsReached = attemptCount >= maxAttempts;
    const isPerfectScore = bestScore >= maxScore;

    if (!isMaxAttemptsReached && !isPerfectScore) {
      console.log(`handleExerciseCompletion: Exercise not completed for student ${student.id}. Attempts: ${attemptCount}/${maxAttempts}, Score: ${bestScore}/${maxScore}`);
      return;
    }

    // --- Exercise is completed, proceed with sending a notification ---
    console.log(`handleExerciseCompletion: Exercise IS completed for student ${student.id}.`);

    const parentLink = await prisma.parentChildLink.findFirst({
      where: { childId: student.id },
      select: { parentId: true },
    });

    if (!parentLink) {
        console.log(`handleExerciseCompletion: No parent found for student ${student.id}.`);
        return;
    }

    const studentName = `${student.firstName} ${student.lastName}`;
    const subjectName = lesson.subject?.name ?? "مادة غير محددة";
    const aiFeedback = bestSubmission.aiFeedback ?? 'لا توجد ملاحظات آلية.';

    const notificationTitle = `نتيجة تمرين جديدة لابنك ${studentName}`;
    const notificationMessage = `أكمل ابنك تمرينًا في مادة "${subjectName}".\nالنتيجة النهائية: **${bestScore.toFixed(1)} / ${maxScore.toFixed(1)}**.\n\nإليك ملاحظات المصحح الآلي:\n---\n${aiFeedback}`;

    await prisma.notification.create({
      data: {
        userId: parentLink.parentId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'submission_graded',
        relatedId: bestSubmission.id,
      },
    });

    console.log(`Sent exercise completion NOTIFICATION to parent ${parentLink.parentId} for student ${student.id}`);

  } catch (error) {
    console.error('Error in handleExerciseCompletion:', error);
    // Do not re-throw error, as this is a non-critical background task.
  }
}

// POST /api/submissions/[id]/evaluate - Evaluate submission with AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const submissionId = parseInt(id);

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        exercise: {
          include: {
            lesson: {
              include: {
                subject: true,
                level: true,
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    if (!submission) {
      return errorResponse('الإجابة غير موجودة', 404);
    }

    if (session.user.role === 'student' && submission.studentId !== session.user.id) {
      return errorResponse('غير مصرح بالوصول', 403);
    }

    const studentAnswer = submission.answerText || submission.answerRichContent || "";
    const modelAnswer = submission.exercise.modelAnswer || "";
    const question = submission.exercise.question || submission.exercise.questionRichContent || "سؤال بدون نص";
    
    if (!studentAnswer) {
        return errorResponse('لا توجد إجابة للتقييم', 400);
    }

    const maxScoreValue = submission.exercise.maxScore ? Number(submission.exercise.maxScore) : 20;
    const subjectName = submission.exercise.lesson.subject?.name || "عام";

    if (!process.env.DEEPSEEK_API_KEY) {
        console.error('DEEPSEEK_API_KEY is missing');
        return errorResponse('مفتاح DeepSeek API غير مُعيّن في الخادم.', 500);
    }

    const prompt = `You are an expert teacher in '${subjectName}'. Your task is to evaluate the student's answer with human-like understanding, focusing on the meaning rather than exact wording.

Question:
${question}

Model Answer:
${modelAnswer}

Student Answer:
${studentAnswer}

Max Score: ${maxScoreValue}

Evaluation Criteria:
1. **Semantic Matching**: Check if the student conveys the correct *meaning* and *concepts*, even if they use different words, synonyms, or sentence structures compared to the model answer.
2. **Partial Credit**: If the answer is partially correct, award points accordingly.
3. **Flexibility**: Do NOT penalize for spelling mistakes or grammar unless they change the scientific meaning.
4. **Context**: Understand the context of the question. If the student demonstrates understanding, give them credit.

Output Requirements:
1. Provide a score out of ${maxScoreValue} (use English digits 0-9).
2. Provide brief, constructive feedback in Arabic explaining why this score was given.
3. Return ONLY valid JSON.

Return ONLY valid JSON in this format:
{
  "score": number,
  "feedback": "string"
}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are an AI tutor evaluating student answers. Return JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API Error:', response.status, errorData);
      
      if (response.status === 402) {
        return errorResponse('الرصيد غير كافٍ في حساب DeepSeek لإجراء التقييم.', 402);
      }
      
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    let result: any = {};
    try {
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI JSON:", content);
      const scoreMatch = content.match(/(?:["']?score["']?|["']?الدرجة["']?)\s*[:=]\s*["']?([0-9٠-٩]+(?:\.[0-9٠-٩]+)?)/i);
      const feedbackMatch = content.match(/(?:["']?feedback["']?|["']?ملاحظات["']?)\s*[:=]\s*["']?([^"'}]+)/i);
      
      if (scoreMatch) result.score = scoreMatch[1];
      if (feedbackMatch) result.feedback = feedbackMatch[1];
    }

    let parsedScore = result.score !== undefined ? result.score : result.Score;
    
    if (parsedScore === undefined || parsedScore === null) {
        parsedScore = 0;
    }

    if (typeof parsedScore === 'string') {
        parsedScore = parsedScore.replace(/[٠-٩]/g, (d: string) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
        parsedScore = parsedScore.replace(/[^0-9.]/g, ''); // Keep only numbers and dots
        parsedScore = parseFloat(parsedScore);
    }
    
    const finalScore = isNaN(Number(parsedScore)) ? 0 : Number(parsedScore);
    const calculatedScore = Math.min(Math.max(0, finalScore), maxScoreValue);
    
    const feedback = result.feedback || result.Feedback || "تم التقييم (لا توجد ملاحظات)";

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiScore: calculatedScore,
        finalScore: calculatedScore,
        aiFeedback: feedback,
        gradedAt: new Date(),
        status: 'graded',
      },
    });

    // --- Update Best Score for all submissions of this exercise ---
    const allAttemptsForExercise = await prisma.submission.findMany({
      where: {
        studentId: submission.studentId,
        exerciseId: submission.exerciseId,
        status: 'graded'
      },
      select: { finalScore: true, aiScore: true }
    });

    let bestScoreForExercise = 0;
    allAttemptsForExercise.forEach(attempt => {
      const score = Number(attempt.finalScore ?? attempt.aiScore ?? 0);
      if (score > bestScoreForExercise) bestScoreForExercise = score;
    });

    await prisma.submission.updateMany({
        where: {
            studentId: submission.studentId,
            exerciseId: submission.exerciseId,
        },
        data: { bestScore: bestScoreForExercise }
    });
    
    (updatedSubmission as any).bestScore = bestScoreForExercise;

    // Asynchronously handle completion logic without blocking the response
    handleExerciseCompletion(prisma, submission.studentId, submissionId).catch(error => {
        console.error('Failed to execute handleExerciseCompletion:', error);
    });

    return successResponse(updatedSubmission, 'تم تقييم الإجابة بنجاح');
  } catch (error: any) {
    console.error('Error evaluating submission:', error);
    return errorResponse(error.message || 'فشل في تقييم الإجابة', 500);
  }
}
