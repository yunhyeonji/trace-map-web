'use client';

import { useEffect, useState } from 'react';

import { createId, db } from './db';
import { TripRepository } from './repository';
import { Photo } from './types';

const MAX_EDGE = 1600;
const QUALITY = 0.82;

/** 업로드한 이미지를 긴 변 1600px JPEG로 줄인다 */
export async function processImage(file: File): Promise<Photo> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('이미지 변환 실패'))),
      'image/jpeg',
      QUALITY
    )
  );

  return { id: createId(), blob, width, height };
}

// 같은 사진을 여러 화면에서 쓸 때 object URL을 한 번만 만든다
const urlCache = new Map<string, Promise<string | null>>();

// 로그인 상태에 따라 TripsProvider가 바꿔 끼운다
let source: Pick<TripRepository, 'getPhotoBlob'> = db;

export function setPhotoSource(repo: Pick<TripRepository, 'getPhotoBlob'>) {
  if (repo === source) return;
  source = repo;
  forgetPhotoUrls([...urlCache.keys()]);
}

export function photoUrl(id: string): Promise<string | null> {
  let cached = urlCache.get(id);
  if (!cached) {
    cached = source.getPhotoBlob(id).then((b) => (b ? URL.createObjectURL(b) : null));
    urlCache.set(id, cached);
  }
  return cached;
}

export function forgetPhotoUrls(ids: string[]) {
  ids.forEach((id) => {
    urlCache.get(id)?.then((url) => url && URL.revokeObjectURL(url));
    urlCache.delete(id);
  });
}

export function usePhotoUrl(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let alive = true;
    photoUrl(id).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [id]);

  return url;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
