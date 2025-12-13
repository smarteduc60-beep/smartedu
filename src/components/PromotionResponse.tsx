'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface PromotionResponseProps {
  messageId: number;
  promotionId: string;
  studentName: string;
  currentLevel: string;
  nextLevel: string;
  onResponse?: () => void;
}

export default function PromotionResponse({
  messageId,
  promotionId,
  studentName,
  currentLevel,
  nextLevel,
  onResponse
}: PromotionResponseProps) {
  console.log('🔵 PromotionResponse component rendered');
  console.log('Props:', { messageId, promotionId, studentName, currentLevel, nextLevel });
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { toast } = useToast();
  const { width, height } = useWindowSize();

  const handleResponseClick = (responseType: 'yes' | 'no') => {
    console.log('=== handleResponseClick ===');
    console.log('Response type:', responseType);
    console.log('Promotion ID:', promotionId);
    console.log('Message ID:', messageId);
    setResponse(responseType);
    setShowConfirmDialog(true);
    console.log('Confirmation dialog opened - state set to TRUE');
    console.log('showConfirmDialog will be:', true);
    
    // Force re-render after 100ms to ensure state is updated
    setTimeout(() => {
      console.log('After timeout - showConfirmDialog is:', showConfirmDialog);
    }, 100);
  };

  const submitResponse = async () => {
    console.log('🔴 submitResponse function called!');
    console.log('Response state:', response);
    
    if (!response) {
      console.log('❌ No response set, returning early');
      return;
    }

    console.log('=== Submitting Response ===');
    console.log('Promotion ID:', promotionId);
    console.log('Response:', response);

    try {
      setSubmitting(true);
      const res = await fetch('/api/academic-years/promotions/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotionId,
          response
        })
      });

      console.log('API Response status:', res.status);
      const data = await res.json();
      console.log('API Response data:', data);

      if (res.ok) {
        setShowConfirmDialog(false);
        
        if (data.isApproved) {
          console.log('✅ Approved - showing celebration');
          setShowConfetti(true);
          setShowCelebration(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          console.log('❌ Rejected - showing encouragement');
          setShowEncouragement(true);
        }

        toast({
          title: 'تم الإرسال بنجاح',
          description: data.message,
        });

        if (onResponse) {
          console.log('Calling onResponse callback in 3 seconds...');
          setTimeout(() => {
            console.log('Executing onResponse callback');
            onResponse();
          }, 3000);
        }
      } else {
        console.error('API Error:', data);
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إرسال الرد',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (showCelebration) {
    return (
      <>
        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
          <Card className="max-w-2xl w-full mx-4 border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-12 text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div className="w-32 h-32 mx-auto bg-green-500 rounded-full"></div>
                </div>
                <div className="relative animate-bounce">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle className="h-20 w-20 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-green-600 animate-in zoom-in" style={{ animationDelay: '0.2s' }}>
                  🎉 ألف مبروك! 🎉
                </h2>
                <div className="text-2xl font-semibold text-gray-800 animate-in slide-in-from-bottom" style={{ animationDelay: '0.4s' }}>
                  تم ترقية <span className="text-green-600">{studentName}</span>
                </div>
                <div className="text-xl text-gray-700 animate-in slide-in-from-bottom" style={{ animationDelay: '0.6s' }}>
                  من <span className="font-bold">{currentLevel}</span>
                  {' → '}
                  <span className="font-bold text-green-600">{nextLevel}</span>
                </div>
              </div>

              <div className="space-y-4 animate-in slide-in-from-bottom" style={{ animationDelay: '0.8s' }}>
                <div className="text-3xl">🏆 🎓 ⭐ 🌟 ✨</div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  تهانينا على هذا الإنجاز الرائع!<br />
                  نتمنى لكم التوفيق والنجاح في المستوى القادم بإذن الله
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-xl animate-in zoom-in"
                style={{ animationDelay: '1s' }}
                onClick={() => {
                  setShowCelebration(false);
                  if (onResponse) onResponse();
                }}
              >
                شكراً لكم! 💚
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (showEncouragement) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
        <Card className="max-w-2xl w-full mx-4 border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-12 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse opacity-20">
                <div className="w-32 h-32 mx-auto bg-blue-500 rounded-full"></div>
              </div>
              <div className="relative animate-bounce">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-7xl">💪</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-blue-600 animate-in zoom-in" style={{ animationDelay: '0.2s' }}>
                لا تيأس! 
              </h2>
              <div className="text-2xl font-semibold text-gray-800 animate-in slide-in-from-bottom" style={{ animationDelay: '0.4s' }}>
                {studentName}
              </div>
              <div className="text-xl text-gray-700 animate-in slide-in-from-bottom" style={{ animationDelay: '0.6s' }}>
                سيواصل في <span className="font-bold text-blue-600">{currentLevel}</span>
              </div>
            </div>

            <div className="space-y-4 animate-in slide-in-from-bottom" style={{ animationDelay: '0.8s' }}>
              <div className="text-3xl">🌅 📚 🎯 ⚡ 💫</div>
              <p className="text-lg text-gray-700 leading-relaxed bg-white/80 p-6 rounded-lg shadow-inner">
                <strong>لا تقلق!</strong><br />
                ستكون السنة القادمة أفضل بإذن الله<br />
                <br />
                <span className="text-blue-600 font-semibold">
                  استمر في التعلم والتحسن، والنجاح في انتظارك! 
                </span>
                <br />
                <br />
                تذكر: كل تجربة هي فرصة للتعلم والنمو 🌱
              </p>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl animate-in zoom-in"
              style={{ animationDelay: '1s' }}
              onClick={() => {
                setShowEncouragement(false);
                if (onResponse) onResponse();
              }}
            >
              نعم، سنحاول مرة أخرى! 💙
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="border-2 border-primary bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-800">
              استفسار عن نتيجة الطالب
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
              <p className="text-lg">
                <strong>الطالب/ة:</strong> <span className="text-blue-600">{studentName}</span>
              </p>
              <p className="text-lg">
                <strong>المستوى الحالي:</strong> <span className="text-gray-700">{currentLevel}</span>
              </p>
              <p className="text-lg">
                <strong>المستوى التالي:</strong> <span className="text-green-600">{nextLevel}</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6">
            <p className="text-xl font-semibold text-center text-blue-800">
              🎓 هل نجح/ت {studentName} في الانتقال إلى {nextLevel}؟
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-20 text-xl shadow-lg"
              onClick={() => handleResponseClick('yes')}
            >
              <CheckCircle className="h-6 w-6 ml-2" />
              نعم، نجح ✓
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-400 hover:bg-gray-100 h-20 text-xl shadow-lg"
              onClick={() => handleResponseClick('no')}
            >
              <XCircle className="h-6 w-6 ml-2" />
              لا، لم ينجح
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            يرجى الإجابة بصدق لتحديث بيانات الطالب بشكل صحيح
          </p>
        </CardContent>
      </Card>

      {/* Debug: show dialog state */}
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-[10001]">
        Dialog State: {showConfirmDialog ? 'OPEN' : 'CLOSED'}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="z-[10000] max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-2xl">
              {response === 'yes' ? '✅ تأكيد النجاح' : '❌ تأكيد عدم النجاح'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              <span className="block text-lg mb-3">
                هل أنت متأكد من أن <strong>{studentName}</strong>
                {response === 'yes' 
                  ? ' قد نجح وسينتقل إلى ' + nextLevel 
                  : ' لم ينجح وسيعيد ' + currentLevel}
                ؟
              </span>
            </AlertDialogDescription>
            {response === 'yes' ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-right">
                <span className="text-green-800 block">
                  ✓ سيتم ترقية الطالب تلقائياً إلى المستوى الجديد<br />
                  ✓ سيتلقى الطالب رسالة تهنئة
                </span>
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-right">
                <span className="text-blue-800 block">
                  • سيبقى الطالب في نفس المستوى<br />
                  • سيتلقى الطالب رسالة تشجيعية
                </span>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={submitting}>إلغاء</AlertDialogCancel>
            <Button 
              onClick={() => {
                console.log('🟢 Button clicked!');
                submitResponse();
              }} 
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? 'جاري الإرسال...' : 'نعم، تأكيد'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
