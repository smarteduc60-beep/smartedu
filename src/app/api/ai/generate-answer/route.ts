import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getSession } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  // 1. التحقق من أن المستخدم مسجل دخوله (موجود بالفعل)
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

    // 3. استخلاص السؤال والمادة والمستوى من جسم الطلب
    const { question, subject, level } = await request.json();

    if (!question || typeof question !== 'string' || !question.trim()) {
      return errorResponse('نص السؤال مطلوب.', 400);
    }

    // 4. بناء prompt واضح للذكاء الاصطناعي مع السياق
    // اكتشاف لغة السؤال تلقائياً
    const detectLanguage = (text: string): string => {
      // البحث عن حروف عربية
      if (/[\u0600-\u06FF]/.test(text)) return 'Arabic';
      // البحث عن حروف فرنسية خاصة
      if (/[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/.test(text)) return 'French';
      // افتراض الإنجليزية كلغة افتراضية
      return 'English';
    };
    
    const questionLanguage = detectLanguage(question);
    
    const prompt = `You are an expert teacher in '${subject || 'General'}' for '${level || 'General'}' level.
Your task is to provide a clear and well-structured model answer to the following question.

⚠️ CRITICAL INSTRUCTION - LANGUAGE:
- The question is written in ${questionLanguage}
- You MUST write your ENTIRE answer in ${questionLanguage}
- DO NOT translate or use any other language
- If the question is in Arabic, your answer must be 100% in Arabic
- If the question is in French, your answer must be 100% in French  
- If the question is in English, your answer must be 100% in English

FORMATTING INSTRUCTIONS:
1. Keep the answer CONCISE but COMPLETE - neither too long nor too short
2. Focus on the essential concepts and key steps
3. For mathematical expressions, use INLINE LaTeX format: wrap them with \\( and \\) like this: \\(x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\)
4. For displayed equations (centered), use BLOCK LaTeX format: wrap them with $$ and $$ like this: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
5. Format the answer in simple HTML (use <p>, <strong>, <ul>, <ol>, <li>)
6. For math questions: show the main steps without excessive details
7. Aim for a balance: thorough enough to be useful, brief enough to be practical

Question:
${question}

Model Answer (MUST BE IN ${questionLanguage}, concise, complete, in HTML format with LaTeX for math):`;

    console.log('Calling DeepSeek API with detected language:', questionLanguage);

    // 5. استدعاء DeepSeek API مباشرة
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
            role: 'system',
            content: `You are an expert educational assistant. You MUST respond in the SAME language as the student's question. If the question is in Arabic, respond entirely in Arabic. If in French, respond entirely in French. If in English, respond entirely in English. Never mix languages.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
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
    const generatedAnswer = data.choices?.[0]?.message?.content;

    if (!generatedAnswer) {
      throw new Error('No response from DeepSeek API');
    }

    console.log('DeepSeek API response received');
    
    // التحقق من تطابق اللغة
    const answerLanguage = detectLanguage(generatedAnswer);
    if (answerLanguage !== questionLanguage) {
      console.warn(`⚠️ Language mismatch detected! Question: ${questionLanguage}, Answer: ${answerLanguage}`);
      // سنترك الإجابة كما هي لكن نسجل التحذير
    }

    // 6. تنظيف وتحقق من HTML المولد
    let cleanedAnswer = generatedAnswer.trim();
    
    // إزالة markdown code blocks إذا وجدت
    cleanedAnswer = cleanedAnswer.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    
    // التأكد من أن الإجابة تحتوي على HTML صالح
    if (!cleanedAnswer.includes('<') || !cleanedAnswer.includes('>')) {
      // إذا لم يكن HTML، لفها في paragraphs
      cleanedAnswer = cleanedAnswer.split('\n\n').map((para: string) => 
        para.trim() ? `<p>${para.trim()}</p>` : ''
      ).join('');
    }

    // 7. إرجاع الإجابة المولدة
    return successResponse({ 
      answer: cleanedAnswer,
    });

  } catch (error: any) {
    console.error('Error in AI answer generation:', error);
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      responseBody: error.responseBody,
    });
    
    // تحديد نوع الخطأ
    if (error.message?.includes('API key')) {
      return errorResponse('خطأ في مفتاح API. تأكد من صحة مفتاح DeepSeek.', 500);
    } else if (error.message?.includes('Insufficient Balance') || error.responseBody?.includes('Insufficient Balance')) {
      return errorResponse('الرصيد غير كافٍ في حساب DeepSeek. يرجى إضافة رصيد من: https://platform.deepseek.com/', 402);
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return errorResponse('خطأ في الاتصال بخدمة DeepSeek. تحقق من الاتصال بالإنترنت.', 500);
    } else if (error.statusCode === 402 || error.message?.includes('402')) {
      return errorResponse('الرصيد غير كافٍ في حساب DeepSeek. يرجى إضافة رصيد أو تفعيل الفاتورة.', 402);
    }
    
    return errorResponse('فشل في توليد الإجابة بالذكاء الاصطناعي: ' + (error.message || 'خطأ غير معروف'), 500);
  }
}
