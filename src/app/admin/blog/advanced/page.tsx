import { AdvancedBlogEditor } from '@/components/admin/AdvancedBlogEditor';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdvancedBlogPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login');
  }
  
  return <AdvancedBlogEditor mode="create" />;
}
