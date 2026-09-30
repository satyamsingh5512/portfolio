"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/** Reads `{ error }` from a failed API response, falling back to `fallback`. */
export async function readApiError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.json();
    if (body && typeof body.error === "string") return body.error;
  } catch {
    // Non-JSON body.
  }
  return `${fallback} (HTTP ${res.status})`;
}

interface ConfigFallbackNoticeProps {
  collection: "experiences" | "achievements" | "projects";
  label: string;
}

/**
 * Shown in an admin tab whose collection is empty and has never been edited:
 * the public site is then rendering the built-in entries from src/config,
 * which are invisible here. Importing them makes them editable.
 */
export function ConfigFallbackNotice({
  collection,
  label,
}: ConfigFallbackNoticeProps) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/admin/import-defaults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection }),
      });
      if (!res.ok) throw new Error(await readApiError(res, "Import failed"));
      const { imported } = await res.json();
      toast.success(`Imported ${imported} ${label}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          The public site is currently showing the built-in {label} from{" "}
          <code className="text-xs">src/config</code>. Import them to edit or
          delete them here. Adding a new entry also replaces the built-in list.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImport}
          disabled={importing}
          className="shrink-0"
        >
          {importing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Import built-in {label}
        </Button>
      </CardContent>
    </Card>
  );
}
