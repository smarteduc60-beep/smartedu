import { google } from 'googleapis';
import { Readable } from 'stream';

// متغير لتخزين نسخة العميل (Singleton Pattern)
let driveClient: any = null;

// ذاكرة تخزين مؤقت لمعرفات المجلدات لتجنب التكرار ومشاكل الفهرسة (Caching)
// نستخدم Promise لتخزين العمليات الجارية، مما يمنع التكرار عند الطلبات المتزامنة (Race Conditions)
const folderCache = new Map<string, Promise<string>>();

/**
 * دالة مساعدة لإعادة المحاولة عند حدوث أخطاء في الشبكة
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isNetworkError = 
      error.code === 'EAI_AGAIN' || 
      error.code === 'ETIMEDOUT' || 
      error.code === 'ECONNRESET' ||
      error.message?.includes('EAI_AGAIN');

    if (retries > 0 && isNetworkError) {
      console.warn(`[GoogleDrive] ⚠️ Network error (${error.code || 'EAI_AGAIN'}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * دالة للحصول على عميل Google Drive مع التهيئة الكسولة (Lazy Loading)
 * تمنع توقف التطبيق عند البدء إذا كانت المتغيرات مفقودة
 */
function getDriveClient() {
  if (driveClient) return driveClient;

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  // 1. محاولة الاتصال عبر Service Account (الأولوية)
  if (email && key) {
    console.log('[GoogleDrive] 🔑 Using Service Account authentication.');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: key.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    driveClient = google.drive({ version: 'v3', auth });
    return driveClient;
  }

  // 2. محاولة الاتصال عبر OAuth2 (بناءً على ملف .env الخاص بك)
  if (clientId && clientSecret && refreshToken) {
    console.log('[GoogleDrive] 🔑 Using OAuth2 authentication.');
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground" // Redirect URL قياسي
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    driveClient = google.drive({ version: 'v3', auth: oauth2Client });
    return driveClient;
  }

  // 3. فشل المصادقة
  throw new Error("بيانات اعتماد Google Drive مفقودة. يرجى توفير إما Service Account (EMAIL/KEY) أو OAuth2 (CLIENT_ID/SECRET/REFRESH_TOKEN) في ملف .env");

  return driveClient;
}

/**
 * دالة ذرية للبحث عن مجلد أو إنشائه داخل مجلد أب محدد
 */
