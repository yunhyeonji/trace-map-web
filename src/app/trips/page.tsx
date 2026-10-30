'use client';

import React, { Suspense, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { BookOpen, Plus, Search, SearchX, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/features/trips/components/EmptyState';
import TripCard from '@/features/trips/components/TripCard';
import { groupByYear } from '@/features/trips/stats';
import { useTrips } from '@/features/trips/store';
import { countryName, flagEmoji } from '@/lib/countries';
import { cn } from '@/lib/utils';

export default function TripsPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <TripsList />
    </Suspense>
  );
}

function TripsList() {
  const { trips, ready } = useTrips();
  const router = useRouter();
  const params = useSearchParams();
  const country = params.get('country');
  const [query, setQuery] = useState('');

  const countries = useMemo(() => {
    const counts = new Map<string, number>();
    trips.forEach((t) => counts.set(t.countryCode, (counts.get(t.countryCode) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [trips]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trips.filter((t) => {
      if (country && t.countryCode !== country) return false;
      if (!q) return true;
      return [
        t.title,
        t.city,
        t.story,
        countryName(t.countryCode),
        ...t.tags,
        ...t.companions,
        ...t.places.map((p) => p.name),
      ]
        .filter(Boolean)
        .some((s) => s!.toLowerCase().includes(q));
    });
  }, [trips, country, query]);

  const groups = useMemo(() => groupByYear(filtered), [filtered]);

  const setCountry = (code: string | null) =>
    router.replace(code ? `/trips?country=${code}` : '/trips', { scroll: false });

  if (!ready) return <ListSkeleton />;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight md:text-3xl">여행 기록</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {trips.length > 0 ? `총 ${trips.length}개의 여행을 기록했어요` : '아직 기록이 없어요'}
          </p>
        </div>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<BookOpen className="size-5" />}
          title="첫 번째 여행을 기록해보세요"
          description="최근에 다녀온 여행 하나면 충분해요. 사진은 나중에 추가해도 괜찮아요."
          action={
            <Button asChild>
              <Link href="/trips/new">
                <Plus />새 기록 쓰기
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* 검색 + 나라 필터 */}
          <div className="bg-background/85 sticky top-(--header-height) z-20 -mx-4 mt-6 space-y-3 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="제목, 도시, 장소, 동행인, 태그로 검색"
                className="bg-card focus:border-ring focus:ring-ring/20 h-11 w-full rounded-full border pr-10 pl-11 text-[15px] outline-none focus:ring-4 md:text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="검색어 지우기"
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              <Chip active={!country} onClick={() => setCountry(null)}>
                전체
              </Chip>
              {countries.map(([code, count]) => (
                <Chip key={code} active={country === code} onClick={() => setCountry(code)}>
                  {flagEmoji(code)} {countryName(code)}
                  <span className="tabular opacity-60">{count}</span>
                </Chip>
              ))}
            </div>
          </div>

          {groups.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<SearchX className="size-5" />}
              title="조건에 맞는 기록이 없어요"
              description="검색어나 나라 필터를 바꿔보세요."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setCountry(null);
                  }}
                >
                  필터 초기화
                </Button>
              }
            />
          ) : (
            <div className="mt-4 space-y-12">
              {groups.map(([year, list]) => (
                <section key={year}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 className="tabular text-2xl font-bold tracking-tight">{year}</h2>
                    <span className="text-muted-foreground text-sm">{list.length}개의 여행</span>
                    <div className="bg-border h-px flex-1 self-center" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {list.map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-card text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-6 h-11 w-full rounded-full" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/4] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
