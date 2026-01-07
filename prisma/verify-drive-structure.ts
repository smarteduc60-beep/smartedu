import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

async function getDriveClient() {
  let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) {
    const defaultPath = 'service-account.json';
    if (fs.existsSync(path.resolve(process.cwd(), defaultPath))) {
      credentialsPath = defaultPath;
    }
  }
  
  if (!credentialsPath) throw new Error("No credentials found");

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(process.cwd(), credentialsPath),
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

async function verifyFolderExists(drive: any, folderId: string, label: string) {
  try {
    const res = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, parents, trashed, webViewLink',
      supportsAllDrives: true,
    });
    
    if (res.data.trashed) {
      console.error(`❌ ${label}: Folder "${res.data.name}" is in trash!`);
      return null;
    }
    console.log(`✅ ${label}: Found "${res.data.name}"`);
    console.log(`   ID: ${folderId}`);
    console.log(`   Link: ${res.data.webViewLink}`);
    return res.data;
  } catch (e: any) {
    console.error(`❌ ${label}: Failed to find folder (${folderId}): ${e.message}`);
    return null;
  }
}

async function main() {
  const drive = await getDriveClient();
  
  console.log("🔍 Starting Deep Verification of Drive Hierarchy...\n");

  // 1. Get the most recently created Exercise that has a Drive Folder
  const exercise = await prisma.exercise.findFirst({
    where: { driveFolderId: { not: null } },
    include: {
      lesson: {
        include: {
          subject: true,
          author: true
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  if (!exercise) {
    console.log("⚠️ No exercises with Drive folders found to verify.");
    return;
  }

  console.log(`Testing Hierarchy for Latest Exercise ID: ${exercise.id}`);
  console.log(`Context: Lesson "${exercise.lesson.title}" by ${exercise.lesson.author.firstName}\n`);

  // 2. Verify Exercise Folder
  const exerciseFolder = await verifyFolderExists(drive, exercise.driveFolderId!, "Exercise Folder");
  
  // 3. Verify Lesson Folder
  if (exercise.lesson.driveFolderId) {
    const lessonFolder = await verifyFolderExists(drive, exercise.lesson.driveFolderId, "Lesson Folder");
    
    // Check if Exercise is inside Lesson
    if (exerciseFolder && lessonFolder) {
      if (exerciseFolder.parents?.includes(lessonFolder.id)) {
        console.log(`   🔗 LINK VERIFIED: Exercise is inside Lesson.`);
      } else {
        console.error(`   ❌ LINK BROKEN: Exercise is NOT inside Lesson folder!`);
      }
    }

    // 4. Verify Teacher Folder (Parent of Lesson)
    if (lessonFolder && lessonFolder.parents && lessonFolder.parents.length > 0) {
        const parentId = lessonFolder.parents[0];
        const teacherFolder = await verifyFolderExists(drive, parentId, "Teacher Folder (in Subject)");
        
        // 5. Verify Subject Folder (Parent of Teacher Folder)
        if (teacherFolder && teacherFolder.parents && teacherFolder.parents.length > 0) {
             const subjectId = teacherFolder.parents[0];
             // Check if this matches the subject ID in DB
             if (subjectId === exercise.lesson.subject.driveFolderId) {
                 console.log(`   🔗 LINK VERIFIED: Teacher folder is inside correct Subject folder.`);
             } else {
                 console.log(`   ℹ️ Teacher folder parent ID: ${subjectId}`);
             }
        }
    }
  }

  console.log("\n✅ Verification Logic Complete.");
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());