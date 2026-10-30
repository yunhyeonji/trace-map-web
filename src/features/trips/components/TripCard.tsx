'use client';

import Link from 'next/link';

import { countryName, flagEmoji } from '@/lib/countries';
import { formatDateRange } from '@/lib/date';
import { cn } from '@/lib/utils';

import { Trip } from '../types';

import TripCover from './TripCover';

/** 사진 위에 아무것도 얹지 않고, 제목과 정보는 사진 아래에 둔다 (사진 앱/저널 앱 방식) */
export default function TripCard({ trip, className }: { trip: Trip; className?: string }) {
  return (
    <Link href={`/trips/${trip.id}`} className={cn('group block', className)}>
      <TripCover
        trip={trip}
        className="aspect-[4/3] rounded-xl transition-opacity group-active:opacity-80"
      />
      <h3 className="text-headline mt-2.5 line-clamp-2">{trip.title}</h3>
      <p className="text-muted-foreground text-subheadline tabular mt-0.5 truncate">
        {flagEmoji(trip.countryCode)} {trip.city || countryName(trip.countryCode)}
        <span className="mx-1.5">·</span>
        {formatDateRange(trip.startDate, trip.endDate)}
      </p>
    </Link>
  );
}
