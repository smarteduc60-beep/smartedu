/**
 * Logging System for SmartEdu Platform
 * Comprehensive logging with different levels and categories
 */

import { prisma } from './prisma';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  DEBUG = 'DEBUG'
}

export enum LogCategory {
  AUTH = 'AUTH',
  USER = 'USER',
  LESSON = 'LESSON',
  EXERCISE = 'EXERCISE',
  SUBMISSION = 'SUBMISSION',
  MESSAGE = 'MESSAGE',
  NOTIFICATION = 'NOTIFICATION',
  BACKUP = 'BACKUP',
  SYSTEM = 'SYSTEM',
  AI = 'AI',
  DRIVE = 'DRIVE',
}

interface LogData {
  level: LogLevel;
  category: LogCategory;
  action: string;
  userId?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Main logging function
 */
export async function log(data: LogData): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        level: data.level,
        category: data.category,
        action: data.action,
        userId: data.userId,
        targetId: data.targetId,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        timestamp: new Date()
      }
    });

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = getLogEmoji(data.level);
      console.log(
        `${emoji} [${data.level}] [${data.category}] ${data.action}`,
        data.details || ''
      );
    }
  } catch (error) {
    // Fallback to console if database logging fails
    console.error('Failed to write log to database:', error);
    console.log('[FALLBACK LOG]', data);
  }
}

/**
 * Quick logging helpers
 */
