'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface OnboardingTourProps {
  steps: any[];
  tourKey: string; // مفتاح فريد لكل جولة لضمان عدم تكرارها
}

export default function OnboardingTour({ steps, tourKey }: OnboardingTourProps) {
  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد شاهد الجولة سابقاً
    const hasSeenTour = localStorage.getItem(tourKey);

    // تسجيل للتحقق من الحالة في الكونسول (F12)
    console.log(`[Onboarding] Checking tour "${tourKey}". Seen before? ${!!hasSeenTour}`);
    
    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        steps: steps,
        nextBtnText: 'التالي',
        prevBtnText: 'السابق',
        doneBtnText: 'إنهاء',
        allowClose: true, // السماح بالإغلاق
        onDestroyed: () => {
          // حفظ أن المستخدم قد شاهد الجولة عند انتهائها أو إغلاقها
          localStorage.setItem(tourKey, 'true');
        }
      });
      
      // تأخير بسيط لضمان تحميل العناصر في الصفحة
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [steps, tourKey]);

  return null;
}