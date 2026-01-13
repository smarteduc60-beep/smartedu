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
Your task is to provide a model answer for the following question.

⚠️ CRITICAL INSTRUCTION - LANGUAGE:
- The question is written in ${questionLanguage}
- You MUST write the answer in ${questionLanguage}

FORMATTING INSTRUCTIONS:
1. Answer: Concise, complete, HTML format.
2. Math & Chemistry: 
   - ALWAYS wrap mathematical expressions in LaTeX delimiters.
   - Use \\( ... \\) for inline math.
   - Use $$ ... $$ for block math.
   - Example: \\( x \\times y = z \\)
   - Ensure LaTeX commands are correctly escaped for JSON (e.g. "\\\\times" in JSON becomes "\\times" in string).
   - Do NOT double escape LaTeX commands (e.g. do NOT write "\\\\\\\\times").
   - Chemistry Example: \\(H_2O\\), \\(CO_2\\) -> Subscripts are REQUIRED.
3. Provide ONLY ONE model answer.

Question:
${question}

Return ONLY valid JSON in this format:
{
  "answer": "HTML answer string..."
}`;

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
            content: `You are an expert educational assistant. You MUST respond in the SAME language as the student's question. Always return valid JSON.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from DeepSeek API');
    }

    console.log('DeepSeek API response received');
    
    let cleanedAnswer = "";
    try {
        // The AI should return a JSON object. We parse it.
        const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsedData = JSON.parse(jsonStr);
        cleanedAnswer = parsedData.answer || "";
    } catch (e) {
        // If parsing fails, it means the AI didn't follow instructions.
        // We assume the raw content is the answer and log a warning.
        console.warn("AI did not return valid JSON. Using raw content as fallback.", e);
        cleanedAnswer = content;
    }

    if (!cleanedAnswer) {
        // This can happen if the AI returns {"answer": ""} or just ""
        throw new Error('AI returned an empty answer.');
    }
    
    // 6. تنظيف وتحقق من HTML المولد
    // إزالة markdown code blocks إذا وجدت
    cleanedAnswer = cleanedAnswer.replace(/```html\n?/g, '').replace(/```\n?/g, '');

    // تنظيف LaTeX المزدوج (Double Escaping)
    // بعض نماذج الذكاء الاصطناعي تقوم بعمل escaping زائد للرموز الرياضية
    cleanedAnswer = cleanedAnswer
      .replace(/\\\\times/g, '\\times')
      .replace(/\\\\div/g, '\\div')
      .replace(/\\\\cdot/g, '\\cdot')
      .replace(/\\\\frac/g, '\\frac')
      .replace(/\\\\sqrt/g, '\\sqrt')
      .replace(/\\\\pm/g, '\\pm')
      .replace(/\\\\le/g, '\\le')
      .replace(/\\\\ge/g, '\\ge')
      .replace(/\\\\approx/g, '\\approx')
      .replace(/\\\\neq/g, '\\neq')
      .replace(/\\\\in/g, '\\in')
      .replace(/\\\\infty/g, '\\infty')
      .replace(/\\\\left/g, '\\left')
      .replace(/\\\\right/g, '\\right')
      .replace(/\\\\begin/g, '\\begin')
      .replace(/\\\\end/g, '\\end')
      .replace(/\\\\alpha/g, '\\alpha')
      .replace(/\\\\beta/g, '\\beta')
      .replace(/\\\\gamma/g, '\\gamma')
      .replace(/\\\\theta/g, '\\theta')
      .replace(/\\\\pi/g, '\\pi')
      .replace(/\\\\sigma/g, '\\sigma')
      .replace(/\\\\omega/g, '\\omega')
      .replace(/\\\\Delta/g, '\\Delta');

    // إصلاح محددات LaTeX
    cleanedAnswer = cleanedAnswer
      .replace(/\\\\\[/g, '$$')
      .replace(/\\\\\]/g, '$$')
      .replace(/\\\\\(/g, '\\(')
      .replace(/\\\\\)/g, '\\)');

    // Ensure $$ are not escaped
    cleanedAnswer = cleanedAnswer.replace(/\\+\$\$/g, '$$');
    
    // التأكد من أن الإجابة تحتوي على HTML صالح
    if (!cleanedAnswer.includes('<') || !cleanedAnswer.includes('>')) {
      // إذا لم يكن HTML، لفها في paragraphs
      cleanedAnswer = cleanedAnswer.split('\n\n').map((para: string) => 
        para.trim() ? `<p>${para.trim()}</p>` : ''
      ).join('');
    }

    // تحديد اتجاه النص بناءً على المحتوى
    const isArabicAnswer = /[\u0600-\u06FF]/.test(cleanedAnswer);
    if (!isArabicAnswer) {
      // إذا لم يكن النص عربياً، نضيف سمات الاتجاه لوسوم الفقرات والعناوين والقوائم
      cleanedAnswer = cleanedAnswer.replace(/<(p|ul|ol|h[1-6])(?![^>]*dir=)/gi, '<$1 dir="ltr" style="text-align: left"');
      
      // إذا كان النص لا يحتوي على وسوم كتلية، نغلفه في فقرة
      if (!cleanedAnswer.includes('<p') && !cleanedAnswer.includes('<ul') && !cleanedAnswer.includes('<h')) {
         cleanedAnswer = `<p dir="ltr" style="text-align: left">${cleanedAnswer}</p>`;
      }
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
