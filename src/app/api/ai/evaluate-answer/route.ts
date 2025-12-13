import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getSession } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  // 1. التحقق من أن المستخدم مسجل دخوله
  const session = await getSession();
  if (!session?.user?.id) {
    return errorResponse('غير مصرح به. يرجى تسجيل الدخول.', 401);
  }

  try {
    // 2. التحقق من مفتاح API
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured');
      return errorResponse('مفتاح DeepSeek API غير مُعيّن في ملف البيئة.', 500);
    }

    // 3. استخلاص البيانات من جسم الطلب
    const { 
      studentAnswer, 
      modelAnswer, 
      question, 
      maxScore = 10,
      subject,
      level 
    } = await request.json();

    // 4. التحقق من صحة البيانات
    if (!studentAnswer || !studentAnswer.trim()) {
      return errorResponse('إجابة الطالب مطلوبة.', 400);
    }

    if (!modelAnswer || !modelAnswer.trim()) {
      return errorResponse('الإجابة النموذجية مطلوبة.', 400);
    }

    if (!question || !question.trim()) {
      return errorResponse('نص السؤال مطلوب.', 400);
    }

    // 5. بناء prompt مفصل للتصحيح
    const prompt = `You are a fair and objective evaluator for '${subject || 'General'}' at '${level || 'General'}' level.

⚠️ CRITICAL EVALUATION RULES - READ CAREFULLY:

1. PRIMARY CRITERION: Is the answer CORRECT?
   - If the final answer/result is CORRECT → Award 90-100% of marks
   - Correctness is MORE IMPORTANT than explanation length

2. EXPLANATION REQUIREMENT:
   - Check if the question EXPLICITLY asks for explanation/steps/justification
   - If question asks ONLY for the answer → Do NOT penalize for missing explanation
   - If question says "احسب" (calculate), "أوجد" (find), "ما هو" (what is) → Answer alone is sufficient
   - If question says "اشرح" (explain), "برر" (justify), "بين الخطوات" (show steps) → Then require explanation

3. SCORING GUIDELINES:
   - Correct answer WITHOUT explanation (when not required): 90-100%
   - Correct answer WITH good explanation: 100%
   - Correct answer with minor errors in explanation: 85-95%
   - Partially correct answer: 50-75%
   - Wrong answer with correct method: 30-50%
   - Wrong answer and method: 0-20%

4. AVOID OVER-PENALIZATION:
   - Do NOT deduct more than 10% for brevity if answer is correct
   - Do NOT deduct for "lack of detail" if the core answer is right
   - Focus on ERRORS, not on "what's missing" unless explicitly required

5. LANGUAGE: Provide feedback in the SAME LANGUAGE as the question.

═══════════════════════════════════════

Question:
${question}

Model Answer (reference - student doesn't need to match exactly):
${modelAnswer}

Student's Answer:
${studentAnswer}

Maximum Score: ${maxScore}

═══════════════════════════════════════

Evaluate NOW and return ONLY valid JSON (no markdown):
{
  "score": number_between_0_and_${maxScore},
  "rating": "ممتاز/جيد جداً/جيد/مقبول/ضعيف",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف إن وجدت"],
  "feedback": "ملاحظات بناءة موجزة"
}

REMEMBER: Correct answer = High score, regardless of explanation length!`;

    console.log('Calling DeepSeek API for evaluation...');

    // 6. استدعاء DeepSeek API مباشرة
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // درجة حرارة منخفضة للدقة في التقييم
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', response.status, errorData);
      
      if (response.status === 402) {
        return errorResponse('الرصيد غير كافٍ في حساب DeepSeek. يرجى إضافة رصيد من: https://platform.deepseek.com/', 402);
      }
      
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const evaluationResult = data.choices?.[0]?.message?.content;

    if (!evaluationResult) {
      throw new Error('No response from DeepSeek API');
    }

    console.log('DeepSeek evaluation received:', evaluationResult);

    // 7. محاولة تحليل النتيجة كـ JSON
    let evaluation;
    try {
      // إزالة markdown code blocks إذا وجدت
      let cleanedResult = evaluationResult.trim();
      cleanedResult = cleanedResult.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      evaluation = JSON.parse(cleanedResult);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw response:', evaluationResult);
      
      // محاولة استخراج البيانات يدوياً
      try {
        const scoreMatch = evaluationResult.match(/"score"\s*:\s*(\d+\.?\d*)/);
        const ratingMatch = evaluationResult.match(/"rating"\s*:\s*"([^"]+)"/);
        
        evaluation = {
          score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
          rating: ratingMatch ? ratingMatch[1] : 'غير محدد',
          strengths: ['تم استلام التقييم'],
          weaknesses: [],
          feedback: evaluationResult,
        };
      } catch (extractError) {
        return errorResponse('فشل في تحليل نتيجة التقييم.', 500);
      }
    }

    // 8. التحقق من صحة البيانات المستخرجة
    if (typeof evaluation.score !== 'number') {
      evaluation.score = 0;
    }

    // التأكد من أن الدرجة في النطاق الصحيح
    evaluation.score = Math.max(0, Math.min(maxScore, evaluation.score));

    // 9. إرجاع النتيجة
    return successResponse({
      score: evaluation.score,
      maxScore: maxScore,
      percentage: Math.round((evaluation.score / maxScore) * 100),
      rating: evaluation.rating || 'غير محدد',
      strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
      weaknesses: Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [],
      feedback: evaluation.feedback || 'تم التقييم بنجاح',
      evaluatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in AI evaluation:', error);
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    
    // تحديد نوع الخطأ
    if (error.message?.includes('API key')) {
      return errorResponse('خطأ في مفتاح API. تأكد من صحة مفتاح DeepSeek.', 500);
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return errorResponse('خطأ في الاتصال بخدمة DeepSeek. تحقق من الاتصال بالإنترنت.', 500);
    }
    
    return errorResponse('فشل في تقييم الإجابة: ' + (error.message || 'خطأ غير معروف'), 500);
  }
}
