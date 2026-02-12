'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import PromotionResponse from '@/components/PromotionResponse';
import { Loader2 } from 'lucide-react';

interface PendingPromotion {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  fromLevel: {
    id: number;
    name: string;
  };
  toLevel: {
    id: number;
    name: string;
  } | null;
  messageId: number;
}

export default function PromotionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const [pendingPromotions, setPendingPromotions] = useState<PendingPromotion[]>([]);
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // تحميل الترقيات المعلقة
  useEffect(() => {
    const fetchPendingPromotions = async () => {
      // لا تفحص إلا إذا كان authenticated
      if (status !== 'authenticated' || !session?.user) {
        return;
      }

      // فقط أولياء الأمور
      if (session.user.role !== 'parent') {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/academic-years/promotions/pending');
        
        if (!response.ok) {
          console.error('Failed to fetch promotions:', response.status);
          return;
        }

        const result = await response.json();
        console.log('Pending promotions result:', result);

        if (result.success && result.data && result.data.length > 0) {
          console.log(`Found ${result.data.length} pending promotions`);
          setPendingPromotions(result.data);
        } else {
          console.log('No pending promotions found');
        }
      } catch (error) {
        console.error('Error fetching pending promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPromotions();
  }, [session, status]);

  // بعد الإجابة على ترقية
  const handlePromotionResponse = () => {
    console.log('Response received, moving to next promotion...');
    
    // الانتقال للابن التالي
    if (currentPromotionIndex < pendingPromotions.length - 1) {
      setCurrentPromotionIndex(currentPromotionIndex + 1);
    } else {
      // تم الإجابة على الجميع
      console.log('All promotions answered!');
      setPendingPromotions([]);
      setCurrentPromotionIndex(0);
    }
  };

  // Loading state - فقط أثناء الفحص
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">جاري التحقق من الترقيات المعلقة...</p>
        </div>
      </div>
    );
  }

  // إذا كانت هناك ترقيات معلقة
  if (pendingPromotions.length > 0) {
    const currentPromotion = pendingPromotions[currentPromotionIndex];

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] overflow-y-auto p-4">
        <div className="max-w-4xl w-full my-8">
          {/* Progress indicator */}
          <div className="bg-white rounded-t-lg p-4 text-center">
            <h3 className="text-xl font-bold text-gray-800">
              استفسار عن نتائج أبنائك
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              الطالب {currentPromotionIndex + 1} من {pendingPromotions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentPromotionIndex + 1) / pendingPromotions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Promotion Response Component */}
          <div className="bg-white rounded-b-lg">
            <PromotionResponse
              promotionId={currentPromotion.id}
              messageId={currentPromotion.messageId}
              studentName={`${currentPromotion.student.firstName} ${currentPromotion.student.lastName}`}
              currentLevel={currentPromotion.fromLevel.name}
              nextLevel={currentPromotion.toLevel?.name || 'نهاية المرحلة'}
              onResponse={handlePromotionResponse}
            />
          </div>

          {/* Cannot close notice */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-4 text-center">
            <p className="text-yellow-800 font-semibold">
              ⚠️ يجب الإجابة عن جميع أبنائك قبل المتابعة
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              لا يمكنك إغلاق هذه النافذة أو تصفح الموقع حتى تجيب عن نتائج جميع الأبناء
            </p>
          </div>
        </div>
      </div>
    );
  }

  // لا توجد ترقيات معلقة - عرض المحتوى العادي
  return <>{children}</>;
}
