'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ChevronLeft, Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ConfirmAlert from '@/components/ui/confirm-alert';
import { GroupedButtonRow, GroupedRow, GroupedSection } from '@/components/ui/grouped-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import EmptyState from '@/features/trips/components/EmptyState';
import PhotoGallery from '@/features/trips/components/PhotoGallery';
import RouteMap from '@/features/trips/components/RouteMap';
import TripCover from '@/features/trips/components/TripCover';
import { tripDays } from '@/features/trips/stats';
import { useTrips } from '@/features/trips/store';
import { Trip } from '@/features/trips/types';
import { countryName, flagEmoji } from '@/lib/countries';
import { formatDateRange, formatDuration } from '@/lib/date';
import { cn } from '@/lib/utils';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { trips, ready } = useTrips();
  const router = useRouter();
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!ready) return <DetailSkeleton />;

  const index = trips.findIndex((t) => t.id === id);
  const trip = trips[index];

  if (!trip) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Compass />}
          title="기록을 찾을 수 없음"
          description="삭제되었거나 다른 브라우저에서 만든 기록입니다."
          action={
            <Button variant="link" asChild>
              <Link href="/trips">기록으로 돌아가기</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // 목록은 최신순이라 '다음'이 더 예전 여행
  const newer = trips[index - 1];
  const older = trips[index + 1];

  return (
    <article className="pb-16">
      {/* 커버: 이미지 위에는 탐색 버튼만 둔다 */}
      <div className="md:container md:pt-6">
        <TripCover trip={trip} className="h-[42vh] min-h-64 md:h-[400px] md:rounded-2xl">
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 md:p-4">
            <button
              onClick={() => (window.history.length > 1 ? router.back() : router.push('/trips'))}
              aria-label="뒤로"
              className="flex size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-black/45"
            >
              <ChevronLeft className="size-5" strokeWidth={2.4} />
            </button>
            <Link
              href={`/trips/${trip.id}/edit`}
              className="text-subheadline flex h-9 items-center rounded-full bg-black/30 px-4 font-semibold text-white backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-black/45"
            >
              편집
            </Link>
          </div>
        </TripCover>
      </div>

      <div className="container mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0 space-y-8">
          <header>
            <p className="text-muted-foreground text-subheadline">
              {flagEmoji(trip.countryCode)} {countryName(trip.countryCode)}
              {trip.city && ` · ${trip.city}`}
            </p>
            <h1 className="text-large-title mt-1 text-balance">{trip.title}</h1>
            <p className="text-muted-foreground text-subheadline tabular mt-1.5">
              {formatDateRange(trip.startDate, trip.endDate)} · {formatDuration(tripDays(trip))}
            </p>
          </header>

          {(trip.companions.length > 0 || trip.tags.length > 0) && (
            <GroupedSection>
              {trip.companions.length > 0 && (
                <GroupedRow>
                  <span className="text-body shrink-0">함께한 사람</span>
                  <span className="text-muted-foreground text-body ml-auto truncate text-right">
                    {trip.companions.join(', ')}
                  </span>
                </GroupedRow>
              )}
              {trip.tags.length > 0 && (
                <GroupedRow>
                  <span className="text-body shrink-0">태그</span>
                  <span className="text-muted-foreground text-body ml-auto truncate text-right">
                    {trip.tags.map((t) => `#${t}`).join(' ')}
                  </span>
                </GroupedRow>
              )}
            </GroupedSection>
          )}

          {trip.story && (
            <p className="text-body leading-[1.7] whitespace-pre-line">{trip.story}</p>
          )}

          {trip.photoIds.length > 0 && (
            <section>
              <h2 className="text-title3 mb-3">사진</h2>
              <PhotoGallery photoIds={trip.photoIds} />
            </section>
          )}
        </div>

        {/* 동선 */}
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          {trip.places.length > 0 && (
            <>
              <h2 className="text-title3 mb-3">다녀온 곳</h2>
              <RouteMap
                places={trip.places}
                activeId={activePlace}
                onPinClick={(p) => setActivePlace(p.id)}
                className="h-60 rounded-xl border-0 lg:h-72"
              />
              <GroupedSection className="mt-3">
                {trip.places.map((p, i) => (
                  <GroupedButtonRow
                    key={p.id}
                    chevron={false}
                    onClick={() => setActivePlace(p.id)}
                    className={cn('items-start', activePlace === p.id && 'bg-accent')}
                  >
                    <span
                      className={cn(
                        'text-caption mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-semibold',
                        activePlace === p.id
                          ? 'bg-highlight text-white'
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="text-body block">{p.name}</span>
                      {p.memo && (
                        <span className="text-muted-foreground text-subheadline mt-0.5 block">
                          {p.memo}
                        </span>
                      )}
                    </span>
                  </GroupedButtonRow>
                ))}
              </GroupedSection>
            </>
          )}
        </aside>
      </div>

      <div className="container mt-12 grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="space-y-8">
          {(newer || older) && (
            <GroupedSection>
              {older && (
                <GroupedButtonRow onClick={() => router.push(`/trips/${older.id}`)}>
                  <span className="text-body shrink-0">이전 여행</span>
                  <span className="text-muted-foreground text-body min-w-0 flex-1 truncate text-right">
                    {older.title}
                  </span>
                </GroupedButtonRow>
              )}
              {newer && (
                <GroupedButtonRow onClick={() => router.push(`/trips/${newer.id}`)}>
                  <span className="text-body shrink-0">다음 여행</span>
                  <span className="text-muted-foreground text-body min-w-0 flex-1 truncate text-right">
                    {newer.title}
                  </span>
                </GroupedButtonRow>
              )}
            </GroupedSection>
          )}

          <GroupedSection>
            <GroupedButtonRow
              chevron={false}
              onClick={() => setConfirming(true)}
              className="text-destructive text-body justify-center"
            >
              기록 삭제
            </GroupedButtonRow>
          </GroupedSection>
        </div>
      </div>

      <DeleteAlert trip={trip} open={confirming} onOpenChange={setConfirming} />
    </article>
  );
}

function DeleteAlert({
  trip,
  open,
  onOpenChange,
}: {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { deleteTrip } = useTrips();
  const toast = useToast();

  const handleDelete = async () => {
    await deleteTrip(trip.id);
    toast('기록을 삭제했습니다');
    router.replace('/trips');
  };

  return (
    <ConfirmAlert
      open={open}
      onOpenChange={onOpenChange}
      title="이 기록을 삭제하시겠습니까?"
      message={`${trip.photoIds.length > 0 ? `사진 ${trip.photoIds.length}장도 함께 삭제됩니다. ` : ''}이 동작은 취소할 수 없습니다.`}
      confirmLabel="삭제"
      onConfirm={handleDelete}
      destructive
    />
  );
}

function DetailSkeleton() {
  return (
    <div className="md:container md:pt-6">
      <Skeleton className="h-[42vh] min-h-64 rounded-none md:h-[400px] md:rounded-2xl" />
      <div className="container mt-6 space-y-3 md:px-0">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
