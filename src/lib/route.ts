import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { listAllAccountFolders, deleteFile } from '@/lib/google-drive';

// GET /api/drive/cleanup - Scans for orphaned folders
export async function GET(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    // 1. Fetch all known folder IDs from the database
    const [
      stageFolders,
      subjectFolders,
      lessonFolders,
      exerciseFolders,
      teacherFolders,
    ] = await Promise.all([
      prisma.stage.findMany({ select: { driveFolderId: true } }),
      prisma.subject.findMany({ select: { driveFolderId: true } }),
      prisma.lesson.findMany({ select: { driveFolderId: true } }),
      prisma.exercise.findMany({ select: { driveFolderId: true } }),
      prisma.userDetails.findMany({ select: { teacherDriveFolderId: true } }),
    ]);

    const dbFolderIds = new Set([
      ...stageFolders.map(f => f.driveFolderId),
      ...subjectFolders.map(f => f.driveFolderId),
      ...lessonFolders.map(f => f.driveFolderId),
      ...exerciseFolders.map(f => f.driveFolderId),
      ...teacherFolders.map(f => f.teacherDriveFolderId),
    ].filter(Boolean)); // Filter out null/undefined values

    // Add the root folder to the set of known folders to avoid deleting it
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (rootFolderId) {
      dbFolderIds.add(rootFolderId);
    }

    // 2. Fetch all folders from Google Drive
    const driveFolders = await listAllAccountFolders();

    // 3. Find orphaned folders
    const orphanedFolders = driveFolders.filter(
      (driveFolder) => !dbFolderIds.has(driveFolder.id)
    );

    return successResponse({
      orphanedFolders,
      stats: {
        driveFolderCount: driveFolders.length,
        dbFolderCount: dbFolderIds.size,
        orphanedCount: orphanedFolders.length,
      },
    });
  } catch (error: any) {
    console.error('Drive cleanup scan error:', error);
    return errorResponse(error.message || 'Failed to scan for orphaned folders', 500);
  }
}

// DELETE /api/drive/cleanup - Deletes specified orphaned folders
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(['directeur']);

    const { folderIds } = await request.json();

    if (!Array.isArray(folderIds) || folderIds.length === 0) {
      return errorResponse('An array of folder IDs is required.', 400);
    }

    const deletionPromises = folderIds.map(id => deleteFile(id).catch(e => ({ id, error: e.message })));
    const results = await Promise.allSettled(deletionPromises);

    const deletedCount = results.filter(r => r.status === 'fulfilled').length;
    const errors = results.filter(r => r.status === 'rejected').map(r => (r as PromiseRejectedResult).reason);

    return successResponse({ deletedCount, totalRequested: folderIds.length, errors, }, `Successfully deleted ${deletedCount} of ${folderIds.length} folders.`);
  } catch (error: any) {
    console.error('Drive cleanup delete error:', error);
    return errorResponse(error.message || 'Failed to delete folders', 500);
  }
}