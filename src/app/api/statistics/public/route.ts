import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get counts from database
    const [studentCount, teacherCount, lessonCount, exerciseCount] = await Promise.all([
      prisma.user.count({ 
        where: { 
          role: { name: 'student' }
        } 
      }),
      prisma.user.count({ 
        where: { 
          OR: [
            { role: { name: 'teacher' } },
            { role: { name: 'supervisor_specific' } }
          ]
        } 
      }),
      prisma.lesson.count(),
      prisma.exercise.count(),
    ]);

    // Get top students per level
    const topStudents = await prisma.$queryRaw<Array<{
      id: string;
      firstName: string;
      lastName: string;
      levelName: string;
      averageScore: number;
    }>>`
      SELECT 
        u.id,
        u.firstName,
        u.lastName,
        l.name as levelName,
        AVG(s.score) as averageScore
      FROM User u
      INNER JOIN Level l ON u.levelId = l.id
      INNER JOIN Submission s ON u.id = s.userId
      WHERE u.roleId = (SELECT id FROM Role WHERE name = 'student')
        AND s.score IS NOT NULL
      GROUP BY u.id, u.firstName, u.lastName, l.name, u.levelId
      HAVING AVG(s.score) = (
        SELECT MAX(avg_score)
        FROM (
          SELECT AVG(s2.score) as avg_score
          FROM User u2
          INNER JOIN Submission s2 ON u2.id = s2.userId
          WHERE u2.levelId = u.levelId 
            AND u2.roleId = (SELECT id FROM Role WHERE name = 'student')
            AND s2.score IS NOT NULL
          GROUP BY u2.id
        ) AS level_scores
      )
      ORDER BY l.id
      LIMIT 6
    `;

    return NextResponse.json({
      studentCount,
      teacherCount,
      lessonCount,
      exerciseCount,
      topStudents
    });
  } catch (error) {
    console.error('Error fetching public statistics:', error);
    return NextResponse.json(
      { 
        studentCount: 0,
        teacherCount: 0,
        lessonCount: 0,
        exerciseCount: 0,
        topStudents: []
      },
      { status: 200 } // Return empty stats instead of error
    );
  }
}
