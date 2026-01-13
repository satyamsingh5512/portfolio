'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogFormData, BlogPost } from '@/types/blog';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  FileCode,
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Calculator,
  Upload,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import dynamic from 'next/dynamic';

// Dynamic imports for code editor
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
const { javascript } = require('@codemirror/lang-javascript');
const { python } = require('@codemirror/lang-python');
const { markdown } = require('@codemirror/lang-markdown');

interface AdvancedBlogEditorProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  title: string;
  description: string;
}

export function AdvancedBlogEditor({ post, mode }: AdvancedBlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metaFileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

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
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [latexCode, setLatexCode] = useState('');

  // Handle form changes with useCallback to prevent re-renders
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAuthorChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: { ...prev.author, [name]: value },
    }));
  }, []);

  const handleSocialChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        social: { ...prev.author.social, [name]: value },
      },
    }));
  }, []);

  // Tag management with useCallback
  const handleAddTag = useCallback(() => {
    if (newTag && !formData.tags.includes(newTag.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.toLowerCase()],
      }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  // Code snippet management with useCallback
  const addCodeSnippet = useCallback(() => {
    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      language: 'javascript',
      code: '',
      title: 'Code Snippet',
      description: '',
    };
    setCodeSnippets((prev) => [...prev, newSnippet]);
  }, []);

  const updateCodeSnippet = useCallback((id: string, field: keyof CodeSnippet, value: string) => {
    setCodeSnippets((prev) =>
      prev.map((snippet) =>
        snippet.id === id ? { ...snippet, [field]: value } : snippet
      )
    );
  }, []);

  const removeCodeSnippet = useCallback((id: string) => {
    setCodeSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
  }, []);

  const insertCodeSnippetIntoContent = useCallback((snippet: CodeSnippet) => {
    const snippetMDX = `
## ${snippet.title}

${snippet.description ? `${snippet.description}\n` : ''}
\`\`\`${snippet.language}
${snippet.code}
\`\`\`
`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + '\n' + snippetMDX,
    }));
    toast.success('Code snippet inserted into content');
  }, []);

  // LaTeX insertion with useCallback
  const insertLatex = useCallback(() => {
    if (!latexCode.trim()) {
      toast.error('Please enter LaTeX code');
      return;
    }
    const latexMDX = `\n$$\n${latexCode}\n$$\n`;
    setFormData((prev) => ({
      ...prev,
      content: prev.content + latexMDX,
    }));
    toast.success('LaTeX formula inserted');
    setLatexCode('');
  }, [latexCode]);

  // Image upload with useCallback
  const handleImageUpload = useCallback(async (
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
  }, []);

  // Submit form with useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [formData, mode, post?.slug, router]);

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
            <div>
              <h1 className="text-2xl font-bold">
                {mode === 'create' ? 'New Technical Blog Post' : 'Edit Blog Post'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced editor with code snippets and LaTeX support
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">
              <FileCode className="mr-2 h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="mr-2 h-4 w-4" />
              Code Snippets
            </TabsTrigger>
            <TabsTrigger value="latex">
              <Calculator className="mr-2 h-4 w-4" />
              LaTeX
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Main Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content (MDX) *</Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your blog content in MDX format..."
                        rows={25}
                        className="font-mono text-sm"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports Markdown, MDX, LaTeX ($$formula$$), and code blocks
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
                        <Input
                          name="github"
                          value={formData.author.social?.github || ''}
                          onChange={handleSocialChange}
                          placeholder="GitHub username"
                        />
                        <Input
                          name="twitter"
                          value={formData.author.social?.twitter || ''}
                          onChange={handleSocialChange}
                          placeholder="Twitter @username"
                        />
                        <Input
                          name="linkedin"
                          value={formData.author.social?.linkedin || ''}
                          onChange={handleSocialChange}
                          placeholder="LinkedIn username"
                        />
                        <Input
                          name="website"
                          value={formData.author.social?.website || ''}
                          onChange={handleSocialChange}
                          placeholder="https://website.com"
                        />
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
          </TabsContent>

          {/* Code Snippets Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Snippets Manager</CardTitle>
                  <Button type="button" onClick={addCodeSnippet}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Snippet
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {codeSnippets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No code snippets yet. Click "Add Snippet" to create one.</p>
                  </div>
                ) : (
                  codeSnippets.map((snippet) => (
                    <Card key={snippet.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Snippet title"
                            value={snippet.title}
                            onChange={(e) =>
                              updateCodeSnippet(snippet.id, 'title', e.target.value)
                            }
                            className="flex-1 mr-4"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => insertCodeSnippetIntoContent(snippet)}
                            >
                              Insert
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeCodeSnippet(snippet.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          placeholder="Description (optional)"
                          value={snippet.description}
                          onChange={(e) =>
                            updateCodeSnippet(snippet.id, 'description', e.target.value)
                          }
                        />
                        <select
                          value={snippet.language}
                          onChange={(e) =>
                            updateCodeSnippet(snippet.id, 'language', e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="csharp">C#</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="php">PHP</option>
                          <option value="ruby">Ruby</option>
                          <option value="bash">Bash</option>
                          <option value="sql">SQL</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="json">JSON</option>
                          <option value="yaml">YAML</option>
                        </select>
                        <Textarea
                          placeholder="Enter your code here..."
                          value={snippet.code}
                          onChange={(e) =>
                            updateCodeSnippet(snippet.id, 'code', e.target.value)
                          }
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LaTeX Tab */}
          <TabsContent value="latex" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>LaTeX Formula Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>LaTeX Code</Label>
                  <Textarea
                    placeholder="Enter LaTeX formula (e.g., E = mc^2)"
                    value={latexCode}
                    onChange={(e) => setLatexCode(e.target.value)}
                    rows={8}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: x = \frac{"{-b \\pm \\sqrt{b^2-4ac}}"}{"{2a}"}
                  </p>
                </div>
                <Button type="button" onClick={insertLatex} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Insert LaTeX into Content
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label>Common LaTeX Examples</Label>
                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLatexCode('E = mc^2')}
                    >
                      Einstein's Equation
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLatexCode('x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}')
                      }
                    >
                      Quadratic Formula
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLatexCode('\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}')}
                    >
                      Summation
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLatexCode('\\int_{a}^{b} f(x) dx')}
                    >
                      Integral
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h1>{formData.title || 'Untitled Post'}</h1>
                  <p className="text-muted-foreground">
                    {formData.description || 'No description'}
                  </p>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Cover"
                      className="rounded-lg w-full"
                    />
                  )}
                  <div className="whitespace-pre-wrap">{formData.content}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Container>
  );
}
