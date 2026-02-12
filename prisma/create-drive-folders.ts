import { PrismaClient, Stage, Subject, User } from '@prisma/client';
import { GoogleDriveService, getRootFolderId } from '../src/lib/google-drive';

const prisma = new PrismaClient();
const BATCH_SIZE = 50; // Process 50 records at a time to conserve memory

const log = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);
const logError = (message: string, error?: any) => {
  console.error(`[${new Date().toISOString()}] ${message}`);
  if (error) {
    console.error(error);
  }
};

/**
 * Creates a unique folder name for a user, handling potential duplicates.
 * Example: "John Doe", "John Doe 1", "John Doe 2"
 * @param user The user object.
 * @param parentFolderId The ID of the parent folder in Google Drive.
 * @returns A unique folder name.
 */
async function getUniqueTeacherFolderName(user: User, parentFolderId: string): Promise<string> {
    const baseName = `${user.firstName} ${user.lastName}`;
    let folderName = baseName;
    let counter = 1;
    while (await GoogleDriveService.findFolder(folderName, parentFolderId)) {
        folderName = `${baseName} ${counter}`;
        counter++;
    }
    return folderName;
}

async function main() {
  log('🚀 Starting Google Drive folder creation script (Safe Batch Mode)...');

  try {
    const rootFolderId = getRootFolderId();
    log(`✅ Root Google Drive folder ID is: ${rootFolderId}`);

    // 1. Synchronize Stages in Batches
    log('\n--- 1. Synchronizing Stages ---');
    let stagesProcessed = 0;
    while (true) {
      const stagesToSync = await prisma.stage.findMany({
        where: { driveFolderId: null },
        take: BATCH_SIZE,
      });

      if (stagesToSync.length === 0) {
        break; // No more stages to sync
      }

      log(`Found ${stagesToSync.length} stages to sync in this batch...`);
      for (const stage of stagesToSync) {
        log(`Creating folder for Stage: "${stage.name}"...`);
        const folderId = await GoogleDriveService.getOrCreateFolder(stage.name, rootFolderId);
        await prisma.stage.update({
          where: { id: stage.id },
          data: { driveFolderId: folderId },
        });
        log(`   ✅ Synced Stage "${stage.name}" -> Folder ID: ${folderId}`);
        stagesProcessed++;
      }
    }
    log(stagesProcessed > 0 ? `Total stages synchronized: ${stagesProcessed}` : 'All stages were already synchronized.');

    // 2. Synchronize Subjects in Batches
    log('\n--- 2. Synchronizing Subjects ---');
    let subjectsProcessed = 0;
    while (true) {
        const subjectsToSync = await prisma.subject.findMany({
            where: {
                driveFolderId: null,
                stage: {
                    driveFolderId: {
                        not: null,
                    },
                },
            },
            include: { stage: true },
            take: BATCH_SIZE,
        });

        if (subjectsToSync.length === 0) {
            break;
        }

        log(`Found ${subjectsToSync.length} subjects to sync in this batch...`);
        for (const subject of subjectsToSync) {
            if (subject.stage?.driveFolderId) {
                log(`Creating folder for Subject: "${subject.name}" in Stage: "${subject.stage.name}"...`);
                const folderId = await GoogleDriveService.getOrCreateFolder(subject.name, subject.stage.driveFolderId);
                await prisma.subject.update({
                    where: { id: subject.id },
                    data: { driveFolderId: folderId },
                });
                log(`   ✅ Synced Subject "${subject.name}" -> Folder ID: ${folderId}`);
                subjectsProcessed++;
            }
        }
    }
    log(subjectsProcessed > 0 ? `Total subjects synchronized: ${subjectsProcessed}`: 'All subjects were already synchronized.');


    // 3. Synchronize Teachers in Batches
    log('\n--- 3. Synchronizing Teachers ---');
    const teachersFolderId = await GoogleDriveService.getOrCreateFolder('Teachers', rootFolderId);
    log(`✅ "Teachers" main folder ID: ${teachersFolderId}`);

    let teachersProcessed = 0;
    while(true) {
        const teachersToSync = await prisma.user.findMany({
            where: {
                role: { name: 'teacher' },
                userDetails: { teacherDriveFolderId: null },
            },
            take: BATCH_SIZE,
        });

        if (teachersToSync.length === 0) {
            break;
        }

        log(`Found ${teachersToSync.length} teachers to sync in this batch...`);
        for (const teacher of teachersToSync) {
            const folderName = await getUniqueTeacherFolderName(teacher, teachersFolderId);
            log(`Creating folder for Teacher: "${teacher.firstName} ${teacher.lastName}"...`);
            const folderId = await GoogleDriveService.createFolder(folderName, teachersFolderId);
            
            await prisma.user.update({
                where: { id: teacher.id },
                data: {
                    userDetails: {
                        update: {
                            teacherDriveFolderId: folderId,
                        },
                    },
                },
            });
            log(`   ✅ Synced Teacher "${teacher.firstName} ${teacher.lastName}" -> Folder ID: ${folderId}`);
            teachersProcessed++;
        }
    }
    log(teachersProcessed > 0 ? `Total teachers synchronized: ${teachersProcessed}` : 'All teachers were already synchronized.');

  } catch (error) {
    logError('An error occurred during script execution:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    log('\n--- Script finished ---');
  }
}

main();