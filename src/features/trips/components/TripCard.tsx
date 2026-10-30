'use client';

import Link from 'next/link';

import { Camera, MapPin } from 'lucide-react';

import { countryName, flagEmoji } from '@/lib/countries';
import { formatDateRange, formatDuration } from '@/lib/date';
import { cn } from '@/lib/utils';

import { tripDays } from '../stats';
import { Trip } from '../types';

import TripCover from './TripCover';

export default function TripCard({ trip, className }: { trip: Trip; className?: string }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className={cn(
        'group bg-card shadow-card hover:shadow-lift block overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5',
        className
      )}
    >
      <TripCover trip={trip} className="aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="bg-background/85 text-foreground absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <span>{flagEmoji(trip.countryCode)}</span>
          {trip.city || countryName(trip.countryCode)}
        </span>
        <div className="absolute right-3 bottom-3 left-3 flex items-center gap-3 text-xs font-medium text-white/95">
          {trip.places.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {trip.places.length}곳
            </span>
          )}
          {trip.photoIds.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Camera className="size-3.5" />
              {trip.photoIds.length}
            </span>
          )}
        </div>
      </TripCover>

      <div className="p-4 sm:p-5">
        <h3 className="group-hover:text-primary line-clamp-2 text-[17px] leading-snug font-bold tracking-tight transition-colors">
          {trip.title}
        </h3>
        <p className="text-muted-foreground tabular mt-2 text-[13px]">
          {formatDateRange(trip.startDate, trip.endDate)}
          <span className="mx-1.5 opacity-40">·</span>
          {formatDuration(tripDays(trip))}
        </p>
      </div>
    </Link>
  );
}
