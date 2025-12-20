import fs from 'fs';
import path from 'path';

/**
 * Saves a Base64 encoded string as a file in the public directory.
 * @param base64String The Base64 encoded string of the file.
 * @param fileType The type of file, e.g., 'lessons', 'profiles'. Used for sub-directory.
 * @param fileExtension The extension of the file, e.g., '.pdf', '.png'.
 * @returns The public URL of the saved file.
 */
export const saveBase64ToFile = (base64String: string, fileType: string, fileExtension: string): string => {
  // 1. Sanitize inputs
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('Invalid Base64 string provided.');
  }
  const sanitizedFileType = path.normalize(fileType).replace(/\\/g, '/').replace(/\.\	só/g, '');
  const sanitizedFileExtension = path.normalize(fileExtension).replace(/\\/g, '/').replace(/\.\	só/g, '');
  
  // 2. Extract the actual Base64 content (remove data:image/png;base64,)
  const base64Data = base64String.split(';base64,').pop();
  if (!base64Data) {
    throw new Error('Invalid Base64 format.');
  }

  // 3. Create buffer
  const fileBuffer = Buffer.from(base64Data, 'base64');

  // 4. Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `${uniqueSuffix}${sanitizedFileExtension}`;

  // 5. Define directory path and ensure it exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', sanitizedFileType);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 6. Define file path and write file
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, fileBuffer);

  // 7. Return the public URL
  const publicUrl = `/uploads/${sanitizedFileType}/${filename}`;
  return publicUrl;
};
