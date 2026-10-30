'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight, Compass, Pencil, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [activePlace, setActivePlace] = useState<string | null>(null);

  if (!ready) return <DetailSkeleton />;

  const index = trips.findIndex((t) => t.id === id);
  const trip = trips[index];

  if (!trip) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Compass className="size-5" />}
          title="기록을 찾을 수 없어요"
          description="삭제됐거나 다른 브라우저에서 만든 기록일 수 있어요."
          action={
            <Button asChild>
              <Link href="/trips">기록 목록으로</Link>
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
      {/* 커버 */}
      <div className="md:container md:pt-6">
        <TripCover
          trip={trip}
          showFlag={false}
          className="h-[46vh] min-h-72 md:h-[420px] md:rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
          <TopBar trip={trip} />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-10">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold backdrop-blur">
              {flagEmoji(trip.countryCode)} {countryName(trip.countryCode)}
              {trip.city && <span className="opacity-80">· {trip.city}</span>}
            </p>
            <h1 className="mt-3 max-w-3xl text-[26px] leading-tight font-bold tracking-tight text-balance md:text-[40px]">
              {trip.title}
            </h1>
            <p className="tabular mt-2 text-sm text-white/85 md:text-base">
              {formatDateRange(trip.startDate, trip.endDate)} · {formatDuration(tripDays(trip))}
            </p>
          </div>
        </TripCover>
      </div>

      <div className="container mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        {/* 본문 */}
        <div className="min-w-0 space-y-10">
          {(trip.companions.length > 0 || trip.tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {trip.companions.length > 0 && (
                <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium">
                  <Users className="size-3.5" />
                  {trip.companions.join(', ')}와 함께
                </span>
              )}
              {trip.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary-soft text-primary rounded-full px-3 py-1.5 text-[13px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {trip.story ? (
            <section>
              <h2 className="text-muted-foreground mb-3 text-sm font-semibold">이야기</h2>
              <p className="text-[17px] leading-[1.85] whitespace-pre-line">{trip.story}</p>
            </section>
          ) : (
            <Link
              href={`/trips/${trip.id}/edit`}
              className="text-muted-foreground hover:border-primary hover:text-primary block rounded-2xl border border-dashed p-6 text-center text-sm transition-colors"
            >
              아직 이야기가 없어요. 이 여행에서 기억에 남는 순간을 적어볼까요?
            </Link>
          )}

          {trip.photoIds.length > 0 && (
            <section>
              <h2 className="text-muted-foreground mb-3 text-sm font-semibold">
                사진 <span className="tabular">{trip.photoIds.length}</span>
              </h2>
              <PhotoGallery photoIds={trip.photoIds} />
            </section>
          )}
        </div>

        {/* 동선 */}
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
          <h2 className="text-muted-foreground mb-3 text-sm font-semibold">
            다녀온 곳 <span className="tabular">{trip.places.length}</span>
          </h2>
          {trip.places.length > 0 ? (
            <>
              <RouteMap
                places={trip.places}
                activeId={activePlace}
                onPinClick={(p) => setActivePlace(p.id)}
                className="h-64 lg:h-72"
              />
              <ol className="relative mt-5 space-y-1">
                <span className="bg-border absolute top-4 bottom-4 left-[15px] w-px" aria-hidden />
                {trip.places.map((p, i) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActivePlace(p.id)}
                      className={cn(
                        'relative flex w-full gap-3 rounded-xl p-1.5 text-left transition-colors',
                        activePlace === p.id ? 'bg-accent' : 'hover:bg-accent/60'
                      )}
                    >
                      <span
                        className={cn(
                          'ring-background relative flex size-[22px] shrink-0 translate-x-[4px] items-center justify-center rounded-full text-[11px] font-bold ring-4',
                          activePlace === p.id
                            ? 'bg-highlight text-white'
                            : 'bg-primary text-primary-foreground'
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 pl-1">
                        <span className="block text-[15px] font-semibold">{p.name}</span>
                        {p.memo && (
                          <span className="text-muted-foreground mt-0.5 block text-[13px] leading-relaxed">
                            {p.memo}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
              기록된 장소가 없어요
            </p>
          )}
        </aside>
      </div>

      {/* 이전/다음 여행 */}
      {(newer || older) && (
        <nav className="container mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2">
          {older ? <Neighbor trip={older} label="이전 여행" /> : <div />}
          {newer && <Neighbor trip={newer} label="다음 여행" align="right" />}
        </nav>
      )}
    </article>
  );
}

function TopBar({ trip }: { trip: Trip }) {
  const router = useRouter();
  const { deleteTrip } = useTrips();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const glass =
    'bg-black/25 text-white backdrop-blur-md hover:bg-black/40 hover:text-white border-0';

  const handleDelete = async () => {
    await deleteTrip(trip.id);
    toast('기록을 삭제했어요');
    router.replace('/trips');
  };

  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6">
      <Button
        size="icon"
        variant="ghost"
        className={glass}
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/trips'))}
        aria-label="뒤로"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className={cn(glass, 'h-10 px-4')} asChild>
          <Link href={`/trips/${trip.id}/edit`}>
            <Pencil />
            수정
          </Link>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className={glass}
          onClick={() => setConfirming(true)}
          aria-label="삭제"
        >
          <Trash2 className="size-[18px]" />
        </Button>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent hideClose>
          <DialogTitle>이 기록을 삭제할까요?</DialogTitle>
          <DialogDescription>
            ‘{trip.title}’ 기록과 사진 {trip.photoIds.length}장이 이 브라우저에서 사라져요. 되돌릴
            수 없어요.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Neighbor({
  trip,
  label,
  align = 'left',
}: {
  trip: Trip;
  label: string;
  align?: 'left' | 'right';
}) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className={cn(
        'group hover:bg-accent flex items-center gap-3 rounded-2xl border p-4 transition-colors',
        align === 'right' && 'flex-row-reverse text-right'
      )}
    >
      {align === 'right' ? (
        <ArrowRight className="text-muted-foreground size-4 shrink-0" />
      ) : (
        <ArrowLeft className="text-muted-foreground size-4 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="mt-0.5 truncate font-semibold">
          {flagEmoji(trip.countryCode)} {trip.title}
        </p>
      </div>
    </Link>
  );
}

function DetailSkeleton() {
  return (
    <div className="md:container md:pt-6">
      <Skeleton className="h-[46vh] min-h-72 rounded-none md:h-[420px] md:rounded-3xl" />
      <div className="container mt-8 space-y-3 md:px-0">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
