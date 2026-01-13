'use client';

import Container from '@/components/common/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BlogPostPreview } from '@/types/blog';
import { Edit, Eye, FileText, LogOut, Plus, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import React from 'react';

interface AdminDashboardProps {
  posts: BlogPostPreview[];
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const PostCard = React.memo(({ 
  post, 
  onDelete, 
  isDeleting 
}: { 
  post: BlogPostPreview; 
  onDelete: (slug: string) => void; 
  isDeleting: boolean;
}) => {
  const handleDelete = useCallback(() => onDelete(post.slug), [onDelete, post.slug]);
  
  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">
              {post.frontmatter.title}
            </h3>
            <Badge
              variant={
                post.frontmatter.isPublished
                  ? 'default'
                  : 'secondary'
              }
            >
              {post.frontmatter.isPublished ? 'Published' : 'Draft'}
            </Badge>
            {post.frontmatter.isFeatured && (
              <Badge variant="outline">Featured</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {post.frontmatter.description}
          </p>
          <div className="flex gap-2 mt-2">
            {post.frontmatter.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/blog/edit/${post.slug}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = 'PostCard';

export function AdminDashboard({ posts, user }: AdminDashboardProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { publishedPosts, draftPosts } = useMemo(() => ({
    publishedPosts: posts.filter((p) => p.frontmatter.isPublished),
    draftPosts: posts.filter((p) => !p.frontmatter.isPublished),
  }), [posts]);

  const handleDelete = useCallback(async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted successfully');
        router.refresh();
      } else {
        toast.error('Failed to delete post');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingSlug(null);
    }
  }, [router]);

  return (
    <Container className="py-10 sm:py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog Admin</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/blog/advanced">
                <FileText className="mr-2 h-4 w-4" />
                Advanced Editor
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Posts</CardDescription>
              <CardTitle className="text-3xl">{posts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {publishedPosts.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">
                {draftPosts.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Posts</h2>
          {posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Button asChild>
                  <Link href="/admin/blog/new">Create your first post</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard 
                  key={post.slug} 
                  post={post} 
                  onDelete={handleDelete}
                  isDeleting={deletingSlug === post.slug}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
