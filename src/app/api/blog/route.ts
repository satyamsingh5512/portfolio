import { authOptions } from '@/lib/auth';
import { createBlogPost } from '@/lib/blog-api';
import { getAllBlogPosts } from '@/lib/blog';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// GET all blog posts (for admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const posts = getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Set author from session if not provided
    if (!data.author) {
      data.author = {
        name: session.user.name || 'Admin',
        email: session.user.email || '',
      };
    }
    
    const post = await createBlogPost(data);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    const message = error instanceof Error ? error.message : 'Failed to create blog post';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
