'use client';

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathSymbolsToolbarProps {
  onInsert: (latex: string) => void;
}

// مكون لعرض الرمز الرياضي
function MathPreview({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: false,
        });
      } catch (error) {
        console.error('KaTeX render error:', error);
      }
    }
  }, [latex]);

  return <span ref={ref} className="text-xl" />;
}

export default function MathSymbolsToolbar({ onInsert }: MathSymbolsToolbarProps) {
  // الرموز الأساسية
  const basicSymbols = [
    { label: "كسر", latex: "\\frac{بسط}{مقام}", preview: "a/b", displayLatex: "\\frac{a}{b}" },
    { label: "جذر", latex: "\\sqrt{عدد}", preview: "√x", displayLatex: "\\sqrt{x}" },
    { label: "جذر نوني", latex: "\\sqrt[n]{عدد}", preview: "ⁿ√x", displayLatex: "\\sqrt[3]{x}" },
    { label: "أس", latex: "x^{أس}", preview: "x²", displayLatex: "x^{2}" },
    { label: "أسفل", latex: "x_{رقم}", preview: "x₁", displayLatex: "x_{1}" },
    { label: "مجموع", latex: "\\sum_{i=1}^{n} x_i", preview: "Σ", displayLatex: "\\sum_{i=1}^{n} x_i" },
    { label: "تكامل", latex: "\\int_{a}^{b} f(x) dx", preview: "∫", displayLatex: "\\int_{0}^{1} x dx" },
    { label: "نهاية", latex: "\\lim_{x \\to a} f(x)", preview: "lim", displayLatex: "\\lim_{x \\to 0} \\frac{\\sin x}{x}" },
  ];

  // الحروف اليونانية
  const greekLetters = [
    { label: "ألفا", latex: "\\alpha", preview: "α", displayLatex: "\\alpha" },
    { label: "بيتا", latex: "\\beta", preview: "β", displayLatex: "\\beta" },
    { label: "جاما", latex: "\\gamma", preview: "γ", displayLatex: "\\gamma" },
    { label: "دلتا", latex: "\\Delta", preview: "Δ", displayLatex: "\\Delta" },
    { label: "ثيتا", latex: "\\theta", preview: "θ", displayLatex: "\\theta" },
    { label: "باي", latex: "\\pi", preview: "π", displayLatex: "\\pi" },
    { label: "سيجما", latex: "\\Sigma", preview: "Σ", displayLatex: "\\Sigma" },
    { label: "أوميجا", latex: "\\omega", preview: "ω", displayLatex: "\\omega" },
    { label: "لامدا", latex: "\\lambda", preview: "λ", displayLatex: "\\lambda" },
    { label: "مي", latex: "\\mu", preview: "μ", displayLatex: "\\mu" },
    { label: "فاي", latex: "\\phi", preview: "φ", displayLatex: "\\phi" },
    { label: "تاو", latex: "\\tau", preview: "τ", displayLatex: "\\tau" },
  ];

  // الرموز الرياضية
  const mathOperators = [
    { label: "زائد ناقص", latex: "\\pm", preview: "±", displayLatex: "\\pm" },
    { label: "ضرب", latex: "\\times", preview: "×", displayLatex: "\\times" },
    { label: "قسمة", latex: "\\div", preview: "÷", displayLatex: "\\div" },
    { label: "يساوي تقريبا", latex: "\\approx", preview: "≈", displayLatex: "\\approx" },
    { label: "لا يساوي", latex: "\\neq", preview: "≠", displayLatex: "\\neq" },
    { label: "أكبر أو يساوي", latex: "\\geq", preview: "≥", displayLatex: "\\geq" },
    { label: "أصغر أو يساوي", latex: "\\leq", preview: "≤", displayLatex: "\\leq" },
    { label: "ما لا نهاية", latex: "\\infty", preview: "∞", displayLatex: "\\infty" },
    { label: "ينتمي", latex: "\\in", preview: "∈", displayLatex: "\\in" },
    { label: "لا ينتمي", latex: "\\notin", preview: "∉", displayLatex: "\\notin" },
    { label: "احتواء", latex: "\\subset", preview: "⊂", displayLatex: "\\subset" },
    { label: "اتحاد", latex: "\\cup", preview: "∪", displayLatex: "\\cup" },
    { label: "تقاطع", latex: "\\cap", preview: "∩", displayLatex: "\\cap" },
    { label: "لكل", latex: "\\forall", preview: "∀", displayLatex: "\\forall" },
    { label: "يوجد", latex: "\\exists", preview: "∃", displayLatex: "\\exists" },
    { label: "سهم", latex: "\\rightarrow", preview: "→", displayLatex: "\\rightarrow" },
  ];

  // المصفوفات
  const matrices = [
    { 
      label: "مصفوفة 2×2", 
      latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
      displayLatex: "\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}"
    },
    { 
      label: "مصفوفة 3×3", 
      latex: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
      displayLatex: "\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}"
    },
    { 
      label: "مصفوفة معقوفة 2×2", 
      latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
      displayLatex: "\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}"
    },
    { 
      label: "مصفوفة معقوفة 3×3", 
      latex: "\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix}",
      displayLatex: "\\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}"
    },
    { 
      label: "محدد (Determinant)", 
      latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
      displayLatex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}"
    },
    { 
      label: "متجه عمودي", 
      latex: "\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}",
      displayLatex: "\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}"
    },
    { 
      label: "نظام معادلات", 
      latex: "\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}",
      displayLatex: "\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}"
    },
    { 
      label: "مصفوفة مع نقاط", 
      latex: "\\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}",
      displayLatex: "\\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}"
    },
  ];

  // المعادلات الشائعة
  const commonEquations = [
    { 
      label: "المعادلة التربيعية", 
      latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
      displayLatex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
    },
    { 
      label: "فيثاغورس", 
      latex: "a^2 + b^2 = c^2",
      displayLatex: "a^2 + b^2 = c^2"
    },
    { 
      label: "مساحة الدائرة", 
      latex: "A = \\pi r^2",
      displayLatex: "A = \\pi r^2"
    },
    { 
      label: "حجم الكرة", 
      latex: "V = \\frac{4}{3}\\pi r^3",
      displayLatex: "V = \\frac{4}{3}\\pi r^3"
    },
    { 
      label: "مجموع الأعداد", 
      latex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
      displayLatex: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"
    },
    { 
      label: "متوسط حسابي", 
      latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i",
      displayLatex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i"
    },
    { 
      label: "تكامل", 
      latex: "\\int_{a}^{b} f(x) dx",
      displayLatex: "\\int_{0}^{1} x^2 dx = \\frac{1}{3}"
    },
    { 
      label: "نظرية النهايات", 
      latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
      displayLatex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"
    },
    { 
      label: "معادلة خطية", 
      latex: "y = mx + b",
      displayLatex: "y = mx + b"
    },
    { 
      label: "صيغة المسافة", 
      latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
      displayLatex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}"
    },
    { 
      label: "قانون كوزين", 
      latex: "c^2 = a^2 + b^2 - 2ab\\cos(\\theta)",
      displayLatex: "c^2 = a^2 + b^2 - 2ab\\cos(\\theta)"
    },
    { 
      label: "مشتقة", 
      latex: "\\frac{d}{dx}(x^n) = nx^{n-1}",
      displayLatex: "\\frac{d}{dx}(x^n) = nx^{n-1}"
    },
  ];

  // الأقواس والرموز الخاصة
  const brackets = [
    { label: "أقواس عادية", latex: "\\left( محتوى \\right)", preview: "( )", displayLatex: "\\left( x \\right)" },
    { label: "أقواس مربعة", latex: "\\left[ محتوى \\right]", preview: "[ ]", displayLatex: "\\left[ x \\right]" },
    { label: "أقواس معقوفة", latex: "\\left\\{ محتوى \\right\\}", preview: "{ }", displayLatex: "\\left\\{ x \\right\\}" },
    { label: "قيمة مطلقة", latex: "\\left| عدد \\right|", preview: "| |", displayLatex: "\\left| x \\right|" },
    { label: "كسر عادي", latex: "\\frac{أ}{ب}", preview: "أ/ب", displayLatex: "\\frac{a}{b}" },
    { label: "نقاط أفقية", latex: "\\cdots", preview: "···", displayLatex: "1 + 2 + \\cdots + n" },
    { label: "نقاط عمودية", latex: "\\vdots", preview: "⋮", displayLatex: "\\vdots" },
    { label: "نقاط قطرية", latex: "\\ddots", preview: "⋱", displayLatex: "\\ddots" },
  ];

  const handleInsert = (latex: string, isInline: boolean = true) => {
    // إدراج الصيغة بالتنسيق الصحيح
    const formatted = isInline ? `\\(${latex}\\)` : `$$${latex}$$`;
    onInsert(formatted);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          رموز رياضية
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-4" align="start">
        <Tabs defaultValue="basic" dir="rtl">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">أساسي</TabsTrigger>
            <TabsTrigger value="greek">يوناني</TabsTrigger>
            <TabsTrigger value="operators">عمليات</TabsTrigger>
            <TabsTrigger value="matrices">مصفوفات</TabsTrigger>
            <TabsTrigger value="equations">معادلات</TabsTrigger>
            <TabsTrigger value="brackets">أقواس</TabsTrigger>
          </TabsList>

          {/* الرموز الأساسية */}
          <TabsContent value="basic" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              اضغط على الرمز لإدراجه في المحرر
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {basicSymbols.map((symbol, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(symbol.latex, true)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={symbol.displayLatex} />
                  <span className="text-xs mt-1">{symbol.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* الحروف اليونانية */}
          <TabsContent value="greek" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              الحروف اليونانية المستخدمة في الرياضيات
            </div>
            <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto">
              {greekLetters.map((letter, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(letter.latex, true)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={letter.displayLatex} />
                  <span className="text-xs mt-1">{letter.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* العمليات والرموز */}
          <TabsContent value="operators" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              رموز العمليات الرياضية
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {mathOperators.map((operator, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(operator.latex, true)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={operator.displayLatex} />
                  <span className="text-xs mt-1">{operator.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* المصفوفات */}
          <TabsContent value="matrices" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              مصفوفات ونظم المعادلات
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {matrices.map((matrix, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(matrix.latex, false)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={matrix.displayLatex} />
                  <span className="text-xs mt-1">{matrix.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* المعادلات الشائعة */}
          <TabsContent value="equations" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              معادلات جاهزة - اضغط لإدراجها
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {commonEquations.map((eq, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(eq.latex, false)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={eq.displayLatex} />
                  <span className="text-xs mt-1">{eq.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          {/* الأقواس */}
          <TabsContent value="brackets" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              أقواس ورموز خاصة
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
              {brackets.map((bracket, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsert(bracket.latex, true)}
                  className="flex flex-col items-center h-auto py-3 gap-1"
                >
                  <MathPreview latex={bracket.displayLatex} />
                  <span className="text-xs mt-1">{bracket.label}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-muted rounded-lg text-xs">
          <strong>💡 نصيحة:</strong> الرموز المُعرّضة تُظهر كيف ستبدو في المحتوى النهائي. يمكنك تعديل النص بعد الإدراج.
        </div>
      </PopoverContent>
    </Popover>
  );
}
