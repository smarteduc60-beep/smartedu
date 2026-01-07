import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // نستخدم try-catch لكل عملية عد لضمان عدم توقف الـ API بالكامل في حال وجود خطأ في جدول معين
    
    // 1. Count Lessons
    const lessonsPromise = prisma.lesson.count().catch(err => {
      console.error('Failed to count lessons:', err);
      return 0;
    });

    // 2. Count Students
    // تصحيح: role هو علاقة (Relation) وليس نصاً، لذا يجب البحث داخل الكائن المرتبط
    const studentsPromise = prisma.user.count({ 
      where: { 
        role: { name: 'student' } 
      } 
    }).catch(err => {
      console.error('Failed to count students:', err);
      return 0;
    });

    // 3. Count Teachers/Supervisors
    const teachersPromise = prisma.user.count({ 
      where: { 
        role: { 
          name: { in: ['teacher', 'supervisor_specific', 'supervisor_general'] } 
        }
      } 
    }).catch(err => {
      console.error('Failed to count teachers:', err);
      return 0;
    });

    // 4. Count Exercises (Check if model exists)
    // We check for 'exercise' or 'Exercise' to be safe
    let exercisesPromise;
    const p = prisma as any;
    
    if (p.exercise) {
      exercisesPromise = p.exercise.count();
    } else if (p.Exercise) {
      exercisesPromise = p.Exercise.count();
    } else {
      exercisesPromise = Promise.resolve(0);
    }
    
    // Wrap exercise promise in catch
    exercisesPromise = exercisesPromise.catch((err: any) => {
      console.error('Failed to count exercises:', err);
      return 0;
    });

    const [students, teachers, lessons, exercises] = await Promise.all([
      studentsPromise,
      teachersPromise,
      lessonsPromise,
      exercisesPromise,
    ]);

    return successResponse({
      students,
      teachers,
      lessons,
      exercises,
    });
  } catch (error: any) {
    console.error('Critical Error fetching public statistics:', error);
    // إرجاع استجابة ناجحة مع أصفار بدلاً من 500 لضمان استقرار الواجهة الأمامية
    return successResponse({
      students: 0,
      teachers: 0,
      lessons: 0,
      exercises: 0,
    });
  }
}