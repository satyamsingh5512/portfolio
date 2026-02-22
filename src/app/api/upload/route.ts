import { authOptions } from '@/lib/auth';
import { type CloudinaryFolder, uploadToCloudinary } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const FOLDER_MAP: Record<string, CloudinaryFolder> = {
  blog: 'portfolio/blog',
  meta: 'portfolio/meta',
  projects: 'portfolio/projects',
  achievements: 'portfolio/achievements',
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderKey = (formData.get('folder') as string) || 'blog';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB.' },
        { status: 400 },
      );
    }

    const folder: CloudinaryFolder = FOLDER_MAP[folderKey] ?? 'portfolio/blog';
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToCloudinary(buffer, folder, file.type);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
