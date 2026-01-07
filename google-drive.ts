import { google } from 'googleapis';
import { Readable } from 'stream';

// إعدادات المصادقة
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

/**
 * دالة ذرية للبحث عن مجلد أو إنشائه داخل مجلد أب محدد
 * @param folderName اسم المجلد
 * @param parentId معرف المجلد الأب (null يعني الجذر)
 */
async function findOrCreateFolder(folderName: string, parentId: string | null): Promise<string> {
  // تنظيف الاسم من الرموز التي قد تكسر الاستعلام
  const sanitizedName = folderName.replace(/'/g, "\\'");
  
  const query = [
    `mimeType='application/vnd.google-apps.folder'`,
    `name='${sanitizedName}'`,
    `trashed=false`,
    parentId ? `'${parentId}' in parents` : `'root' in parents`
  ].join(' and ');

  console.log(`[GoogleDrive] 🔍 Searching for folder: "${folderName}" in parent: ${parentId || 'root'}`);
  console.log(`[GoogleDrive] 📝 Query: ${query}`);

  try {
    // 1. محاولة العثور على المجلد
    const listRes = await drive.files.list({
      q: query,
      fields: 'files(id, name, parents)',
      spaces: 'drive',
    });

    const existingFolder = listRes.data.files?.[0];

    if (existingFolder?.id) {
      console.log(`[GoogleDrive] ✅ Found folder: "${folderName}" (ID: ${existingFolder.id}) inside ${parentId || 'root'}`);
      console.log(`[GoogleDrive] 🕵️ Folder parents: ${JSON.stringify(existingFolder.parents)}`);
      return existingFolder.id;
    }

    // 2. إنشاء المجلد إذا لم يوجد
    console.log(`[GoogleDrive] ⚠️ Creating folder: "${folderName}" inside ${parentId || 'root'}`);
    const createRes = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined, // مهم جداً: تحديد الأب
      },
      fields: 'id, parents',
    });

    if (!createRes.data.id) {
      throw new Error(`Failed to create folder: ${folderName}`);
    }
    console.log(`[GoogleDrive] ✨ Created folder ID: ${createRes.data.id} with parents: ${JSON.stringify(createRes.data.parents)}`);

    return createRes.data.id;
  } catch (error) {
    console.error(`[GoogleDrive] ❌ Error in findOrCreateFolder for "${folderName}":`, error);
    throw error;
  }
}

/**
 * دالة مساعدة لحل مسار المجلدات وإرجاع المعرف النهائي
 * @param pathHierarchy مصفوفة بأسماء المجلدات مرتبة
 */
export async function resolveHierarchy(pathHierarchy: string[]): Promise<string> {
  let currentParentId: string | null = null;

  console.log(`[GoogleDrive] 🌳 Resolving hierarchy: ${JSON.stringify(pathHierarchy)}`);

  for (const folderName of pathHierarchy) {
    if (!folderName) continue;
    currentParentId = await findOrCreateFolder(folderName, currentParentId);
    console.log(`[GoogleDrive] 📍 Resolved "${folderName}" -> ID: ${currentParentId}`);
  }

  if (!currentParentId) {
    throw new Error("Hierarchy resolution failed: Final folder ID is null.");
  }

  return currentParentId;
}

/**
 * دالة لرفع ملف مباشرة إلى مجلد محدد (Primitive Operation)
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
) {
  console.log(`[GoogleDrive] 🚀 Uploading file "${fileName}" to Folder ID: ${folderId}`);

  // تحويل الـ Buffer إلى Stream
  const stream = Readable.from(fileBuffer);

  const requestBody = {
    name: fileName,
    parents: [folderId], // التأكد من وضع الملف داخل المجلد المحدد
  };
  console.log(`[GoogleDrive] 📦 Request Body: ${JSON.stringify(requestBody)}`);

  // رفع الملف
  const response = await drive.files.create({
    requestBody: requestBody,
    media: {
      mimeType: mimeType,
      body: stream,
    },
    fields: 'id, webViewLink, webContentLink, parents', // طلبنا حقل parents للتحقق
  });

  console.log(`[GoogleDrive] 🎉 Upload successful. File ID: ${response.data.id}`);
  console.log(`[GoogleDrive] 📨 Response Parents: ${JSON.stringify(response.data.parents)}`);

  // ============================================================
  // خطوة التحقق والتصحيح (Self-Correction Step)
  // ============================================================
  const actualParents = response.data.parents || [];
  
  if (!actualParents.includes(folderId)) {
    console.warn(`[GoogleDrive] ⚠️ File landed in wrong folder(s): [${actualParents.join(', ')}]. Moving to: ${folderId}...`);
    
    try {
      await drive.files.update({
        fileId: response.data.id!,
        addParents: folderId,
        removeParents: actualParents.join(','), // إزالة الملف من أي مجلد آخر (مثل Root)
        fields: 'id, parents',
      });
      
      console.log(`[GoogleDrive] ✅ File moved successfully to correct folder.`);
    } catch (moveError) {
      console.error(`[GoogleDrive] ❌ Failed to move file:`, moveError);
    }
  }

  return {
    fileId: response.data.id!,
    webViewLink: response.data.webViewLink,
    webContentLink: response.data.webContentLink,
  };
}

/**
 * الدالة الرئيسية لرفع الملف في المسار الهرمي الصحيح
 */
export async function uploadFileToHierarchy(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  pathHierarchy: string[]
) {
  try {
    // 1. الحصول على معرف المجلد النهائي باستخدام الدالة الجديدة
    const currentParentId = await resolveHierarchy(pathHierarchy);
    
    // 2. استدعاء دالة الرفع باستخدام المعرف الذي تم حله
    return await uploadFile(fileBuffer, fileName, mimeType, currentParentId);
  } catch (error) {
    console.error("[GoogleDrive] Upload failed:", error);
    throw error;
  }
}