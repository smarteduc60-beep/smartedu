import { NextRequest, NextResponse } from 'next/server';
import { getFileStream } from '@/lib/google-drive';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session) {
       return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return new NextResponse('File ID is required', { status: 400 });
    }

    try {
      const { stream, contentType, contentLength } = await getFileStream(fileId);

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      if (contentLength) {
        headers.set('Content-Length', contentLength);
      }
      headers.set('Cache-Control', 'public, max-age=86400');

      // @ts-ignore
      return new NextResponse(stream, { headers });
    } catch (driveError) {
      console.error('Google Drive stream error:', driveError);
      return new NextResponse('Image not found or inaccessible', { status: 404 });
    }

  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}