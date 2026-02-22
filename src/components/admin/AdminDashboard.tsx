"use client";

import Container from "@/components/common/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blog } from "@/lib/blog-service";
import type { ProjectRecord, SiteSettings } from "@/lib/supabase";
import { Edit, Eye, FileText, LogOut, Plus, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import React from "react";
import { toast } from "sonner";

import { AchievementData, AchievementsTab } from "./AchievementsTab";
import { ExperienceData, ExperiencesTab } from "./ExperiencesTab";
import { ExternalBlogsTab } from "./ExternalBlogsTab";
import { ProjectsTab } from "./ProjectsTab";
import { SiteSettingsTab } from "./SiteSettingsTab";

// ─── Admin blog post type (flat — from MongoDB, no frontmatter wrapper) ────────
export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  readingTime?: number;
  createdAt: string;
}

interface AdminDashboardProps {
  posts: AdminBlogPost[];
  externalBlogs: Blog[];
  projects: ProjectRecord[];
  achievements: AchievementData[];
  experiences: ExperienceData[];
  siteSettings: SiteSettings;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const PostCard = React.memo(
  ({
    post,
    onDelete,
    isDeleting,
  }: {
    post: AdminBlogPost;
    onDelete: (slug: string) => void;
    isDeleting: boolean;
  }) => {
    const handleDelete = useCallback(
      () => onDelete(post.slug),
      [onDelete, post.slug],
    );

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
      <Card>
        <CardContent className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-medium">{post.title}</h3>
              <Badge variant={post.isPublished ? "default" : "secondary"}>
                {post.isPublished ? "Published" : "Draft"}
              </Badge>
              {post.isFeatured && <Badge variant="outline">Featured</Badge>}
            </div>
            <p className="text-muted-foreground truncate text-sm">
              {post.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(post.tags ?? []).slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              <span className="text-muted-foreground text-xs">{formattedDate}</span>
              {post.readingTime !== undefined && (
                <span className="text-muted-foreground text-xs">{post.readingTime} min read</span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
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
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

PostCard.displayName = "PostCard";

export function AdminDashboard({
  posts,
  externalBlogs,
  projects,
  achievements,
  experiences,
  siteSettings,
  user,
}: AdminDashboardProps) {
  const router = useRouter();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { publishedPosts, draftPosts } = useMemo(
    () => ({
      publishedPosts: posts.filter((p) => p.isPublished),
      draftPosts: posts.filter((p) => !p.isPublished),
    }),
    [posts],
  );

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      setDeletingSlug(slug);
      try {
        const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Post deleted successfully");
          router.refresh();
        } else {
          toast.error("Failed to delete post");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setDeletingSlug(null);
      }
    },
    [router],
  );

  return (
    <Container className="py-10 sm:py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="h-auto flex-wrap gap-1">
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
            <TabsTrigger value="external">External Blogs</TabsTrigger>
            <TabsTrigger value="local">Local Blogs</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SiteSettingsTab initialSettings={siteSettings} />
          </TabsContent>

          <TabsContent value="external">
            <ExternalBlogsTab initialBlogs={externalBlogs} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab initialProjects={projects} />
          </TabsContent>

          <TabsContent value="experiences">
            <ExperiencesTab initialExperiences={experiences} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab initialAchievements={achievements} />
          </TabsContent>

          <TabsContent value="local" className="space-y-8">
            {/* MongoDB Blog Management */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/admin/blog/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
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
                    <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                    <p className="text-muted-foreground mb-4">
                      No blog posts yet
                    </p>
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
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
