import { google } from 'googleapis';
import { Readable } from 'stream';

// متغير لتخزين نسخة العميل (Singleton Pattern)
let driveClient: any = null;

// ذاكرة تخزين مؤقت لمعرفات المجلدات لتجنب التكرار (Caching)
const folderCache = new Map<string, Promise<string>>();

/**
 * دالة مساعدة لإعادة المحاولة عند حدوث أخطاء في الشبكة
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.status === 429)) {
      console.warn(`[GoogleDrive] ⚠️ Network error. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * الحصول على عميل Google Drive مع التهيئة الكسولة
 */
function getDriveClient() {
  if (driveClient) return driveClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  driveClient = google.drive({ version: 'v3', auth });
  return driveClient;
}

/**
 * دالة ذرية للبحث عن مجلد أو إنشائه داخل مجلد أب محدد
 * @param folderName اسم المجلد
 * @param parentId معرف المجلد الأب (null يعني الجذر)
 */
async function findOrCreateFolder(folderName: string, parentId: string | null): Promise<string> {
  const cleanFolderName = folderName.trim();
  const cacheKey = `${parentId || 'root'}|${cleanFolderName}`;

  if (folderCache.has(cacheKey)) {
    return folderCache.get(cacheKey)!;
  }

  const folderPromise = (async () => {
    const drive = getDriveClient();
    const sanitizedName = cleanFolderName.replace(/'/g, "\\'");
    
    const query = [
      `mimeType='application/vnd.google-apps.folder'`,
      `name='${sanitizedName}'`,
      `trashed=false`,
      parentId ? `'${parentId}' in parents` : `'root' in parents`
    ].join(' and ');

    console.log(`[GoogleDrive] 🔍 Searching for folder: "${cleanFolderName}" in parent: ${parentId || 'root'}`);

    try {
      // 1. محاولة العثور على المجلد
      const listRes = await withRetry(() => drive.files.list({
        q: query,
        fields: 'files(id, name, parents)',
        spaces: 'drive',
      }));

      const existingFolder = listRes.data.files?.[0];

      if (existingFolder?.id) {
        console.log(`[GoogleDrive] ✅ Found folder: "${cleanFolderName}" (ID: ${existingFolder.id})`);
        return existingFolder.id;
      }

      // 2. إنشاء المجلد إذا لم يوجد
      console.log(`[GoogleDrive] ⚠️ Creating folder: "${cleanFolderName}" inside ${parentId || 'root'}`);
      const createRes = await withRetry(() => drive.files.create({
        requestBody: {
          name: cleanFolderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentId ? [parentId] : undefined,
        },
        fields: 'id, parents',
      }));

      if (!createRes.data.id) throw new Error(`Failed to create folder: ${cleanFolderName}`);
      return createRes.data.id;
    } catch (error) {
      console.error(`[GoogleDrive] ❌ Error in findOrCreateFolder for "${cleanFolderName}":`, error);
      throw error;
    }
  })();

  folderCache.set(cacheKey, folderPromise);
  try {
    return await folderPromise;
  } catch (error) {
    folderCache.delete(cacheKey);
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
  const drive = getDriveClient();

  const requestBody = {
    name: fileName,
    parents: [folderId],
  };

  // رفع الملف
  const response = await withRetry(() => {
    const stream = Readable.from(fileBuffer);
    return drive.files.create({
      requestBody: requestBody,
      media: {
        mimeType: mimeType,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink, parents',
    });
  });

  console.log(`[GoogleDrive] 🎉 Upload successful. File ID: ${response.data.id}`);

  // ============================================================
  // خطوة التحقق والتصحيح (Self-Correction Step)
  // ============================================================
  const actualParents = response.data.parents || [];
  
  if (!actualParents.includes(folderId)) {
    console.warn(`[GoogleDrive] ⚠️ File landed in wrong folder(s): [${actualParents.join(', ')}]. Moving to: ${folderId}...`);
    
    try {
      await withRetry(() => drive.files.update({
        fileId: response.data.id!,
        addParents: folderId,
        removeParents: actualParents.join(','), // إزالة الملف من أي مجلد آخر (مثل Root)
        fields: 'id, parents',
      }));
      
      console.log(`[GoogleDrive] ✅ File moved successfully to correct folder.`);
    } catch (moveError) {
      console.error(`[GoogleDrive] ❌ Failed to move file:`, moveError);
    }
  }

  // جعل الملف عاماً للقراءة (لضمان عمل روابط الصور)
  try {
    await withRetry(() => drive.permissions.create({
      fileId: response.data.id!,
      requestBody: { role: 'reader', type: 'anyone' },
    }));
  } catch (permError) {
    console.warn(`[GoogleDrive] ⚠️ Failed to set public permissions:`, permError);
  }

  // استخدام رابط Proxy للصور لتجنب مشاكل 403
  const publicUrl = mimeType.startsWith('image/') 
    ? `/api/images/proxy?fileId=${response.data.id}`
    : `https://drive.google.com/uc?export=view&id=${response.data.id}`;

  return {
    fileId: response.data.id!,
    webViewLink: publicUrl,
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