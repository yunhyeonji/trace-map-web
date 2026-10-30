'use client';

import React, { useState } from 'react';

import { flagEmoji } from '@/lib/countries';
import { cn } from '@/lib/utils';

import { usePhotoUrl } from '../photos';
import { Trip } from '../types';

function hueOf(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

/** 사진이 없을 때 나라별로 고정된 색의 그라데이션 커버 */
export function coverGradient(seed: string) {
  const h = hueOf(seed);
  return `radial-gradient(120% 90% at 85% 10%, oklch(0.82 0.09 ${(h + 40) % 360}) 0%, transparent 55%), linear-gradient(140deg, oklch(0.62 0.1 ${h}) 0%, oklch(0.42 0.08 ${(h + 30) % 360}) 100%)`;
}

interface TripCoverProps {
  trip: Pick<Trip, 'countryCode' | 'city' | 'coverPhotoId' | 'photoIds'>;
  className?: string;
  /** 사진이 없을 때 국기를 크게 보여줄지 */
  showFlag?: boolean;
  children?: React.ReactNode;
}

export default function TripCover({ trip, className, showFlag = true, children }: TripCoverProps) {
  const url = usePhotoUrl(trip.coverPhotoId ?? trip.photoIds[0]);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: coverGradient(trip.countryCode) }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          onLoad={() => setLoaded(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : (
        showFlag && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-90 drop-shadow-sm select-none">
              {flagEmoji(trip.countryCode)}
            </span>
          </div>
        )
      )}
      {children}
    </div>
  );
}
