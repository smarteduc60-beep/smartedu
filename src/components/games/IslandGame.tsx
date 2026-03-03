'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, Trophy, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// بيانات الجزر والأسئلة
const ISLANDS_DATA = [
  {
    name: "جزيرة الأعداد",
    icon: "🔢",
    questions: [
      { text: "اكتب العدد: خمسة آلاف وثلاثمائة واثنان وأربعون", answer: "5342", hint: "أكتب الآلاف ثم المئات ثم العشرات ثم الآحاد", options: ["5342", "500342", "53420", "50342"] },
      { text: "كيف نقرأ العدد 4235؟", answer: "أربعة آلاف ومئتان وخمسة وثلاثون", hint: "اقرأ من اليسار: آلاف ثم مئات", options: ["أربعة آلاف ومئتان وخمسة وثلاثون", "اثنان وأربعون ألفاً وثلاثمائة", "أربعمائة وثلاثة وعشرون", "خمسة وثلاثون ألفاً وأربعمائة"] },
      { text: "3000 + 400 + 20 + 7 = ?", answer: "3427", hint: "اجمع الأعداد بالترتيب", options: ["3427", "3000400207", "3472", "3247"] },
      { text: "اكتب: ثمانية آلاف وستة", answer: "8006", hint: "ضع أصفاراً في المنازل الفارغة", options: ["8006", "806", "80006", "8600"] },
      { text: "2500 بالكلمات", answer: "ألفان وخمسمائة", hint: "ألفان = 2000", options: ["ألفان وخمسمائة", "مئتان وخمسون", "خمسة وعشرون ألفا", "ألفان وخمسون"] }
    ]
  },
  {
    name: "جزيرة الكسور",
    icon: "⅓",
    questions: [
      { text: "3 أعشار = ؟", answer: "3/10", hint: "العشر يعني تقسيم إلى 10", options: ["3/10", "3/100", "10/3", "30/10"] },
      { text: "0.5 على شكل كسر", answer: "5/10", hint: "0.5 = خمسة أعشار", options: ["5/10", "5/100", "1/2", "50/100"] },
      { text: "7 أجزاء من مئة", answer: "7/100", hint: "المقام 100", options: ["7/100", "7/10", "70/100", "100/7"] },
      { text: "0.03 = ؟", answer: "3/100", hint: "03.0 = ثلاثة من مئة", options: ["3/100", "3/10", "30/100", "3/1000"] },
      { text: "9 أعشار", answer: "9/10", hint: "تسعة من عشرة", options: ["9/10", "9/100", "10/9", "90/100"] }
    ]
  },
  {
    name: "جزيرة الأعشار",
    icon: "🔟",
    questions: [
      { text: "3 وحدات و4 أعشار", answer: "3.4", hint: "الفاصلة تفصل الوحدات", options: ["3.4", "3.04", "34", "0.34"] },
      { text: "7/10 كعدد عشري", answer: "0.7", hint: "7 أعشار = 0.7", options: ["0.7", "7.0", "0.07", "7.7"] },
      { text: "5 و25/100", answer: "5.25", hint: "5 + 0.25", options: ["5.25", "5.025", "525", "0.525"] },
      { text: "8/100 = ؟", answer: "0.08", hint: "8 من مئة", options: ["0.08", "0.8", "8.0", "0.008"] },
      { text: "12 و3 أعشار", answer: "12.3", hint: "12 + 0.3", options: ["12.3", "12.03", "123", "1.23"] }
    ]
  },
  {
    name: "جزيرة التحويل",
    icon: "🔄",
    questions: [
      { text: "0.3 إلى كسر", answer: "3/10", hint: "ثلاثة أعشار", options: ["3/10", "3/100", "30/10", "3/1"] },
      { text: "0.25 إلى كسر", answer: "25/100", hint: "25 من مئة", options: ["25/100", "25/10", "2.5/10", "250/1000"] },
      { text: "1.5 إلى كسر", answer: "15/10", hint: "1.5 = 15/10", options: ["15/10", "15/100", "1.5/10", "150/100"] },
      { text: "0.07 إلى كسر", answer: "7/100", hint: "7 من مئة", options: ["7/100", "7/10", "70/100", "7/1000"] },
      { text: "2.3 إلى كسر", answer: "23/10", hint: "2.3 = 23/10", options: ["23/10", "23/100", "2.3/10", "230/100"] }
    ]
  },
  {
    name: "جزيرة الضرب",
    icon: "✖️",
    questions: [
      { text: "25 × 10 = ؟", answer: "250", hint: "أضف صفراً", options: ["250", "25", "2500", "205"] },
      { text: "3.5 × 10", answer: "35", hint: "حرك الفاصلة لليمين", options: ["35", "3.50", "350", "0.35"] },
      { text: "42 × 100", answer: "4200", hint: "أضف صفرين", options: ["4200", "420", "42000", "4020"] },
      { text: "6.25 × 100", answer: "625", hint: "حرك الفاصلة مرتين", options: ["625", "62.5", "6250", "0.625"] },
      { text: "7 × 10", answer: "70", hint: "7 × 10 = 70", options: ["70", "7", "700", "17"] }
    ]
  },
  {
    name: "جزيرة القسمة",
    icon: "➗",
    questions: [
      { text: "450 ÷ 10", answer: "45", hint: "احذف صفراً", options: ["45", "4500", "4.5", "450"] },
      { text: "325 ÷ 100", answer: "3.25", hint: "حرك الفاصلة لليسار", options: ["3.25", "32.5", "3250", "0.325"] },
      { text: "60 ÷ 10", answer: "6", hint: "60 ÷ 10 = 6", options: ["6", "60", "600", "0.6"] },
      { text: "500 ÷ 100", answer: "5", hint: "500 ÷ 100 = 5", options: ["5", "50", "5000", "0.5"] },
      { text: "123 ÷ 10", answer: "12.3", hint: "حرك الفاصلة مرة", options: ["12.3", "1230", "1.23", "123"] }
    ]
  },
  {
    name: "جزيرة الأجزاء",
    icon: "0️⃣",
    questions: [
      { text: "45 × 0.1", answer: "4.5", hint: "اقسم على 10", options: ["4.5", "45", "450", "0.45"] },
      { text: "250 × 0.01", answer: "2.5", hint: "اقسم على 100", options: ["2.5", "25", "0.25", "2500"] },
      { text: "30 × 0.1", answer: "3", hint: "30 × 0.1 = 3", options: ["3", "30", "300", "0.3"] },
      { text: "600 × 0.01", answer: "6", hint: "600 × 0.01 = 6", options: ["6", "60", "0.6", "6000"] },
      { text: "12 × 0.1", answer: "1.2", hint: "12 × 0.1 = 1.2", options: ["1.2", "12", "120", "0.12"] }
    ]
  },
  {
    name: "جزيرة الترتيب",
    icon: "📏",
    questions: [
      { text: "أكبر: 3.5 أم 3.05؟", answer: "3.5", hint: "قارن الأعشار", options: ["3.5", "3.05", "متساويان", "لا يمكن"] },
      { text: "رتب: 2.3، 2.03، 2.33", answer: "2.03، 2.3، 2.33", hint: "الأصغر فالأكبر", options: ["2.03، 2.3، 2.33", "2.3، 2.03، 2.33", "2.33، 2.3، 2.03", "2.03، 2.33، 2.3"] },
      { text: "أصغر: 0.8 أم 0.75؟", answer: "0.75", hint: "75/100 < 80/100", options: ["0.75", "0.8", "متساويان", "0.85"] },
      { text: "رتب تنازلياً: 1.2، 1.15، 1.3", answer: "1.3، 1.2، 1.15", hint: "الأكبر فالأصغر", options: ["1.3، 1.2، 1.15", "1.2، 1.15، 1.3", "1.15، 1.2، 1.3", "1.3، 1.15، 1.2"] },
      { text: "0.5 = ؟", answer: "5/10", hint: "0.5 = خمسة أعشار", options: ["5/10", "5/100", "0.05", "50/1000"] }
    ]
  },
  {
    name: "جزيرة المستقيم",
    icon: "📐",
    questions: [
      { text: "حرك النقطة الحمراء إلى موقع العدد 2.5 على المستقيم", answer: "2.5", hint: "2.5 تقع في منتصف المسافة بين 2 و3", options: [], type: "numberline", min: 0, max: 5 },
      { text: "ضع النقطة على العدد 3.7", answer: "3.7", hint: "3.7 = 3 و7 أعشار", options: [], type: "numberline", min: 0, max: 5 },
      { text: "أين يقع العدد 1.25؟", answer: "1.25", hint: "1.25 = 1 وربع", options: [], type: "numberline", min: 0, max: 5 },
      { text: "حرك العلامة إلى 4.3", answer: "4.3", hint: "4.3 = 4 و3 أعشار", options: [], type: "numberline", min: 0, max: 5 },
      { text: "ضع النقطة على 0.8", answer: "0.8", hint: "0.8 = ثمانية أعشار", options: [], type: "numberline", min: 0, max: 5 }
    ]
  }
];

