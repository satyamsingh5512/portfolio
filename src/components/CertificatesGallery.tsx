"use client";

import { canOptimizeImage } from "@/lib/image";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export interface Certificate {
  file: string;
  title: string;
  issuer: string;
  date: string;
}

const CertificateCard = React.memo(
  ({ cert, onOpen }: { cert: Certificate; onOpen: (file: string) => void }) => {
    const handleClick = useCallback(
      () => onOpen(cert.file),
      [cert.file, onOpen],
    );

    return (
      <div className="cursor-pointer" onClick={handleClick}>
        <div className="bg-muted/20 relative h-56 w-full overflow-hidden rounded">
          <Image
            src={cert.file}
            alt={cert.title || "certificate"}
            unoptimized={!canOptimizeImage(cert.file)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain"
            loading="lazy"
          />
        </div>
        <div className="mt-3">
          <h2 className="text-sm font-semibold">{cert.title}</h2>
          <p className="text-muted-foreground text-xs">
            {cert.issuer} • {cert.date}
          </p>
        </div>
      </div>
    );
  },
);

CertificateCard.displayName = "CertificateCard";

export default function CertificatesGallery({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const handleOpen = useCallback((file: string) => setActive(file), []);
  const handleClose = useCallback(() => setActive(null), []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {certificates.map((cert, index) => (
          <CertificateCard
            key={`${cert.file}-${index}`}
            cert={cert}
            onOpen={handleOpen}
          />
        ))}
        {certificates.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center text-sm">
            No certificates yet.
          </p>
        )}
      </div>

      {/* Fullscreen viewer */}
      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="!max-h-[90vh] !max-w-[90vw] rounded-none bg-transparent p-0 shadow-none">
          {/* Accessible title required by Radix Dialog (hidden visually) */}
          <DialogTitle className="sr-only">Certificate viewer</DialogTitle>
          <div className="flex h-[80vh] w-full items-center justify-center">
            {active && (
              <div className="relative h-full w-full">
                <Image
                  src={active}
                  alt="certificate"
                  unoptimized={!canOptimizeImage(active)}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
