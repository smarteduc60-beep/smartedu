// src/lib/data/parents.ts

import { prisma } from "@/lib/prisma";

export async function getChildSubjects(parentId: string, childId: string) {
  // Verify parent-child relationship
  const link = await prisma.parentChildLink.findUnique({
    where: {
      parentId_childId: {
        parentId,
        childId,
      },
    },
  });

  if (!link) {
    throw new Error("Child not found or not linked");
  }

  // Get child's level
  const child = await prisma.user.findUnique({
    where: { id: childId },
    include: {
      userDetails: {
        include: {
          level: {
            include: {
              subjects: true,
            },
          },
        },
      },
    },
  });

  if (!child || !child.userDetails?.level || !child.userDetails.levelId) {
    return {
      child: {
        id: child?.id,
        firstName: child?.firstName,
        lastName: child?.lastName,
      },
      subjects: [],
    };
  }

  const childLevelId = child.userDetails.levelId;

  // Get all subjects for this level
  const subjects = child.userDetails.level.subjects;

  // Get all teachers linked to this student
  const teacherLinks = await prisma.teacherStudentLink.findMany({
    where: {
      studentId: childId,
    },
    include: {
      teacher: {
        include: {
          userDetails: true,
        },
      },
    },
  });

  // For each subject, get teacher info and stats
  const subjectsWithDetails = await Promise.all(
    subjects.map(async (subject) => {
      // Find teacher for this subject from linked teachers
      const teacherLink = teacherLinks.find(
        (link) => link.teacher.userDetails?.subjectId === subject.id
      );
      const teacher = teacherLink?.teacher || null;

      // Get teacher's lessons for this subject and level
      const lessons = teacher
        ? await prisma.lesson.findMany({
            where: {
              authorId: teacher.id,
              subjectId: subject.id,
              levelId: childLevelId,
            },
            select: { id: true },
          })
        : [];

      const lessonIds = lessons.map((l) => l.id);

      // Get exercises for these lessons
      const exercises = lessonIds.length
        ? await prisma.exercise.findMany({
            where: { lessonId: { in: lessonIds } },
            select: { id: true },
          })
        : [];

      const exerciseIds = exercises.map((e) => e.id);

      // Get submissions for this child in these exercises
      const submissions = exerciseIds.length
        ? await prisma.submission.findMany({
            where: {
              studentId: childId,
              exerciseId: { in: exerciseIds },
            },
            select: {
              id: true,
              finalScore: true,
              aiScore: true,
              status: true,
            },
          })
        : [];

      const gradedSubmissions = submissions.filter((s) => s.status === "graded");
      let totalScore = 0;
      gradedSubmissions.forEach((sub) => {
        totalScore += Number(sub.finalScore || sub.aiScore || 0);
      });

      const averageScore =
        gradedSubmissions.length > 0
          ? Math.round(totalScore / gradedSubmissions.length)
          : 0;

      return {
        id: subject.id,
        name: subject.name,
        teacher: teacher
          ? {
              id: teacher.id,
              firstName: teacher.firstName,
              lastName: teacher.lastName,
              allowMessaging: (teacher.userDetails as any)?.allowMessaging || false,
            }
          : null,
        stats: {
          totalLessons: lessons.length,
          totalExercises: exercises.length,
          totalSubmissions: submissions.length,
          gradedSubmissions: gradedSubmissions.length,
          averageScore,
        },
      };
    })
  );

  return {
    child: {
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
    },
    subjects: subjectsWithDetails,
  };
}
