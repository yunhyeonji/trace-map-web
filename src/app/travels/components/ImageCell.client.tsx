'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Travel } from '@/service/travels/types';

const ImageCell = ({ travel }: { travel: Travel }) => {
  const hasImage = Boolean(travel.coverPhoto);
  const [loaded, setLoaded] = useState(!hasImage);

  const handleImageLoad = () => {
    // 이미지 로딩 테스트를 위한 지연 시간 (ms)
    // setTimeout(() => setLoaded(true), 2000);
    setLoaded(true);
  };

  return (
    <div className="group relative aspect-3/1 overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 z-20 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}

      {travel.coverPhoto ? (
        <>
          <Image
            src={travel.coverPhoto}
            alt={travel.travelName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-300 group-hover:scale-105',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleImageLoad}
          />
          <div className="from-background/20 absolute inset-0 z-10 bg-linear-to-t to-transparent" />
        </>
      ) : (
        <div className="grid h-full w-full place-items-center bg-gray-200 font-semibold text-gray-400">
          이미지 없음
        </div>
      )}
    </div>
  );
};

export default ImageCell;
