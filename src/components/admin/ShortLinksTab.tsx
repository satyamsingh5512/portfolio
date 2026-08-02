"use client";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ShortLinkData } from "@/lib/short-links";
import {
  BarChart3,
  Check,
  Copy,
  Edit,
  ExternalLink,
  Link2,
  MousePointerClick,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface ShortLinksTabProps {
  links: ShortLinkData[];
  onLinksChange: (next: ShortLinkData[]) => void;
  /** Base URL used to build the copyable short link, e.g. https://satym.in */
  siteUrl: string;
}

function toDateInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function ShortLinksTab({
  links,
  onLinksChange,
  siteUrl,
}: ShortLinksTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLinkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const origin = useMemo(() => siteUrl.replace(/\/$/, ""), [siteUrl]);
  const shortDisplay = useMemo(
    () => origin.replace(/^https?:\/\//, ""),
    [origin],
  );

  const totals = useMemo(
    () =>
      links.reduce(
        (acc, link) => ({
          views: acc.views + link.views,
          clicks: acc.clicks + link.clicks,
        }),
        { views: 0, clicks: 0 },
      ),
    [links],
  );

  const resetForm = useCallback(() => {
    setUrl("");
    setCode("");
    setTitle("");
    setDescription("");
    setTagsInput("");
    setIsActive(true);
    setExpiresAt("");
    setEditingLink(null);
  }, []);

  const openEditDialog = useCallback((link: ShortLinkData) => {
    setEditingLink(link);
    setUrl(link.url);
    setCode(link.code);
    setTitle(link.title ?? "");
    setDescription(link.description ?? "");
    setTagsInput(link.tags.join(", "));
    setIsActive(link.isActive);
    setExpiresAt(toDateInput(link.expiresAt));
    setIsDialogOpen(true);
  }, []);

  const handleCopy = useCallback(
    async (linkCode: string) => {
      try {
        await navigator.clipboard.writeText(`${origin}/${linkCode}`);
        setCopiedCode(linkCode);
        toast.success("Short link copied");
        setTimeout(() => setCopiedCode(null), 1500);
      } catch {
        toast.error("Could not copy to clipboard");
      }
    },
    [origin],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      url,
      code: code.trim() || undefined,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isActive,
      expiresAt: expiresAt || undefined,
    };

    try {
      const endpoint = editingLink
        ? `/api/admin/short-links?id=${editingLink.id}`
        : "/api/admin/short-links";

      const res = await fetch(endpoint, {
        method: editingLink ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save short link");
      }

      const saved: ShortLinkData = await res.json();

      if (editingLink) {
        onLinksChange(links.map((l) => (l.id === editingLink.id ? saved : l)));
        toast.success("Short link updated");
      } else {
        onLinksChange([saved, ...links]);
        toast.success(`Short link created — ${shortDisplay}/${saved.code}`);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(
    async (link: ShortLinkData) => {
      if (!confirm(`Delete /${link.code}? Existing shares will stop working.`))
        return;

      try {
        const res = await fetch(`/api/admin/short-links?id=${link.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        onLinksChange(links.filter((l) => l.id !== link.id));
        toast.success("Short link deleted");
      } catch {
        toast.error("Failed to delete short link");
      }
    },
    [links, onLinksChange],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">URL Shortener</h2>
          <p className="text-muted-foreground">
            Share <span className="font-mono">{shortDisplay}/abcd</span> links —
            every click lands on your portfolio first.
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
              New Short Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Edit Short Link" : "Create Short Link"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {editingLink?.kind === "blog" ? (
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input readOnly value={url} className="font-mono text-sm" />
                  <p className="text-muted-foreground text-xs">
                    This code points at one of your blog posts, so its
                    destination follows the post.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="sl-url">Destination URL *</Label>
                  <Input
                    id="sl-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/a/very/long/link"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sl-code">Custom code (optional)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground shrink-0 font-mono text-sm">
                    {shortDisplay}/
                  </span>
                  <Input
                    id="sl-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="auto"
                    maxLength={5}
                    pattern="[0-9a-zA-Z]{4,5}"
                    title="4–5 letters or digits"
                    className="font-mono"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  4–5 letters or digits. Leave blank to auto-generate.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sl-title">Title (shown on the link page)</Label>
                <Input
                  id="sl-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My talk at JSConf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sl-description">Description</Label>
                <Textarea
                  id="sl-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short context for whoever opens this link"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sl-tags">Tags (comma separated)</Label>
                <Input
                  id="sl-tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="twitter, resume"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sl-expires">Expires on (optional)</Label>
                <Input
                  id="sl-expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="sl-active">Active</Label>
                  <p className="text-muted-foreground text-xs">
                    Inactive links show a 404.
                  </p>
                </div>
                <Switch
                  id="sl-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Saving..."
                  : editingLink
                    ? "Update Short Link"
                    : "Create Short Link"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Link2 className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">Links</p>
              <p className="text-2xl font-bold">{links.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <BarChart3 className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">
                Portfolio visits driven
              </p>
              <p className="text-2xl font-bold">
                {totals.views.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <MousePointerClick className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-muted-foreground text-xs">Clicks through</p>
              <p className="text-2xl font-bold">
                {totals.clicks.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-semibold">
                    {shortDisplay}/{link.code}
                  </code>
                  <Badge variant={link.isActive ? "default" : "secondary"}>
                    {link.isActive ? "Active" : "Disabled"}
                  </Badge>
                  {link.kind === "blog" && (
                    <Badge variant="outline">Blog</Badge>
                  )}
                  {link.expiresAt &&
                    new Date(link.expiresAt).getTime() < Date.now() && (
                      <Badge variant="outline">Expired</Badge>
                    )}
                </div>
                {link.title && (
                  <p className="truncate text-sm font-medium">{link.title}</p>
                )}
                <p className="text-muted-foreground truncate text-xs">
                  → {link.url}
                </p>
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                  {link.kind === "blog" ? (
                    <span>{link.views.toLocaleString()} opens</span>
                  ) : (
                    <>
                      <span>{link.views.toLocaleString()} page views</span>
                      <span>{link.clicks.toLocaleString()} clicks through</span>
                    </>
                  )}
                  {link.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(link.code)}
                  title="Copy short link"
                >
                  {copiedCode === link.code ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  title="Open link page"
                >
                  <a
                    href={`${origin}/${link.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(link)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(link)}
                  title="Delete"
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {links.length === 0 && (
          <div className="text-muted-foreground py-10 text-center">
            No short links yet. Create one to start routing traffic through your
            portfolio.
          </div>
        )}
      </div>
    </div>
  );
}
