// This file is deprecated - all data should come from API
// Keeping minimal exports for backward compatibility only

export const USERS: any[] = [];
export const LESSONS: any[] = [];
export const SUBJECTS: any[] = [];
export const EXERCISES: any[] = [];
export const SUBMISSIONS: any[] = [];
export const STAGES: any[] = [];
export const LEVELS: any[] = [];
export const MESSAGES: any[] = [];

// Deprecated functions - use API instead
export const getUserById = (id: number) => null;
export const getLessonById = (id: number) => null;
export const getExerciseById = (id: number) => null;
export const getSubjectById = (id: number) => null;
export const getStudent = (id: number) => null;
export const getTeacher = (id: number) => null;
export const getParent = (id: number) => null;
export const getSubjectSupervisor = (id: number) => null;
export const getLessons = () => [];
export const getSubjects = () => [];
export const getExercisesForLesson = (lessonId: number) => [];
export const getSubmissionsForStudent = (studentId: number) => [];
export const getSubmissionsForTeacher = (teacherId: number) => [];
export const getSubmissionById = (id: number) => null;
export const getChildrenOfParent = (parentId: number) => [];
export const getSubmissionsForStudents = (studentIds: number[]) => [];
