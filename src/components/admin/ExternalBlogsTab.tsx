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
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExternalBlogsTabProps {
  initialBlogs: Blog[];
}

export function ExternalBlogsTab({ initialBlogs }: ExternalBlogsTabProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New Blog Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url }),
      });

      if (!res.ok) throw new Error("Failed to add blog");

      const newBlog = await res.json();
      setBlogs([newBlog, ...blogs]);
      setIsDialogOpen(false);
      resetForm();
      toast.success("External blog added successfully");
    } catch {
      toast.error("Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setBlogs(blogs.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">External Blogs</h2>
          <p className="text-muted-foreground">
            Manage your manually linked blogs here.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add External Blog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New External Blog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBlog} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Blog Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Starting Text / Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description or starting text..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">External URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://medium.com/..."
                  type="url"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Blog"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardContent className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-medium">{blog.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {blog.description}
                </p>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center text-xs text-blue-500 hover:underline"
                >
                  {blog.url} <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteBlog(blog.id)}
                className="shrink-0"
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </Button>
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
