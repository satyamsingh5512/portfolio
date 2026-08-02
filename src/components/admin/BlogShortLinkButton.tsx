"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ShortLinkData } from "@/lib/short-links";
import { Check, Copy, Link2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface BlogShortLinkButtonProps {
  slug: string;
  /** Base URL used to build the copyable link, e.g. https://satym.in */
  siteUrl: string;
  /** Existing code for this post, if one has already been minted. */
  code?: string;
  onCreated: (link: ShortLinkData) => void;
}

/**
 * "Get short link" for a blog post — mirrors the Google Forms flow: one click
 * mints (or reuses) a code, then shows it in a dialog ready to copy.
 */
export function BlogShortLinkButton({
  slug,
  siteUrl,
  code,
  onCreated,
}: BlogShortLinkButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolvedCode, setResolvedCode] = useState<string | undefined>(code);
  const [copied, setCopied] = useState(false);

  const origin = siteUrl.replace(/\/$/, "");
  const shortUrl = resolvedCode ? `${origin}/${resolvedCode}` : "";

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return true;
    } catch {
      toast.error("Could not copy — select the link and copy manually");
      return false;
    }
  }, []);

  const handleClick = useCallback(async () => {
    if (resolvedCode) {
      setOpen(true);
      void copy(`${origin}/${resolvedCode}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/short-links/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create short link");
      }

      const link: ShortLinkData = await res.json();
      setResolvedCode(link.code);
      onCreated(link);
      setOpen(true);
      void copy(`${origin}/${link.code}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to shorten");
    } finally {
      setLoading(false);
    }
  }, [copy, onCreated, origin, resolvedCode, slug]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={loading}
        title={resolvedCode ? "Copy short link" : "Get short link"}
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Short link</DialogTitle>
            <DialogDescription>
              Copied to your clipboard. It redirects straight to the post and
              counts every visit.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={shortUrl} className="font-mono text-sm" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => copy(shortUrl)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
