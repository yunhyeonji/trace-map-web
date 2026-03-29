'use client';

import React, { useCallback, useState } from 'react';

import { Upload, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: ImageFile[] = [];
      const remainingSlots = maxImages - images.length;

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach((file) => {
          if (file.type.startsWith('image/')) {
            const id = `${Date.now()}-${Math.random()}`;
            const preview = URL.createObjectURL(file);
            newImages.push({ id, file, preview });
          }
        });

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-input text-muted-foreground relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragging && 'border-primary bg-primary/5',
          images.length >= maxImages && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => {
          if (images.length < maxImages) {
            document.getElementById('image-upload-input')?.click();
          }
        }}
      >
        <input
          id="image-upload-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8" />
          <p className="text-sm">
            {images.length >= maxImages
              ? `최대 ${maxImages}장까지 업로드 가능합니다`
              : '사진을 업로드하려면 클릭하거나 드래그하세요'}
          </p>
          <p className="text-muted-foreground text-xs">
            {images.length} / {maxImages}
          </p>
        </div>
      </div>

      {/* 이미지 미리보기 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={image.preview}
                alt={`Upload ${idx + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />

              {/* 대표 이미지 표시 */}
              {idx === 0 && (
                <Badge className="absolute top-2 left-2" variant="default">
                  대표
                </Badge>
              )}

              {/* 삭제 버튼 */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
