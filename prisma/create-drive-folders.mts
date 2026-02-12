import 'dotenv/config';
import { PrismaClient, Stage, Subject, User, Lesson } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';

const prisma = new PrismaClient();

let driveClient: any;

const setupGoogleDrive = () => {
  // Verify Google Credentials
  let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentialsPath) {
    // Fallback: Check if service-account.json exists in the current directory
    const defaultPath = 'service-account.json';
    if (fs.existsSync(path.resolve(process.cwd(), defaultPath))) {
      console.log(`⚠️  GOOGLE_APPLICATION_CREDENTIALS not set in .env. Found default file: ${defaultPath}`);
      credentialsPath = defaultPath;
    } else {
      console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS is not defined in .env file.');
      console.error('   Please add it to .env OR place a "service-account.json" file in the root directory.');
      process.exit(1);
    }
  }

  const resolvedPath = path.resolve(process.cwd(), credentialsPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Error: Credentials file not found at: ${resolvedPath}`);
    process.exit(1);
  }

  // Set the absolute path in env vars so Google Auth library can find it reliably
  process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
  console.log(`🔑 Using credentials file: ${resolvedPath}`);

  // Initialize Google Drive Client directly with explicit scopes
  const auth = new google.auth.GoogleAuth({
    keyFile: resolvedPath,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  driveClient = google.drive({ version: 'v3', auth });
};

// Direct implementation of Google Drive operations
const findFolder = async (name: string, parentId: string) => {
  const res = await driveClient.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentId}' in parents and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id;
  }
  return null;
};

const createFolder = async (name: string, parentId: string) => {
  const fileMetadata = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };
  const file = await driveClient.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  });
  return file.data.id;
};

const BATCH_SIZE = 50; // Process 50 records at a time to conserve memory

const log = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);
const logError = (message: string, error?: any) => {
  console.error(`[${new Date().toISOString()}] ${message}`);
  if (error) {
    console.error(error);
  }
};

const getRootFolderId = () => {
  const id = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!id) {
    throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not defined');
  }
  return id;
};

const getOrCreateFolder = async (name: string, parentId: string) => {
  const existingId = await findFolder(name, parentId);
  if (existingId) {
    return existingId;
  }
  return await createFolder(name, parentId);
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
    while (await findFolder(folderName, parentFolderId)) {
        folderName = `${baseName} ${counter}`;
        counter++;
    }
    return folderName;
}

async function main() {
  setupGoogleDrive();
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
        const folderId = await getOrCreateFolder(stage.name, rootFolderId);
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
                const folderId = await getOrCreateFolder(subject.name, subject.stage.driveFolderId);
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
    const teachersFolderId = await getOrCreateFolder('Teachers', rootFolderId);
    log(`✅ "Teachers" main folder ID: ${teachersFolderId}`);

    let teachersProcessed = 0;
    while(true) {
        const teachersToSync = await prisma.user.findMany({
            where: {
                role: { name: 'teacher' },
                userDetails: { teacherDriveFolderId: null },
            },
            include: {
                userDetails: true
            },
            take: BATCH_SIZE,
        });

        if (teachersToSync.length === 0) {
            break;
        }

        log(`Found ${teachersToSync.length} teachers to sync in this batch...`);
        for (const teacher of teachersToSync) {
            if (!teacher.userDetails) continue;

            const folderName = await getUniqueTeacherFolderName(teacher, teachersFolderId);
            log(`Creating folder for Teacher: "${teacher.firstName} ${teacher.lastName}"...`);
            const folderId = await createFolder(folderName, teachersFolderId);
            
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

    // 4. Synchronize Lessons in Batches
    log('\n--- 4. Synchronizing Lessons ---');
    let lessonsProcessed = 0;
    while (true) {
        const lessonsToSync = await prisma.lesson.findMany({
            where: {
                driveFolderId: null,
                subject: {
                    driveFolderId: { not: null },
                },
                authorId: { not: null },
            },
            include: {
                subject: true,
                author: true,
            },
            take: BATCH_SIZE,
        });

        if (lessonsToSync.length === 0) {
            break;
        }

        log(`Found ${lessonsToSync.length} lessons to sync in this batch...`);
        for (const lesson of lessonsToSync) {
            if (!lesson.subject?.driveFolderId || !lesson.author) continue;

            const teacherName = `${lesson.author.firstName} ${lesson.author.lastName}`;
            
            // Create/Get Teacher folder inside Subject folder
            // This groups lessons by teacher within the subject
            const teacherSubjectFolderId = await getOrCreateFolder(teacherName, lesson.subject.driveFolderId);

            log(`Creating folder for Lesson: "${lesson.title}" in Subject: "${lesson.subject.name}" (Teacher: ${teacherName})...`);
            const lessonFolderId = await createFolder(lesson.title, teacherSubjectFolderId);

            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { driveFolderId: lessonFolderId },
            });
            log(`   ✅ Synced Lesson "${lesson.title}" -> Folder ID: ${lessonFolderId}`);
            lessonsProcessed++;
        }
    }
    log(lessonsProcessed > 0 ? `Total lessons synchronized: ${lessonsProcessed}` : 'All lessons were already synchronized.');

  } catch (error) {
    logError('An error occurred during script execution:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    log('\n--- Script finished ---');
  }
}

main();
