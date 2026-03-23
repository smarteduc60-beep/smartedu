'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface Pair {
  id: string;
  question: string;
  answer: string;
}

interface MatchingGameProps {
  title: string;
  description: string;
  pairs: Pair[];
}

export default function MatchingGame({ title, description, pairs }: MatchingGameProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [incorrectPair, setIncorrectPair] = useState<{ q: string; a: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const { width, height } = useWindowSize();

  const questions = useMemo(() => pairs.map(p => ({ id: p.id, text: p.question })).sort(() => Math.random() - 0.5), [pairs]);
  const answers = useMemo(() => pairs.map(p => ({ id: p.id, text: p.answer })).sort(() => Math.random() - 0.5), [pairs]);

  useEffect(() => {
    if (selectedQuestion && selectedAnswer) {
      if (selectedQuestion === selectedAnswer) {
        setMatchedPairs(prev => ({ ...prev, [selectedQuestion]: selectedAnswer }));
      } else {
        setIncorrectPair({ q: selectedQuestion, a: selectedAnswer });
        setTimeout(() => setIncorrectPair(null), 1000);
      }
      setSelectedQuestion(null);
      setSelectedAnswer(null);
    }
  }, [selectedQuestion, selectedAnswer]);

  useEffect(() => {
    if (pairs && Object.keys(matchedPairs).length === pairs.length) {
      setIsFinished(true);
    }
  }, [matchedPairs, pairs]);

  const resetGame = () => {
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setMatchedPairs({});
    setIncorrectPair(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-16 space-y-4 w-full">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-in zoom-in" />
        <h3 className="text-3xl font-bold">أحسنت! لقد أكملت اللعبة بنجاح.</h3>
        <Button onClick={resetGame}>
          <RotateCcw className="ml-2 h-4 w-4" />
          إعادة اللعب
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        <p className="text-muted-foreground text-center mb-8">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">الأعمدة</h3>
            {questions.map(q => {
              const isMatched = !!matchedPairs[q.id];
              const isSelected = selectedQuestion === q.id;
              const isIncorrect = incorrectPair?.q === q.id;
              return <Button key={q.id} variant="outline" className={cn("w-full h-auto min-h-[60px] justify-center text-center py-3 px-4 whitespace-normal", isSelected && "ring-2 ring-primary", isMatched && "bg-green-100 text-green-800 border-green-300 hover:bg-green-100", isIncorrect && "bg-red-100 border-red-300 animate-shake")} onClick={() => !isMatched && setSelectedQuestion(q.id)} disabled={isMatched}>{q.text}</Button>;
            })}
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">التعريفات</h3>
            {answers.map(a => {
              const isMatched = Object.values(matchedPairs).includes(a.id);
              const isSelected = selectedAnswer === a.id;
              const isIncorrect = incorrectPair?.a === a.id;
              return <Button key={a.id} variant="outline" className={cn("w-full h-auto min-h-[60px] justify-center text-center py-3 px-4 whitespace-normal", isSelected && "ring-2 ring-primary", isMatched && "bg-green-100 text-green-800 border-green-300 hover:bg-green-100", isIncorrect && "bg-red-100 border-red-300 animate-shake")} onClick={() => !isMatched && setSelectedAnswer(a.id)} disabled={isMatched}>{a.text}</Button>;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}