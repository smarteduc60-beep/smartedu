import CreateLessonClient from './create-lesson-client';
import { getRootFolderId } from '@/lib/google-drive';

export default function CreateLessonPageServer() {
  const googleDriveParentFolderId = getRootFolderId();

  return (
    <CreateLessonClient googleDriveParentFolderId={googleDriveParentFolderId} />
  );
}