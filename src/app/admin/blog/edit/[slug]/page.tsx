import { BlogEditor } from '@/components/admin/BlogEditor';
import { authOptions } from '@/lib/auth';
import { getBlogPostBySlug } from '@/lib/blog';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

interface EditBlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }
  
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  return <BlogEditor mode="edit" post={post} />;
}
