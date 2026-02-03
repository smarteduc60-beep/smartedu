// test-drive.js
require('dotenv').config();
const { google } = require('googleapis');

async function testConnection() {
  try {
    console.log('Attempting to authenticate with Google Drive...');

    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

    if (!email || !key || !rootFolderId) {
      throw new Error('Missing GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_DRIVE_ROOT_FOLDER_ID in .env file');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: key.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    console.log('Authentication successful. Fetching root folder details...');

    const file = await drive.files.get({
      fileId: rootFolderId,
      fields: 'id, name, webViewLink',
    });

    console.log('✅ Connection successful!');
    console.log('Root Folder Details:');
    console.log(`  - Name: ${file.data.name}`);
    console.log(`  - ID: ${file.data.id}`);
    console.log(`  - Link: ${file.data.webViewLink}`);

  } catch (error) {
    console.error('❌ Connection failed!');
    if (error.response?.data) {
      console.error('Google API Error Details:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testConnection();
