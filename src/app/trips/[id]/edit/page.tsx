'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/features/trips/components/EmptyState';
import TripForm from '@/features/trips/components/form/TripForm';
import { useTrips } from '@/features/trips/store';

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const { getTrip, ready } = useTrips();

  if (!ready) {
    return (
      <div className="container max-w-3xl space-y-5 py-12">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const trip = getTrip(id);
  if (!trip) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Compass className="size-5" />}
          title="기록을 찾을 수 없어요"
          action={
            <Button asChild>
              <Link href="/trips">기록 목록으로</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <TripForm key={trip.id} trip={trip} />;
}
