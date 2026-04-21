'use client';

import Image from 'next/image';
import { Expand } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface EvidenceImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function EvidenceImage({ src, alt, className }: EvidenceImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            'group relative w-full overflow-hidden rounded-lg border border-border bg-card text-left',
            'transition-all hover:border-primary/35 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
            className,
          )}
          aria-label={`Open evidence screenshot: ${alt}`}
        >
          <div className="relative aspect-[16/10] sm:aspect-video w-full">
            <Image src={src} alt={alt} fill className="object-contain bg-muted/10" />
          </div>
          <div className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand className="h-3.5 w-3.5" />
            Open
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="h-[94vh] w-[98vw] max-w-[98vw] sm:h-[94vh] sm:max-w-[94vw] p-2 sm:p-3 border-border/70 bg-background/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          Full-size testing evidence screenshot.
        </DialogDescription>
        <div className="flex h-full w-full items-center justify-center overflow-auto rounded-lg border border-border/70 bg-muted/15">
          <Image
            src={src}
            alt={alt}
            width={2200}
            height={1400}
            className="h-auto w-auto max-h-full max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
