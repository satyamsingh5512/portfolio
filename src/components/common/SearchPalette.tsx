"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SearchPaletteDialog = dynamic(
  () => import("@/components/common/SearchPaletteDialog"),
  { ssr: false },
);

/**
 * Only the keyboard shortcut listener ships with the initial bundle; the
 * command palette itself (cmdk + dialog) is fetched the first time it is
 * opened.
 */
export function SearchPalette() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMounted(true);
        setOpen((previous) => !previous);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!mounted) return null;

  return <SearchPaletteDialog open={open} onOpenChange={setOpen} />;
}

export default SearchPalette;
