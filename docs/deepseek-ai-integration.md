# DeepSeek AI Integration Documentation

## نظرة عامة
تم دمج DeepSeek AI في المنصة لتوفير:
1. توليد إجابات نموذجية تلقائياً
2. تصحيح إجابات الطلاب تلقائياً

## Endpoints متاحة

### 1. توليد إجابة نموذجية
**Endpoint:** `POST /api/ai/generate-answer`

**الاستخدام:**
```typescript
const response = await fetch('/api/ai/generate-answer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'ما هي قوانين نيوتن للحركة؟',
    subject: 'الفيزياء',
    level: 'الصف الأول ثانوي',
  }),
});

const data = await response.json();
console.log(data.data.answer); // HTML formatted answer
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "answer": "<p>قوانين نيوتن للحركة هي...</p>"
  }
}
```

---

### 2. تقييم إجابة طالب
**Endpoint:** `POST /api/ai/evaluate-answer`

**الاستخدام:**
```typescript
const response = await fetch('/api/ai/evaluate-answer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'اشرح قانون نيوتن الأول',
    modelAnswer: '<p>قانون نيوتن الأول ينص على أن الجسم...</p>',
    studentAnswer: '<p>إجابة الطالب هنا...</p>',
    maxScore: 10,
    subject: 'الفيزياء',
    level: 'الصف الأول ثانوي',
  }),
});

const data = await response.json();
console.log(data.data);
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "score": 8.5,
    "maxScore": 10,
    "percentage": 85,
    "rating": "جيد جداً",
    "strengths": [
      "فهم صحيح للمفهوم الأساسي",
      "أمثلة جيدة"
    ],
    "weaknesses": [
      "ينقصه بعض التفاصيل",
      "يمكن تحسين الصياغة"
    ],
    "feedback": "إجابة جيدة بشكل عام، لكن يمكن إضافة المزيد من التفاصيل...",
    "evaluatedAt": "2025-12-10T10:30:00.000Z"
  }
}
```

---

## إضافة زر التوليد التلقائي

### في صفحة إنشاء تمرين:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function CreateExercisePage() {
  const [generating, setGenerating] = useState(false);
  const [question, setQuestion] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');

  const handleGenerateAnswer = async () => {
    if (!question.trim()) {
      alert('يرجى إدخال نص السؤال أولاً');
      return;
    }

    setGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          subject: 'الفيزياء',
          level: 'الصف الأول ثانوي',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setModelAnswer(data.data.answer);
      } else {
        alert(data.message || 'فشل في توليد الإجابة');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء توليد الإجابة');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* حقل السؤال */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="أدخل نص السؤال..."
      />

      {/* حقل الإجابة النموذجية */}
      <div>
        <label>الإجابة النموذجية</label>
        <Button
          type="button"
          onClick={handleGenerateAnswer}
          disabled={generating}
          variant="outline"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 ml-2" />
              توليد بالذكاء الاصطناعي
            </>
          )}
        </Button>
        <div dangerouslySetInnerHTML={{ __html: modelAnswer }} />
      </div>
    </div>
  );
}
```

---

## إضافة التصحيح التلقائي

### في صفحة عرض إجابات الطلاب:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';

export default function StudentSubmissionPage() {
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleAutoEvaluate = async (submission) => {
    setEvaluating(true);
    
    try {
      const response = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: submission.exercise.question,
          modelAnswer: submission.exercise.modelAnswer,
          studentAnswer: submission.answer,
          maxScore: submission.exercise.maxScore,
          subject: submission.exercise.subject,
          level: submission.exercise.level,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.data);
        // يمكنك حفظ التقييم في قاعدة البيانات هنا
      } else {
        alert(data.message || 'فشل في التقييم');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء التقييم');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => handleAutoEvaluate(submission)}
        disabled={evaluating}
      >
        {evaluating ? (
          <>
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            جاري التقييم...
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 ml-2" />
            تقييم تلقائي بالذكاء الاصطناعي
          </>
        )}
      </Button>

      {evaluation && (
        <div className="mt-4 p-4 border rounded">
          <h3>نتيجة التقييم</h3>
          <p><strong>الدرجة:</strong> {evaluation.score} / {evaluation.maxScore} ({evaluation.percentage}%)</p>
          <p><strong>التقييم:</strong> {evaluation.rating}</p>
          
          <div>
            <h4>نقاط القوة:</h4>
            <ul>
              {evaluation.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>نقاط الضعف:</h4>
            <ul>
              {evaluation.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>ملاحظات:</h4>
            <p>{evaluation.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## معالجة الأخطاء

### رسائل الخطأ الشائعة:

1. **"مفتاح DeepSeek API غير مُعيّن"**
   - تأكد من وجود `DEEPSEEK_API_KEY` في ملف `.env`
   - أعد تشغيل الخادم بعد إضافة المفتاح

2. **"خطأ في مفتاح API"**
   - تحقق من صحة المفتاح في https://platform.deepseek.com/api_keys
   - تأكد من أن المفتاح لم ينتهِ أو يتم تعطيله

3. **"خطأ في الاتصال بخدمة DeepSeek"**
   - تحقق من اتصال الإنترنت
   - تأكد من أن firewall لا يحجب الوصول

4. **"فشل في تحليل نتيجة التقييم"**
   - هذا خطأ نادر يحدث عندما لا يرجع AI تنسيق JSON صحيح
   - سيتم استخراج البيانات يدوياً تلقائياً

---

## الإعدادات المستخدمة

### DeepSeek Models:
- **Model:** `deepseek-chat`
- **Temperature لتوليد الإجابات:** `0.7` (إبداعي قليلاً)
- **Temperature للتقييم:** `0.3` (دقيق ومنضبط)

### Base URL:
```
https://api.deepseek.com
```

---

## الخطوات التالية

✅ تم: إنشاء endpoint توليد الإجابات
✅ تم: إنشاء endpoint تقييم الإجابات
✅ تم: إضافة معالجة أخطاء شاملة
✅ تم: توثيق الاستخدام

🔄 قيد الانتظار: دمج في واجهة المستخدم
🔄 قيد الانتظار: حفظ التقييمات في قاعدة البيانات
🔄 قيد الانتظار: إضافة إحصائيات استخدام AI

---

## ملاحظات

- DeepSeek أفضل من Gemini في فهم اللغة العربية
- التقييم التلقائي يوفر وقت الأساتذة بشكل كبير
- يمكن مراجعة وتعديل التقييم التلقائي من قبل الأستاذ
- التكلفة: DeepSeek أرخص من GPT-4 وGemini
