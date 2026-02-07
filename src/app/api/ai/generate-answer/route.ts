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
    const { question, subject, level, mode } = await request.json();

    if (!question || typeof question !== 'string' || !question.trim()) {
      return errorResponse('نص السؤال مطلوب.', 400);
    }

    // Clean HTML tags from question for better AI processing
    const cleanQuestion = question.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

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
    
    const questionLanguage = detectLanguage(cleanQuestion);
    let prompt = '';
    let systemMessage = '';

    if (mode === 'geometry') {
      // وضع الهندسة: توليد أوامر JSON
      systemMessage = `You are an expert geometry engine. You MUST respond with only a valid JSON array.`;
      prompt = `You are an expert geometry engine. Your task is to convert a natural language question into a sequence of structured JSON commands for a 2D geometry canvas.

**CRITICAL INSTRUCTIONS:**
1.  **Output Format:** You MUST respond with a valid JSON array of command objects. Do NOT include any other text, explanations, or markdown formatting like \`\`\`json. Your entire response must be the raw JSON array.
2.  **Language:** The question is in ${questionLanguage}. All labels in your JSON output must also be in ${questionLanguage}.
3.  **Coordinate System:** Assume a standard 2D Cartesian coordinate system. Choose reasonable coordinates to make the drawing clear.
4.  **IDs:** Every created element MUST have a unique \`id\` (string). Subsequent commands will refer to these IDs.
5.  **Axes & Grid:** The canvas automatically provides axes and a grid. Your task is to draw shapes ON the canvas, not to draw the canvas itself.
    - **If the question includes "ارسم معلم متعامد ومتجانس" or similar phrases, IGNORE this part.**
    - **Focus ONLY on commands like "عين النقطة" (plot point), "ارسم قطعة" (draw segment), etc.**

**Available Commands (DSL):**
*   **Point:** \`{ "type": "point", "id": "A", "position": [x, y], "options": { "name": "A", "size": 3, "color": "blue" } }\`
*   **Line:** \`{ "type": "line", "id": "lineAB", "points": ["A", "B"], "options": { "strokeColor": "gray" } }\`
*   **Segment:** \`{ "type": "segment", "id": "segAB", "points": ["A", "B"], "options": { "strokeColor": "black" } }\`
*   **Circle:** \`{ "type": "circle", "id": "c1", "center": "A", "radius": 3, "options": { "strokeColor": "red" } }\` (radius can be a number or a point ID)
*   **Polygon:** \`{ "type": "polygon", "id": "poly1", "points": ["A", "B", "C"], "options": { "fillColor": "yellow", "fillOpacity": 0.3 } }\`
*   **Angle:** \`{ "type": "angle", "id": "ang1", "points": ["A", "B", "C"], "options": { "name": "90°" } }\` (points: [point1, vertex, point2])

**EXAMPLE 1:**
Question: "ارسم مثلث ABC قائم الزاوية في A."
Output:
[
  { "type": "point", "id": "A", "position": [0, 0], "options": { "name": "A", "fixed": true } },
  { "type": "point", "id": "B", "position": [4, 0], "options": { "name": "B" } },
  { "type": "point", "id": "C", "position": [0, 3], "options": { "name": "C" } },
  { "type": "segment", "id": "segAB", "points": ["A", "B"] },
  { "type": "segment", "id": "segBC", "points": ["B", "C"] },
  { "type": "segment", "id": "segCA", "points": ["C", "A"] },
  { "type": "polygon", "id": "triABC", "points": ["A", "B", "C"], "options": { "fillColor": "#e0e0e0" } },
  { "type": "angle", "id": "angleA", "points": ["B", "A", "C"], "options": { "name": "90°" } }
]

**EXAMPLE 2:**
Question: "في معلم متعامد ومتجانس، عين النقط A(1,2) و B(-3,4)."
Output:
[
  { "type": "point", "id": "A", "position": [1, 2], "options": { "name": "A" } },
  { "type": "point", "id": "B", "position": [-3, 4], "options": { "name": "B" } }
]

**CURRENT TASK:**
Question: "${cleanQuestion}"
Your JSON Output (raw JSON array only):`;

    } else {
      // الوضع الافتراضي: توليد إجابة نصية (HTML)
      systemMessage = `You are an expert educational assistant. You MUST respond in the SAME language as the student's question. If the question is in Arabic, respond entirely in Arabic. If in French, respond entirely in French. If in English, respond entirely in English. Never mix languages.`;
    
      prompt = `You are an expert teacher in '${subject || 'General'}' for '${level || 'General'}' level.
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
4. **IMPORTANT**: Use the specific numbers and values from the question. Do NOT generate a generic template with placeholders. If the question is "Create a triangle with sides 3, 4, 5", use 3, 4, and 5 in your answer steps.

5. **GEOMETRY QUESTIONS**:
   - A visual drawing is already provided to the student.
   - **DO NOT** describe the drawing steps in detail (e.g., "Draw a line from A to B", "Plot point C").
   - **FOCUS ONLY** on the analytical solution, calculations, logical proofs, and justifications.
   - Briefly mention the construction only if it's part of the proof logic (e.g., "Since C is the midpoint...").

Question:
${cleanQuestion}

Return ONLY valid JSON in this format:
{
  "answer": "HTML answer string..."
}`;
    }

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
            content: systemMessage,
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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from DeepSeek API');
    }

    console.log('DeepSeek API response received');
    
    if (mode === 'geometry') {
      let geometryCommands;
      try {
        // تنظيف ومحاولة تحليل JSON
        const cleanedJsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        geometryCommands = JSON.parse(cleanedJsonString);
        
        if (!Array.isArray(geometryCommands)) {
          throw new Error('AI response is not a JSON array.');
        }
      } catch (parseError: any) {
        console.error('Failed to parse JSON from AI response:', parseError);
        return errorResponse('فشل الذكاء الاصطناعي في توليد أوامر رسم صالحة.', 500);
      }

      return successResponse({ geometryCommands });
    }

    let cleanedAnswer = "";
    try {
        // The AI should return a JSON object. We parse it.
        let jsonStr = content.replace(/```json\n?|```/g, '').trim();

        // Remove "json" prefix if present (sometimes AI adds it without code blocks)
        if (jsonStr.toLowerCase().startsWith('json')) {
            jsonStr = jsonStr.substring(4).trim();
        }

        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const parsedData = JSON.parse(jsonStr);
        cleanedAnswer = parsedData.answer || "";
    } catch (e) {
        // If parsing fails, it means the AI didn't follow instructions.
        // We assume the raw content is the answer and log a warning.
        console.warn("AI did not return valid JSON. Attempting manual cleanup.", e);
        
        // Attempt to clean up the raw content
        let fallback = content.replace(/```json\n?|```/g, '').trim();
        if (fallback.toLowerCase().startsWith('json')) {
            fallback = fallback.substring(4).trim();
        }

        // Try to extract the answer value manually if it looks like the expected JSON structure
        const startMarker = '"answer": "';
        const idx = fallback.indexOf(startMarker);
        const lastQuote = fallback.lastIndexOf('"');

        if (idx !== -1 && lastQuote > idx + startMarker.length) {
            cleanedAnswer = fallback.substring(idx + startMarker.length, lastQuote)
                .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        } else {
            cleanedAnswer = fallback;
        }
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
