'use client';

import { useState } from 'react';
import MathContent from '@/components/MathContent';
import { RichTextEditor } from '@/components/editor';

export default function TestMathPage() {
  const [editorContent, setEditorContent] = useState('');

  // محتوى تجريبي يحتوي على صيغ رياضية
  const testContent = `
    <h2>أمثلة على الصيغ الرياضية</h2>
    
    <h3>1. معادلات في السطر</h3>
    <p>المعادلة التربيعية: \\(x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\)</p>
    <p>نظرية فيثاغورس: \\(a^2 + b^2 = c^2\\)</p>
    <p>الحروف اليونانية: \\(\\alpha, \\beta, \\gamma, \\theta, \\pi, \\omega\\)</p>
    
    <h3>2. معادلات معروضة</h3>
    <p>معادلة أينشتاين الشهيرة:</p>
    $$E = mc^2$$
    
    <p>صيغة المجموع:</p>
    $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
    
    <h3>3. مصفوفات</h3>
    <p>مصفوفة 2×2:</p>
    $$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$$
    
    <p>مصفوفة 3×3:</p>
    $$\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix}$$
    
    <p>محدد (Determinant):</p>
    $$\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$$
    
    <h3>4. نظام معادلات</h3>
    $$\\begin{cases} 
    x + y = 5 \\\\ 
    2x - y = 1 
    \\end{cases}$$
    
    <p>الحل: \\(x = 2\\) و \\(y = 3\\)</p>
    
    <h3>5. تكامل ومشتقات</h3>
    $$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
    
    $$\\frac{d}{dx}(x^n) = nx^{n-1}$$
    
    <h3>6. متجهات</h3>
    <p>متجه في الفضاء:</p>
    $$\\vec{v} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$$
  `;

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      {/* محرر النصوص مع الرموز الرياضية */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">اختبر المحرر مع الرموز الرياضية</h2>
        <p className="text-muted-foreground mb-4">
          ✨ استخدم زر "رموز رياضية" لإضافة صيغ جاهزة - ستظهر المعاينة المباشرة أسفل المحرر
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-sm mb-2">💡 الميزات الجديدة:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>جميع الرموز مُعرّضة بشكل جميل (لا مزيد من LaTeX الخام!)</li>
            <li>مربع معاينة مباشرة يظهر النتيجة النهائية</li>
            <li>تبويب جديد: <strong>المصفوفات</strong> (2×2, 3×3, محددات، نظم معادلات)</li>
            <li>معادلات إضافية: مشتقة، تكامل، قانون كوزين، صيغة المسافة</li>
            <li>أكثر من <strong>60 رمز ومعادلة جاهزة!</strong></li>
          </ul>
        </div>
        <RichTextEditor
          content={editorContent}
          onChange={setEditorContent}
          placeholder="جرّب كتابة محتوى أو استخدم الرموز الرياضية..."
        />
      </div>

      {/* أمثلة جاهزة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">أمثلة شاملة (معادلات، مصفوفات، رموز):</h3>
        <MathContent content={testContent} />
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <MathContent content={testContent} />
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          📚 دليل سريع للرموز الجديدة
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded p-4">
            <h4 className="font-bold mb-2">🔢 تبويب المصفوفات (جديد!):</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>مصفوفة 2×2 و 3×3</li>
              <li>مصفوفات معقوفة [ ]</li>
              <li>محددات | |</li>
              <li>متجهات عمودية</li>
              <li>نظم المعادلات</li>
              <li>مصفوفات مع نقاط</li>
            </ul>
          </div>
          
          <div className="bg-white rounded p-4">
            <h4 className="font-bold mb-2">➕ معادلات إضافية:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>قانون كوزين</li>
              <li>صيغة المسافة</li>
              <li>المشتقات</li>
              <li>المعادلات الخطية</li>
              <li>التكامل</li>
            </ul>
          </div>
          
          <div className="bg-white rounded p-4">
            <h4 className="font-bold mb-2">👁️ مربع المعاينة:</h4>
            <p>يظهر تلقائياً أسفل المحرر لعرض كيف ستبدو الصيغ للطالب - لا مزيد من التخمين!</p>
          </div>
          
          <div className="bg-white rounded p-4">
            <h4 className="font-bold mb-2">✨ الرموز المُعرّضة:</h4>
            <p>جميع الرموز في القائمة تظهر بشكلها النهائي الجميل - سهل جداً للأستاذ!</p>
          </div>
        </div>
        
        <div className="mt-4 bg-green-100 border border-green-300 rounded p-3 text-sm">
          <strong>💡 نصيحة:</strong> جرّب الضغط على تبويب "مصفوفات" لرؤية الخيارات الجديدة الرائعة!
        </div>
      </div>
    </div>
  );
}