async function findOrCreateFolder(folderName: string, parentId: string | null): Promise<string> {
  const cleanFolderName = folderName.trim();
  // مفتاح الكاش: المعرف الأب + اسم المجلد
  const cacheKey = `${parentId || 'root'}|${cleanFolderName}`;

  if (folderCache.has(cacheKey)) {
    console.log(`[GoogleDrive] ⚡ Joining existing folder request for: "${cleanFolderName}"`);
    return folderCache.get(cacheKey)!;
  }

  // إنشاء مهمة (Promise) للبحث أو الإنشاء
  const folderPromise = (async () => {
    const sanitizedName = cleanFolderName.replace(/'/g, "\\'");
    const drive = getDriveClient();

    const query = [
      `mimeType='application/vnd.google-apps.folder'`,
      `name='${sanitizedName}'`,
      `trashed=false`,
      parentId ? `'${parentId}' in parents` : `'root' in parents`
    ].join(' and ');

    console.log(`[GoogleDrive] 🔍 Searching for folder: "${cleanFolderName}" in parent: ${parentId || 'root'}`);

    try {
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

      console.log(`[GoogleDrive] ⚠️ Creating folder: "${cleanFolderName}" inside ${parentId || 'root'}`);
      const createRes = await withRetry(() => drive.files.create({
        requestBody: {
          name: cleanFolderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentId ? [parentId] : undefined,
        },
        fields: 'id, parents',
      }));

      if (!createRes.data.id) {
        throw new Error(`Failed to create folder: ${cleanFolderName}`);
      }
      console.log(`[GoogleDrive] ✨ Created folder ID: ${createRes.data.id}`);
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
    // في حال الفشل، نحذف المفتاح من الكاش لنسمح بالمحاولة مرة أخرى
    folderCache.delete(cacheKey);
    throw error;
  }
}

/**
 * دالة مساعدة لحل مسار المجلدات وإرجاع المعرف النهائي
 */
export async function resolveHierarchy(pathHierarchy: string[]): Promise<string> {
  let currentParentId: string | null = getRootFolderId();

  console.log(`[GoogleDrive] 🌳 Resolving hierarchy: ${JSON.stringify(pathHierarchy)} starting from parent: ${currentParentId || 'root'}`);

  for (const folderName of pathHierarchy) {
    if (!folderName || !folderName.trim()) continue;
    currentParentId = await findOrCreateFolder(folderName, currentParentId);
    console.log(`[GoogleDrive] 📍 Resolved "${folderName}" -> ID: ${currentParentId}`);
  }

  if (!currentParentId) {
    throw new Error("Hierarchy resolution failed: Final folder ID is null.");
  }

  return currentParentId;
}

/**
 * دالة لرفع ملف مباشرة إلى مجلد محدد
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
  console.log(`[GoogleDrive] 📦 Request Body: ${JSON.stringify(requestBody)}`);

  // نستخدم withRetry ونقوم بإنشاء الـ stream داخلها لأن الـ stream لا يمكن قراءته إلا مرة واحدة
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
  console.log(`[GoogleDrive] 📨 Response Parents: ${JSON.stringify(response.data.parents)}`);

  // خطوة التحقق والتصحيح
  const actualParents = response.data.parents || [];
  
  if (!actualParents.includes(folderId)) {
    console.warn(`[GoogleDrive] ⚠️ File landed in wrong folder(s): [${actualParents.join(', ')}]. Moving to: ${folderId}...`);
    
    try {
      await withRetry(() => drive.files.update({
        fileId: response.data.id!,
        addParents: folderId,
        removeParents: actualParents.join(','),
        fields: 'id, parents',
      }));
      console.log(`[GoogleDrive] ✅ File moved successfully to correct folder.`);
    } catch (moveError) {
      console.error(`[GoogleDrive] ❌ Failed to move file:`, moveError);
    }
  }

  // ============================================================
  // خطوة الصلاحيات: جعل الملف عاماً للقراءة (Public Reader)
  // ============================================================
  try {
    await withRetry(() => drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    }));
    console.log(`[GoogleDrive] 🔓 File made public (anyone with link).`);
  } catch (permError) {
    console.warn(`[GoogleDrive] ⚠️ Failed to make file public:`, permError);
  }

  let publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

  // تخصيص الرابط حسب نوع الملف لتحسين العرض
  if (mimeType?.startsWith('image/')) {
    // للصور: نستخدم مسار الوكيل (Proxy) الخاص بنا لتجاوز مشاكل الكوكيز و 403
    // هذا الرابط سيتم تخزينه في قاعدة البيانات ويستخدمه الفرونت إند
    publicUrl = `/api/images/proxy?fileId=${response.data.id}`;
  } else if (mimeType === 'application/pdf') {
    // لملفات PDF: نستخدم الرابط القياسي (uc?export=view) لضمان حفظه بشكل صحيح
    // سيتم تحويله إلى رابط معاينة (preview) في صفحة العرض
    publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  }

  console.log(`[GoogleDrive] 🔗 Generated Public URL: ${publicUrl}`);

  return {
    fileId: response.data.id!,
    webViewLink: publicUrl,
    webContentLink: response.data.webContentLink,
  };
}

/**
 * دالة لجلب تدفق الملف (Stream) من Google Drive
 * تستخدم في API Proxy لتجاوز مشاكل الكوكيز و 403 Forbidden
 */
export async function getFileStream(fileId: string) {
  const drive = getDriveClient();
  try {
    const response = await withRetry(() => drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    ));

    return {
      stream: response.data, // Node.js Readable Stream
      contentType: response.headers['content-type'] || 'application/octet-stream',
      contentLength: response.headers['content-length'],
    };
  } catch (error) {
    console.error(`[GoogleDrive] ❌ Failed to get file stream for ${fileId}:`, error);
    throw error;
  }
}

/**
 * الدالة الرئيسية
 */
export async function uploadFileToHierarchy(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  pathHierarchy: string[]
) {
  try {
    const currentParentId = await resolveHierarchy(pathHierarchy);
    return await uploadFile(fileBuffer, fileName, mimeType, currentParentId);
  } catch (error) {
    console.error("[GoogleDrive] Upload failed:", error);
    throw error;
  }
}

/**
 * دالة لاسترجاع معرف المجلد الجذري (للتوافق مع الواجهات القديمة)
 */
export function getRootFolderId() {
  return process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || null;
}

// ========================================================
// طبقة التوافق (Compatibility Layer)
// لإصلاح الأخطاء في api/lessons/route.ts و api/users/[id]/route.ts
// ========================================================

export const GoogleDriveService = {
  // دالة البحث أو الإنشاء (نفس المنطق الجديد)
  getOrCreateFolder: findOrCreateFolder,
  
  // دالة الإنشاء المباشر (تستخدم نفس منطق البحث أو الإنشاء لضمان عدم التكرار)
  createFolder: findOrCreateFolder,

  // دالة الرفع القديمة (كانت تستقبل الاسم أولاً)
  // نقوم بقلب المعاملات لتتوافق مع الدالة الجديدة
  uploadFile: async (fileName: string, fileBuffer: Buffer, mimeType: string, folderId: string) => {
    return uploadFile(fileBuffer, fileName, mimeType, folderId);
  },

  // دالة جعل الملف عاماً (يمكن تركها فارغة أو تنفيذها إذا لزم الأمر)
  makeFilePublic: async (fileId: string) => {
    try {
      const drive = getDriveClient();
      await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
      });
    } catch (e) {
      console.warn(`[GoogleDrive] Failed to make file public: ${fileId}`, e);
    }
  }
};