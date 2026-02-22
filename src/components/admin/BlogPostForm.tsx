"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  BookOpen,
  Image as ImageIcon,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { RichBlogEditorPayload } from "./RichBlogEditor";

// Dynamic import — no SSR for TipTap
const RichBlogEditor = dynamic(
  () => import("./RichBlogEditor").then((m) => m.RichBlogEditor),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

function EditorSkeleton() {
  return (
    <div className="min-h-[540px] animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
  );
}

// ─── Slugify helper ───────────────────────────────────────────────────────────
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─── Types ─────────────────────────────────────────────────────────────────--
export interface BlogPostFormPayload {
  title: string;
  slug: string;
  description: string;
  content: Record<string, unknown>; // TipTap JSON
  contentHTML: string;
  image: string;
  metaImage: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  readingTime: number;
  author: { name: string; email: string };
}

interface BlogPostFormProps {
  /** If provided, the form is in edit mode */
  initialData?: Partial<BlogPostFormPayload> & { slug?: string };
  authorName?: string;
  authorEmail?: string;
}

// ─── Image Upload Field ───────────────────────────────────────────────────────
function ImageField({
  label,
  value,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  folder: "blog" | "meta";
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
        const { url } = await res.json();
        onChange(url);
        toast.success("Image uploaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [folder, onChange],
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-white/10">
          <img src={value} alt={label} className="aspect-video w-full object-cover" />          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 opacity-0 transition group-hover:opacity-100"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      ) : (
        <div
          className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 transition hover:border-white/40 hover:bg-white/5"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          ) : (
            <>
              <ImageIcon className="mb-2 h-6 w-6 text-white/40" />
              <p className="text-xs text-white/40">Click to upload</p>
            </>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <Input
        placeholder="Or paste Cloudinary URL"
        value={value}
        className="text-xs"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export function BlogPostForm({ initialData, authorName = "", authorEmail = "" }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.slug);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [metaImage, setMetaImage] = useState(initialData?.metaImage ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [editorData, setEditorData] = useState<RichBlogEditorPayload>({
    json: (initialData?.content as Record<string, unknown>) ?? {},
    html: initialData?.contentHTML ?? "",
    text: "",
  });
  const [readingTime, setReadingTime] = useState(initialData?.readingTime ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);

  // Auto-slug from title unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  // Recalculate reading time when editor text changes
  const handleEditorChange = useCallback((data: RichBlogEditorPayload) => {
    setEditorData(data);
    const words = data.text.trim().split(/\s+/).filter(Boolean).length;
    setReadingTime(Math.max(1, Math.ceil(words / 200)));
  }, []);

  // Tags
  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }, [tagInput, tags]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  // Submit
  const submit = useCallback(
    async (publish: boolean) => {
      if (!title.trim() || !slug.trim()) {
        toast.error("Title and slug are required");
        return;
      }
      if (!image) {
        toast.error("Please add a cover image");
        return;
      }

      setIsSaving(true);
      const payload: BlogPostFormPayload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        content: editorData.json,
        contentHTML: editorData.html,
        image,
        metaImage,
        tags,
        isPublished: publish,
        isFeatured,
        readingTime,
        author: {
          name: authorName || "Admin",
          email: authorEmail,
        },
      };

      try {
        const url = isEdit ? `/api/blog/${initialData!.slug}` : "/api/blog";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to save post");
        }

        toast.success(
          isEdit
            ? "Post updated successfully"
            : publish
              ? "Post published!"
              : "Draft saved",
        );
        router.push("/admin");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save post");
      } finally {
        setIsSaving(false);
      }
    },
    [
      title,
      slug,
      description,
      editorData,
      image,
      metaImage,
      tags,
      isFeatured,
      readingTime,
      authorName,
      authorEmail,
      isEdit,
      initialData,
      router,
    ],
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? "Edit Post" : "New Post"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEdit ? `Editing /${slug}` : "Create a new blog post"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={() => submit(false)}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button disabled={isSaving} onClick={() => submit(true)}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* ── Left: Editor ─────────────────────────────────────── */}
        <RichBlogEditor
          initialContent={
            initialData?.content && Object.keys(initialData.content).length > 0
              ? (initialData.content as Record<string, unknown>)
              : undefined
          }
          onChange={handleEditorChange}
        />

        {/* ── Right: Metadata sidebar ───────────────────────────── */}
        <div className="space-y-4">
          {/* Title */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="bp-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bp-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bp-slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bp-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="post-slug"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-end justify-between">
                  <Label htmlFor="bp-desc">Description</Label>
                  <span className="text-muted-foreground text-xs">
                    {description.length}/160
                  </span>
                </div>
                <Textarea
                  id="bp-desc"
                  value={description}
                  maxLength={160}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for SEO and previews"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Add tag, press Enter"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer gap-1 pr-1"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageField
                label="Cover Image *"
                value={image}
                folder="blog"
                onChange={setImage}
              />
              <ImageField
                label="Meta / OG Image"
                value={metaImage}
                folder="meta"
                onChange={setMetaImage}
              />
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="bp-published" className="cursor-pointer">
                  Published
                </Label>
                <Switch
                  id="bp-published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bp-featured" className="cursor-pointer">
                  Featured
                </Label>
                <Switch
                  id="bp-featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" />
                  Reading time
                </span>
                <span className="text-sm font-medium">{readingTime} min read</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
