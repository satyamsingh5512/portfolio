import { authOptions } from '@/lib/auth';
import { getAllBlogPosts } from '@/lib/blog';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }
  
  const posts = getAllBlogPosts();
  
  return <AdminDashboard posts={posts} user={session.user} />;
}
