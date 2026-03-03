'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GameItem {
  id: string;
  content: string;
  value: number;
}

interface SortingGameProps {
  items: GameItem[];
  direction?: 'asc' | 'desc';
  onComplete?: (isCorrect: boolean) => void;
}

export function SortingGame({ items, direction = 'asc', onComplete }: SortingGameProps) {
  const [currentItems, setCurrentItems] = useState<GameItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<GameItem | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // خلط العناصر عند بدء اللعبة
    setCurrentItems([...items].sort(() => Math.random() - 0.5));
    setIsChecked(false);
    setIsCorrect(false);
  }, [items]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: GameItem) => {
    if (isChecked) {
      e.preventDefault();
      return;
    }
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // يمكن إضافة صورة مخصصة للسحب هنا إذا لزم الأمر
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedItem || isChecked) return;

    const draggedIndex = currentItems.findIndex(i => i.id === draggedItem.id);
    if (draggedIndex === index) return;

    const newItems = [...currentItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);
    setCurrentItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const checkOrder = () => {
    const sorted = [...items].sort((a, b) => 
      direction === 'asc' ? a.value - b.value : b.value - a.value
    );
    
    const isOrderCorrect = currentItems.every((item, index) => item.id === sorted[index].id);
    
    setIsCorrect(isOrderCorrect);
    setIsChecked(true);
    if (onComplete) onComplete(isOrderCorrect);
  };

  const resetGame = () => {
    setCurrentItems([...items].sort(() => Math.random() - 0.5));
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border my-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {direction === 'asc' ? 'رتب الأعداد من الأصغر إلى الأكبر' : 'رتب الأعداد من الأكبر إلى الأصغر'}
        </h3>
        <p className="text-gray-500">اسحب البطاقات وأفلتها لترتيبها في القائمة</p>
      </div>

      <div className="space-y-3 mb-8">
        {currentItems.map((item, index) => (
          <div
            key={item.id}
            draggable={!isChecked}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center p-4 bg-gray-50 border-2 border-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:border-blue-300 hover:shadow-md select-none",
              draggedItem?.id === item.id && "opacity-50 border-dashed border-blue-400 bg-blue-50",
              isChecked && isCorrect && "border-green-500 bg-green-50",
              isChecked && !isCorrect && "border-red-500 bg-red-50"
            )}
          >
            <div className="p-2 text-gray-400">
              <GripVertical size={20} />
            </div>
            <div className="flex-1 text-center font-bold text-lg text-gray-700" dir="ltr">
              {item.content}
            </div>
            <div className="w-8"></div> {/* مسافة للتوسط */}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        {!isChecked ? (
          <Button onClick={checkOrder} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-lg">
            تحقق من الإجابة
          </Button>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className={cn("flex items-center justify-center gap-2 text-xl font-bold mb-4", isCorrect ? "text-green-600" : "text-red-600")}>
              {isCorrect ? <><CheckCircle2 size={28} /><span>أحسنت! الإجابة صحيحة</span></> : <><XCircle size={28} /><span>حاول مرة أخرى</span></>}
            </div>
            <Button onClick={resetGame} variant="outline" className="gap-2"><RefreshCcw size={16} />إعادة اللعب</Button>
          </div>
        )}
      </div>
    </div>
  );
}