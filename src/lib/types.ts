
export type UserRole = 'directeur' | 'supervisor_general' | 'supervisor_specific' | 'teacher' | 'student' | 'parent';

export interface Stage {
  id: number;
  name: string;
  order: number;
}

export interface Level {
  id: number;
  name: string;
  stage_id: number;
  order: number;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  stageId?: number;
  levelId?: number;
  // Legacy support
  stage_id?: number;
  level_id?: number;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  name: string;
  email: string;
  role: UserRole;
  stage_id?: number;
  level_id?: number;
  subject_id?: number;
  teacher_code?: string;
  student_code?: string;
  parent_code?: string;
  connected_teacher_code?: string;
  parent_id?: number;
  avatar: string;
  ai_evaluation_mode: 'manual' | 'auto';
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string;
  pdf_url?: string;
  subject_id: number;
  level_id: number;
  author_id: number;
  type: 'public' | 'private';
  is_locked: boolean;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  question: string;
  question_file_url?: string;
  model_answer: string;
  order: number;
}

export interface Submission {
  id: number;
  student_id: number;
  exercise_id: number;
  answer: string;
  submission_file_url?: string;
  attempt_number: number;
  ai_feedback?: string;
  score?: number;
  submitted_at: string;
  status?: 'pending' | 'graded';
}

export interface Message {
  id: number;
  subject: string;
  sender_name: string;
  author_id: number;
  content: string;
  recipient_id: number;
  is_read: boolean;
  created_at: string;
}