export const logger = {
  // Authentication logs
  auth: {
    login: (userId: string, details?: any) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.AUTH, action: 'USER_LOGIN', userId, details }),
    logout: (userId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.AUTH, action: 'USER_LOGOUT', userId }),
    loginFailed: (email: string, reason: string) =>
      log({ level: LogLevel.WARNING, category: LogCategory.AUTH, action: 'LOGIN_FAILED', details: { email, reason } }),
    signup: (userId: string, details?: any) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.AUTH, action: 'USER_SIGNUP', userId, details }),
  },

  // User management logs
  user: {
    created: (userId: string, createdBy: string, details?: any) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.USER, action: 'USER_CREATED', userId: createdBy, targetId: userId, details }),
    updated: (userId: string, updatedBy: string, changes?: any) =>
      log({ level: LogLevel.INFO, category: LogCategory.USER, action: 'USER_UPDATED', userId: updatedBy, targetId: userId, details: changes }),
    deleted: (userId: string, deletedBy: string) =>
      log({ level: LogLevel.WARNING, category: LogCategory.USER, action: 'USER_DELETED', userId: deletedBy, targetId: userId }),
    profileCompleted: (userId: string) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.USER, action: 'PROFILE_COMPLETED', userId }),
  },

  // Lesson logs
  lesson: {
    created: (lessonId: string, teacherId: string, details?: any) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.LESSON, action: 'LESSON_CREATED', userId: teacherId, targetId: lessonId, details }),
    updated: (lessonId: string, teacherId: string, changes?: any) =>
      log({ level: LogLevel.INFO, category: LogCategory.LESSON, action: 'LESSON_UPDATED', userId: teacherId, targetId: lessonId, details: changes }),
    deleted: (lessonId: string, teacherId: string) =>
      log({ level: LogLevel.WARNING, category: LogCategory.LESSON, action: 'LESSON_DELETED', userId: teacherId, targetId: lessonId }),
    viewed: (lessonId: string, userId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.LESSON, action: 'LESSON_VIEWED', userId, targetId: lessonId }),
  },

  // Exercise logs
  exercise: {
    created: (exerciseId: string, teacherId: string, details?: any) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.EXERCISE, action: 'EXERCISE_CREATED', userId: teacherId, targetId: exerciseId, details }),
    updated: (exerciseId: string, teacherId: string, changes?: any) =>
      log({ level: LogLevel.INFO, category: LogCategory.EXERCISE, action: 'EXERCISE_UPDATED', userId: teacherId, targetId: exerciseId, details: changes }),
    deleted: (exerciseId: string, teacherId: string) =>
      log({ level: LogLevel.WARNING, category: LogCategory.EXERCISE, action: 'EXERCISE_DELETED', userId: teacherId, targetId: exerciseId }),
    attempted: (exerciseId: string, studentId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.EXERCISE, action: 'EXERCISE_ATTEMPTED', userId: studentId, targetId: exerciseId }),
  },

  // Submission logs
  submission: {
    created: (submissionId: string, studentId: string, exerciseId: string) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.SUBMISSION, action: 'SUBMISSION_CREATED', userId: studentId, targetId: submissionId, details: { exerciseId } }),
    evaluated: (submissionId: string, score: number, byAI: boolean) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.SUBMISSION, action: 'SUBMISSION_EVALUATED', targetId: submissionId, details: { score, byAI } }),
    reviewed: (submissionId: string, teacherId: string, finalScore: number) =>
      log({ level: LogLevel.INFO, category: LogCategory.SUBMISSION, action: 'SUBMISSION_REVIEWED', userId: teacherId, targetId: submissionId, details: { finalScore } }),
  },

  // Message logs
  message: {
    sent: (messageId: string, senderId: string, recipientId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.MESSAGE, action: 'MESSAGE_SENT', userId: senderId, targetId: messageId, details: { recipientId } }),
    read: (messageId: string, recipientId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.MESSAGE, action: 'MESSAGE_READ', userId: recipientId, targetId: messageId }),
  },

  // Notification logs
  notification: {
    created: (notificationId: string, userId: string, type: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.NOTIFICATION, action: 'NOTIFICATION_CREATED', targetId: notificationId, details: { userId, type } }),
    read: (notificationId: string, userId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.NOTIFICATION, action: 'NOTIFICATION_READ', userId, targetId: notificationId }),
  },

  // Backup logs
  backup: {
    started: (userId: string, type: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.BACKUP, action: 'BACKUP_STARTED', userId, details: { type } }),
    completed: (userId: string, filename: string, size: number) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.BACKUP, action: 'BACKUP_COMPLETED', userId, details: { filename, size } }),
    failed: (userId: string, error: any) =>
      log({ level: LogLevel.ERROR, category: LogCategory.BACKUP, action: 'BACKUP_FAILED', userId, details: { error: error.message } }),
    restored: (userId: string, filename: string) =>
      log({ level: LogLevel.WARNING, category: LogCategory.BACKUP, action: 'BACKUP_RESTORED', userId, details: { filename } }),
  },

  // AI logs
  ai: {
    evaluationStarted: (exerciseId: string, submissionId: string) =>
      log({ level: LogLevel.INFO, category: LogCategory.AI, action: 'AI_EVALUATION_STARTED', targetId: submissionId, details: { exerciseId } }),
    evaluationCompleted: (submissionId: string, score: number, duration: number) =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.AI, action: 'AI_EVALUATION_COMPLETED', targetId: submissionId, details: { score, duration } }),
    evaluationFailed: (submissionId: string, error: any) =>
      log({ level: LogLevel.ERROR, category: LogCategory.AI, action: 'AI_EVALUATION_FAILED', targetId: submissionId, details: { error: error.message } }),
  },

  // System logs
  system: {
    started: () =>
      log({ level: LogLevel.SUCCESS, category: LogCategory.SYSTEM, action: 'SYSTEM_STARTED' }),
    error: (error: any, context?: any) =>
      log({ level: LogLevel.ERROR, category: LogCategory.SYSTEM, action: 'SYSTEM_ERROR', details: { error: error.message, stack: error.stack, context } }),
    warning: (message: string, details?: any) =>
      log({ level: LogLevel.WARNING, category: LogCategory.SYSTEM, action: 'SYSTEM_WARNING', details: { message, ...details } }),
  }
};

/**
 * Get emoji for log level
 */
function getLogEmoji(level: LogLevel): string {
  switch (level) {
    case LogLevel.SUCCESS: return '✅';
    case LogLevel.INFO: return 'ℹ️';
    case LogLevel.WARNING: return '⚠️';
    case LogLevel.ERROR: return '❌';
    case LogLevel.DEBUG: return '🔍';
    default: return '📝';
  }
}

/**
 * Get logs with filters
 */
export async function getLogs(filters: {
  level?: LogLevel;
  category?: LogCategory;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (filters.level) where.level = filters.level;
  if (filters.category) where.category = filters.category;
  if (filters.userId) where.userId = filters.userId;
  if (filters.startDate || filters.endDate) {
    where.timestamp = {};
    if (filters.startDate) where.timestamp.gte = filters.startDate;
    if (filters.endDate) where.timestamp.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.log.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.log.count({ where })
  ]);

  return { logs, total };
}

/**
 * Clean old logs (for maintenance)
 */
export async function cleanOldLogs(daysToKeep: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await prisma.log.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDate
      }
    }
  });

  await logger.system.warning(`Cleaned ${result.count} old logs`, { daysToKeep, cutoffDate });

  return result.count;
}
