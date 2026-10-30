'use client';

import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { usePhotoUrl } from '../photos';

function Thumb({
  id,
  onClick,
  className,
}: {
  id: string;
  onClick: () => void;
  className?: string;
}) {
  const url = usePhotoUrl(id);
  return (
    <button
      onClick={onClick}
      className={cn('bg-muted group relative overflow-hidden rounded-xl', className)}
      aria-label="사진 크게 보기"
    >
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </button>
  );
}

function FullPhoto({ id }: { id: string }) {
  const url = usePhotoUrl(id);
  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="max-h-[80dvh] w-full rounded-lg object-contain" />;
}

export default function PhotoGallery({ photoIds }: { photoIds: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const move = (d: number) =>
    setIndex((i) => (i === null ? i : (i + d + photoIds.length) % photoIds.length));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photoIds.map((id, i) => (
          <Thumb
            key={id}
            id={id}
            onClick={() => setIndex(i)}
            className={cn(
              'aspect-square',
              i === 0 && photoIds.length > 2 && 'col-span-2 row-span-2'
            )}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent
          className="max-w-5xl border-0 bg-transparent p-0 shadow-none"
          hideClose={false}
        >
          <DialogTitle className="sr-only">사진 보기</DialogTitle>
          {index !== null && photoIds[index] && <FullPhoto id={photoIds[index]} />}
          {photoIds.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-3 text-white">
              <button
                onClick={() => move(-1)}
                className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25"
                aria-label="이전 사진"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="tabular text-subheadline min-w-12 text-center">
                {(index ?? 0) + 1} / {photoIds.length}
              </span>
              <button
                onClick={() => move(1)}
                className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25"
                aria-label="다음 사진"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
