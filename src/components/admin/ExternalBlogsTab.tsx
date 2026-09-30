"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Blog } from "@/lib/blog-service";
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { readApiError } from "./ConfigFallbackNotice";

interface ExternalBlogsTabProps {
  initialBlogs: Blog[];
}

export function ExternalBlogsTab({ initialBlogs }: ExternalBlogsTabProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  useEffect(() => setBlogs(initialBlogs), [initialBlogs]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setEditingBlog(null);
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setDescription(blog.description);
    setUrl(blog.url);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        editingBlog ? `/api/blogs?id=${editingBlog.id}` : "/api/blogs",
        {
          method: editingBlog ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, url }),
        },
      );

      if (!res.ok) {
        throw new Error(await readApiError(res, "Failed to save blog"));
      }

      const saved: Blog = await res.json();
      if (editingBlog) {
        setBlogs((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
        toast.success("External blog updated");
      } else {
        setBlogs((prev) => [saved, ...prev]);
        toast.success("External blog added successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(await readApiError(res, "Failed to delete blog"));
      }

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">External Blogs</h2>
          <p className="text-muted-foreground">
            Links to posts published elsewhere, listed on /blog.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add External Blog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit External Blog" : "Add New External Blog"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ext-title">Title</Label>
                <Input
                  id="ext-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Blog Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ext-description">
                  Starting Text / Description
                </Label>
                <Textarea
                  id="ext-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description or starting text..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ext-url">External URL</Label>
                <Input
                  id="ext-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://medium.com/..."
                  type="url"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingBlog
                    ? "Update Blog"
                    : "Add Blog"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardContent className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <h3 className="text-lg font-medium">{blog.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {blog.description}
                </p>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center text-xs break-all text-blue-500 hover:underline"
                >
                  {blog.url} <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
                </a>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${blog.title}`}
                  onClick={() => openEditDialog(blog)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${blog.title}`}
                  onClick={() => handleDeleteBlog(blog.id)}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {blogs.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">
            No external blogs found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
