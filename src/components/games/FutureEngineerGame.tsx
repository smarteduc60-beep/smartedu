'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Define types based on the seed script in `docs/seed-future-engineer-game.ts`
interface Element {
  type: 'line' | 'point';
  id: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  color?: string;
  name: string;
}

interface Question {
  text: string;
  hint: string;
  type: 'drawing' | 'interactive' | 'mcq';
  answer: any;
  options?: string[];
  elements?: Element[];
}

interface Chapter {
  id: number;
  title: string;
  icon: string;
  desc: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
}

interface GameConfig {
  type: 'FUTURE_ENGINEER';
  chapters: Chapter[];
}

interface FutureEngineerGameProps {
  gameConfig: GameConfig;
}

// Placeholder for the geometry canvas, to be replaced with JSXGraph or similar
const GeometryCanvasPlaceholder = ({ elements }: { elements: Element[] }) => {
  return (
    <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 border-2 border-dashed rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-500">
        <p>لوحة الرسم الهندسي (JSXGraph)</p>
        <p className="text-xs mt-2">
          سيتم عرض العناصر الهندسية هنا: {elements.map(e => e.name).join(', ')}
        </p>
      </div>
    </div>
  );
};

const FutureEngineerGame: React.FC<FutureEngineerGameProps> = ({ gameConfig }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentChapter = gameConfig.chapters[currentChapterIndex];
  const currentQuestion = currentChapter.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentQuestionIndex < currentChapter.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentChapterIndex < gameConfig.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleCheckAnswer = () => {
    if (currentQuestion.type === 'mcq') {
      const correct = selectedAnswer === currentQuestion.answer;
      setIsCorrect(correct);
    }
    // Logic for 'drawing' and 'interactive' would be more complex
    setIsAnswerChecked(true);
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <RadioGroup
            value={selectedAnswer || ''}
            onValueChange={setSelectedAnswer}
            disabled={isAnswerChecked}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'drawing':
      case 'interactive':
        return <GeometryCanvasPlaceholder elements={currentQuestion.elements || []} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            {currentChapter.icon} {currentChapter.title}
          </CardTitle>
          <Badge variant={currentChapter.difficulty === 'advanced' ? 'destructive' : currentChapter.difficulty === 'intermediate' ? 'secondary' : 'default'}>
            {currentChapter.difficulty}
          </Badge>
        </div>
        <CardDescription>
          السؤال {currentQuestionIndex + 1} من {currentChapter.questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">{currentQuestion.text}</p>
        
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-400 rounded-r-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500 mt-1" />
            <div>
              <h4 className="font-semibold">تلميح</h4>
              <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
            </div>
          </div>
        </div>

        <div className="min-h-[200px]">
          {renderQuestionContent()}
        </div>

        {isAnswerChecked && (
          <div className={`p-4 rounded-lg text-center font-semibold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'إجابة صحيحة! أحسنت.' : `إجابة خاطئة. الإجابة الصحيحة هي: ${currentQuestion.answer}`}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled>
          <ArrowRight className="h-4 w-4 ml-2" />
          السابق
        </Button>
        {!isAnswerChecked ? (
          <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>
            تحقق من الإجابة
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            السؤال التالي
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FutureEngineerGame;