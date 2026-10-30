'use client';

import { useRef, useState } from 'react';

import { ImagePlus, Loader2, Star, X } from 'lucide-react';

import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

import { processImage, usePhotoUrl } from '../../photos';
import { Photo } from '../../types';

export interface PhotoItem {
  id: string;
  /** 새로 고른 사진이면 저장 전까지 여기에 들고 있는다 */
  pending?: Photo & { url: string };
}

interface PhotoPickerProps {
  items: PhotoItem[];
  coverId?: string;
  onChange: (items: PhotoItem[]) => void;
  onCoverChange: (id: string) => void;
  max?: number;
}

function Tile({
  item,
  isCover,
  onRemove,
  onCover,
}: {
  item: PhotoItem;
  isCover: boolean;
  onRemove: () => void;
  onCover: () => void;
}) {
  const stored = usePhotoUrl(item.pending ? undefined : item.id);
  const url = item.pending?.url ?? stored;

  return (
    <div className="group bg-muted relative aspect-square overflow-hidden rounded-xl">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-full w-full object-cover" />
      )}
      <div
        className={cn(
          'absolute inset-0 transition-colors',
          isCover && 'ring-primary rounded-xl ring-3 ring-inset'
        )}
      />
      <button
        type="button"
        onClick={onCover}
        className={cn(
          'absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold backdrop-blur transition-opacity',
          isCover
            ? 'bg-primary text-primary-foreground'
            : 'bg-black/45 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100'
        )}
      >
        <Star className={cn('size-3', isCover && 'fill-current')} />
        {isCover ? '대표' : '대표로'}
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="사진 빼기"
        className="absolute top-1.5 right-1.5 rounded-full bg-black/50 p-1 text-white backdrop-blur hover:bg-black/70"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export default function PhotoPicker({
  items,
  coverId,
  onChange,
  onCoverChange,
  max = 20,
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();
  const left = max - items.length;

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (images.length > left) toast(`사진은 최대 ${max}장까지 넣을 수 있어요`, 'error');
    const picked = images.slice(0, Math.max(0, left));
    if (!picked.length) return;

    setBusy(true);
    try {
      const processed = await Promise.all(picked.map(processImage));
      const next = [
        ...items,
        ...processed.map((p) => ({
          id: p.id,
          pending: { ...p, url: URL.createObjectURL(p.blob) },
        })),
      ];
      onChange(next);
      if (!coverId && next[0]) onCoverChange(next[0].id);
    } catch {
      toast('일부 사진을 불러오지 못했어요', 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.pending) URL.revokeObjectURL(item.pending.url);
    const next = items.filter((i) => i.id !== id);
    onChange(next);
    if (coverId === id && next[0]) onCoverChange(next[0].id);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
      className={cn('rounded-2xl transition-colors', dragging && 'bg-primary-soft/60')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <Tile
            key={item.id}
            item={item}
            isCover={item.id === coverId}
            onRemove={() => remove(item.id)}
            onCover={() => onCoverChange(item.id)}
          />
        ))}
        {left > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={cn(
              'text-muted-foreground hover:border-primary hover:text-primary flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors',
              items.length === 0 && 'col-span-3 aspect-auto py-10 sm:col-span-4'
            )}
          >
            {busy ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            <span className="text-xs font-medium">
              {busy
                ? '사진 정리 중…'
                : items.length === 0
                  ? '사진을 고르거나 여기로 끌어다 놓으세요'
                  : '추가'}
            </span>
            {items.length === 0 && (
              <span className="text-[11px] opacity-70">
                최대 {max}장 · 자동으로 용량을 줄여 저장해요
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
