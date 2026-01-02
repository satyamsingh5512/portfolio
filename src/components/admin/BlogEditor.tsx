'use client';

import Container from '@/components/common/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BlogFormData, BlogPost } from '@/types/blog';
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface BlogEditorProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

export function BlogEditor({ post, mode }: BlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metaFileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: post?.frontmatter.title || '',
    description: post?.frontmatter.description || '',
    content: post?.content || '',
    tags: post?.frontmatter.tags || [],
    image: post?.frontmatter.image || '',
    metaImage: post?.frontmatter.metaImage || '',
    isPublished: post?.frontmatter.isPublished ?? false,
    isFeatured: post?.frontmatter.isFeatured ?? false,
    customSlug: post?.slug || '',
    author: post?.frontmatter.author || {
      name: '',
      email: '',
      bio: '',
      social: {
        instagram: '',
        twitter: '',
        github: '',
        linkedin: '',
        website: '',
      },
    },
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: { ...prev.author, [name]: value },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        social: { ...prev.author.social, [name]: value },
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.toLowerCase()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'metaImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', type === 'metaImage' ? 'meta' : 'blog');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, [type]: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload a cover image');
      return;
    }

    setIsLoading(true);
    try {
      const url = mode === 'create' ? '/api/blog' : `/api/blog/${post?.slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save post');
      }

      toast.success(
        mode === 'create'
          ? 'Post created successfully'
          : 'Post updated successfully'
      );
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save post'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-10 sm:py-16">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {mode === 'create' ? 'Create Post' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the post"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customSlug">Custom Slug (optional)</Label>
                  <Input
                    id="customSlug"
                    name="customSlug"
                    value={formData.customSlug}
                    onChange={handleChange}
                    placeholder="custom-url-slug"
                    disabled={mode === 'edit'}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to auto-generate from title
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (MDX) *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog content in MDX format..."
                    rows={20}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown and MDX components. Use ## for headings,
                    **bold**, *italic*, [links](url), ![images](url), etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle>Author Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.author.name}
                      onChange={handleAuthorChange}
                      placeholder="Author name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.author.email}
                      onChange={handleAuthorChange}
                      placeholder="author@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.author.bio || ''}
                    onChange={handleAuthorChange}
                    placeholder="Short author bio"
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-xs">
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.author.social?.instagram || ''}
                        onChange={handleSocialChange}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-xs">
                        Twitter/X
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.author.social?.twitter || ''}
                        onChange={handleSocialChange}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-xs">
                        GitHub
                      </Label>
                      <Input
                        id="github"
                        name="github"
                        value={formData.author.social?.github || ''}
                        onChange={handleSocialChange}
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-xs">
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.author.social?.linkedin || ''}
                        onChange={handleSocialChange}
                        placeholder="username"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="website" className="text-xs">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.author.social?.website || ''}
                        onChange={handleSocialChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublished">Published</Label>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isPublished: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.image}
                      alt="Cover"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: '' }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  disabled={isUploading}
                />
                <Input
                  placeholder="Or paste image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </CardContent>
            </Card>

            {/* Meta Image */}
            <Card>
              <CardHeader>
                <CardTitle>Meta Image (OG)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.metaImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.metaImage}
                      alt="Meta"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, metaImage: '' }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => metaFileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload
                    </p>
                  </div>
                )}
                <input
                  ref={metaFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'metaImage')}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  Used for social sharing. Falls back to cover image if not set.
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" size="icon" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Container>
  );
}
