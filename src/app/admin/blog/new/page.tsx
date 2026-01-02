import { BlogEditor } from '@/components/admin/BlogEditor';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }
  
  return <BlogEditor mode="create" />;
}
