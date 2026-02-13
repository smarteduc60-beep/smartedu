import CreateLessonClient from './CreateLessonClient';
import { getRootFolderId } from '@/lib/google-drive';

export default function CreateLessonPage() {
  // جلب معرف المجلد الجذري من متغيرات البيئة (Server-Side)
  const googleDriveParentFolderId = getRootFolderId();

  return (
    <CreateLessonClient googleDriveParentFolderId={googleDriveParentFolderId} />
  );
}
