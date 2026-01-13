'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { certificates } from '@/config/Achievements';

const CertificateCard = React.memo(({ cert, onOpen }: { cert: typeof certificates[0]; onOpen: (file: string) => void }) => {
  const handleClick = useCallback(() => onOpen(cert.file), [cert.file, onOpen]);
  
  return (
    <div className="cursor-pointer" onClick={handleClick}>
      <div className="relative w-full h-56 bg-muted/20 rounded overflow-hidden">
        <Image 
          src={cert.file} 
          alt={cert.title || 'certificate'} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw" 
          className="object-contain"
          loading="lazy"
        />
      </div>
      <div className="mt-3">
        <h4 className="text-sm font-semibold">{cert.title}</h4>
        <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.date}</p>
      </div>
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';

export default function CertificatesGallery() {
  const [active, setActive] = useState<string | null>(null);
  
  const handleOpen = useCallback((file: string) => setActive(file), []);
  const handleClose = useCallback(() => setActive(null), []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <CertificateCard key={cert.file} cert={cert} onOpen={handleOpen} />
        ))}
      </div>

      {/* Fullscreen viewer */}
      <Dialog open={!!active} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="!max-w-[90vw] !max-h-[90vh] p-0 bg-transparent shadow-none rounded-none">
          {/* Accessible title required by Radix Dialog (hidden visually) */}
          <DialogTitle className="sr-only">Certificate viewer</DialogTitle>
          <div className="w-full h-[80vh] flex items-center justify-center">
            {active && (
              <div className="relative w-full h-full">
                <Image src={active} alt="certificate" fill sizes="100vw" className="object-contain" priority />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}