export function IslandGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentIsland, setCurrentIsland] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [completedIslands, setCompletedIslands] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'info', message: string } | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [stars, setStars] = useState<{ id: number; left: number; delay: number }[]>([]);

  // مرجع لحاوية الجزر لحساب موقع القارب
  const islandsRef = useRef<HTMLDivElement>(null);
  // مرجع للمستقيم المدرج
  const numberLineRef = useRef<HTMLDivElement>(null);
  const [boatPosition, setBoatPosition] = useState(0);

  // خلط الخيارات عند تغيير السؤال
  useEffect(() => {
    if (gameState === 'playing') {
      const currentQ = ISLANDS_DATA[currentIsland].questions[currentQuestionIndex];
      if (currentQ.options && currentQ.options.length > 0) {
        setShuffledOptions([...currentQ.options].sort(() => Math.random() - 0.5));
        setSelectedOption(null);
      } else if ((currentQ as any).type === 'numberline') {
        setSelectedOption("0"); // قيمة افتراضية للمستقيم
      }
      setFeedback(null);
    }
  }, [currentIsland, currentQuestionIndex, gameState]);

  // تحديث موقع القارب
  useEffect(() => {
    // حساب بسيط للموقع بناءً على عدد الجزر (تقريبي)
    // في تطبيق حقيقي يمكن استخدام refs لكل جزيرة
    const percentage = (currentIsland / (ISLANDS_DATA.length - 1)) * 80 + 10; // 10% to 90%
    setBoatPosition(percentage);
  }, [currentIsland]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIsland(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCompletedIslands([]);
  };

  const createStars = () => {
    const newStars = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random(),
    }));
    setStars(prev => [...prev, ...newStars]);
    
    // إزالة النجوم بعد انتهاء الحركة
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.includes(s)));
    }, 2000);
  };

  const handleNumberLineInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (feedback) return;
    if (!numberLineRef.current) return;

    const rect = numberLineRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    
    // حساب الموقع النسبي داخل العنصر
    let x = clientX - rect.left;
    // تقييد القيمة داخل حدود العنصر
    x = Math.max(0, Math.min(x, rect.width));
    
    const currentQ = ISLANDS_DATA[currentIsland].questions[currentQuestionIndex] as any;
    const min = currentQ.min || 0;
    const max = currentQ.max || 5;
    
    // تحويل الموقع إلى قيمة رقمية
    const percentage = x / rect.width;
    const value = min + percentage * (max - min);
    
    // تقريب القيمة لمنزلتين عشريتين للعرض
    const roundedValue = Math.round(value * 100) / 100;
    setSelectedOption(roundedValue.toString());
  };

  const checkAnswer = () => {
    if (!selectedOption) return;

    const currentQ = ISLANDS_DATA[currentIsland].questions[currentQuestionIndex] as any;
    let isCorrect = false;

    if (currentQ.type === 'numberline') {
      // للمستقيم المدرج، نسمح بهامش خطأ بسيط (Tolerance)
      const userVal = parseFloat(selectedOption);
      const correctVal = parseFloat(currentQ.answer);
      // هامش خطأ 0.25 وحدة (5% من المجال 0-5)
      isCorrect = Math.abs(userVal - correctVal) <= 0.25;
    } else {
      isCorrect = selectedOption === currentQ.answer;
    }

    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback({ type: 'correct', message: '✅ إجابة صحيحة! ⭐ أحسنت' });
      createStars();

      setTimeout(() => {
        if (currentQuestionIndex < ISLANDS_DATA[currentIsland].questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // إكمال الجزيرة
          if (!completedIslands.includes(currentIsland)) {
            setCompletedIslands(prev => [...prev, currentIsland]);
            setScore(prev => prev + 50); // مكافأة إكمال الجزيرة
          }

          if (currentIsland < ISLANDS_DATA.length - 1) {
            setFeedback({ type: 'info', message: '🎉 انتقلت للجزيرة التالية! +50 نقطة' });
            setTimeout(() => {
              setCurrentIsland(prev => prev + 1);
              setCurrentQuestionIndex(0);
            }, 1500);
          } else {
            setGameState('end');
          }
        }
      }, 1500);
    } else {
      setFeedback({ type: 'incorrect', message: `❌ إجابة خاطئة. الإجابة الصحيحة: ${currentQ.answer}` });
    }
  };

  // --- Render Components ---

  if (gameState === 'start') {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-8 text-white text-center shadow-2xl">
        <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <h1 className="text-6xl font-bold drop-shadow-md">🏝️ جزيرة الأعداد</h1>
          <p className="text-2xl font-light">مغامرة الرياضيات للتلاميذ الأولى متوسط</p>
          <div className="text-8xl animate-bounce">⛵ 🌊 🏝️</div>
          <p className="text-xl leading-relaxed bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            انطلق في رحلة بحرية ممتعة عبر {ISLANDS_DATA.length} جزر، كل جزيرة تحتوي على دروس الرياضيات.
            اجمع النجوم وانتقل بين الجزر بقاربك السحري!
          </p>
          <Button 
            onClick={startGame}
            className="text-2xl px-12 py-8 rounded-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold shadow-lg transform transition hover:scale-105"
          >
            🚀 ابدأ الرحلة
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    const totalPossible = (ISLANDS_DATA.reduce((acc, island) => acc + island.questions.length, 0) * 10) + (ISLANDS_DATA.length * 50);
    
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 text-white text-center shadow-2xl">
        <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <h2 className="text-5xl font-bold">🎉 مبروك! وصلت لنهاية الرحلة</h2>
          <div className="text-8xl animate-spin-slow">🏆 ⭐ 🏝️</div>
          <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-md">
            <p className="text-2xl mb-2">النتيجة النهائية</p>
            <p className="text-6xl font-bold text-yellow-300">{score} / {totalPossible}</p>
          </div>
          <p className="text-2xl">لقد جمعت كل كنوز الجزر!</p>
          <Button 
            onClick={startGame}
            className="text-xl px-10 py-6 rounded-full bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg"
          >
            🔄 رحلة جديدة
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = ISLANDS_DATA[currentIsland].questions[currentQuestionIndex] as any;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200">
      {/* Stars Animation Container */}
      {stars.map(star => (
        <div 
          key={star.id}
          className="fixed text-yellow-400 text-4xl pointer-events-none z-50 animate-fall"
          style={{ 
            left: `${star.left}%`, 
            top: '-50px',
            animationDuration: '1s',
            animationDelay: `${star.delay}s`
          }}
        >
          ⭐
        </div>
      ))}

      {/* Map Section */}
      <div className="relative h-64 bg-gradient-to-b from-blue-300 to-blue-600 overflow-hidden">
        {/* Ocean & Waves */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 w-full h-12 bg-white/20 animate-pulse"></div>
        
        {/* Islands */}
        <div ref={islandsRef} className="absolute bottom-10 w-full flex justify-around px-4 items-end z-10">
          {ISLANDS_DATA.map((island, index) => (
            <div 
              key={index}
              onClick={() => {
                setCurrentIsland(index);
                setCurrentQuestionIndex(0);
                setFeedback(null);
                setSelectedOption(null);
              }}
              className={cn(
                "flex flex-col items-center transition-all duration-500 transform cursor-pointer",
                index === currentIsland ? "scale-125 -translate-y-4 opacity-100" : "opacity-60 scale-90 hover:opacity-100 hover:scale-105",
                completedIslands.includes(index) && "opacity-100 grayscale-0"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-colors",
                completedIslands.includes(index) ? "bg-green-400 border-green-200" : 
                index === currentIsland ? "bg-yellow-400 border-yellow-200 animate-bounce-slow" : "bg-gray-300 border-gray-400"
              )}>
                {island.icon}
              </div>
              <span className="mt-2 text-xs font-bold bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                {island.name}
              </span>
            </div>
          ))}
        </div>

        {/* Boat */}
        <div 
          className="absolute bottom-4 text-5xl transition-all duration-1000 ease-in-out z-20 filter drop-shadow-lg"
          style={{ right: `${boatPosition}%`, transform: 'translateX(-50%)' }}
        >
          ⛵
        </div>
      </div>

      {/* Game Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-full">
          <span className="text-xl">{ISLANDS_DATA[currentIsland].icon}</span>
          <span className="font-bold">{ISLANDS_DATA[currentIsland].name}</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold text-xl shadow-inner">
          <Star className="fill-current" />
          <span>{score}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="p-8 bg-slate-50 min-h-[400px] flex flex-col justify-center">
        <Card className="p-8 border-none shadow-lg bg-white">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-8 leading-relaxed">
            {currentQ.text}
          </h3>

          {currentQ.type === 'numberline' ? (
            <div className="py-12 px-4 mb-8 bg-slate-100 rounded-2xl border-2 border-slate-200">
              <div 
                ref={numberLineRef}
                className="relative h-4 bg-slate-800 rounded-full cursor-pointer mx-6"
                onMouseDown={handleNumberLineInteraction}
                onTouchStart={handleNumberLineInteraction}
                onMouseMove={(e) => e.buttons === 1 && handleNumberLineInteraction(e)}
                onTouchMove={handleNumberLineInteraction}
              >
                {/* علامات التدريج (Ticks) */}
                {[...Array((currentQ.max || 5) - (currentQ.min || 0) + 1)].map((_, i) => (
                  <div key={i} className="absolute w-1 h-6 bg-slate-800 -top-1" style={{ left: `${(i / ((currentQ.max || 5) - (currentQ.min || 0))) * 100}%` }}>
                    <span className="absolute -top-10 -translate-x-1/2 text-xl font-bold text-slate-700">{(currentQ.min || 0) + i}</span>
                  </div>
                ))}
                
                {/* المؤشر (Marker) */}
                <div 
                  className="absolute w-8 h-8 bg-red-500 rounded-full -top-2 -translate-x-1/2 shadow-xl border-4 border-white transition-transform hover:scale-125 cursor-grab active:cursor-grabbing z-20"
                  style={{ left: `${((parseFloat(selectedOption || "0") - (currentQ.min || 0)) / ((currentQ.max || 5) - (currentQ.min || 0))) * 100}%` }}
                >
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-lg font-bold shadow-md whitespace-nowrap">
                    {selectedOption || (currentQ.min || 0)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-16 text-slate-500 font-medium animate-pulse">
                👆 اسحب النقطة الحمراء أو انقر على المستقيم لتحديد القيمة
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {shuffledOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !feedback && setSelectedOption(option)}
                  disabled={!!feedback}
                  className={cn(
                    "p-6 text-xl font-bold rounded-2xl border-4 transition-all duration-200 transform hover:-translate-y-1",
                    selectedOption === option 
                      ? "bg-blue-500 border-blue-600 text-white shadow-lg scale-105" 
                      : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Hint */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg text-yellow-800 flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <span className="font-medium">{currentQ.hint}</span>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={cn(
              "p-4 rounded-xl text-center text-xl font-bold mb-6 animate-in zoom-in duration-300 flex items-center justify-center gap-3",
              feedback.type === 'correct' ? "bg-green-100 text-green-700 border-2 border-green-200" :
              feedback.type === 'incorrect' ? "bg-red-100 text-red-700 border-2 border-red-200" :
              "bg-blue-100 text-blue-700 border-2 border-blue-200"
            )}>
              {feedback.type === 'correct' && <CheckCircle2 className="w-8 h-8" />}
              {feedback.type === 'incorrect' && <XCircle className="w-8 h-8" />}
              {feedback.type === 'info' && <Trophy className="w-8 h-8" />}
              {feedback.message}
            </div>
          )}

          {/* Action Button */}
          {!feedback ? (
            <Button 
              onClick={checkAnswer}
              disabled={!selectedOption}
              className="w-full py-8 text-2xl rounded-full font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ تحقق من الإجابة
            </Button>
          ) : feedback.type === 'incorrect' ? (
            <Button 
              onClick={() => {
                setFeedback(null);
                setSelectedOption(null);
              }}
              className="w-full py-6 text-xl rounded-full font-bold bg-gray-500 hover:bg-gray-600"
            >
              <RotateCcw className="mr-2" /> حاول مرة أخرى
            </Button>
          ) : null}
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}