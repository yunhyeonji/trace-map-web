'use client';

import React, { Suspense, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { BookOpen, Search, SearchX, X } from 'lucide-react';

import PageTitle from '@/components/layout/pageTitle';
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
    <div className="py-8 md:py-12">
      <PageTitle
        className="container"
        title="기록"
        subtitle={trips.length > 0 ? `${trips.length}개의 여행` : undefined}
      />

      {trips.length === 0 ? (
        <div className="container">
          <EmptyState
            icon={<BookOpen />}
            title="기록 없음"
            description="다녀온 여행을 추가하면 여기에 표시됩니다."
            action={
              <Button asChild>
                <Link href="/trips/new">새 기록</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* 검색 + 나라 필터: 헤더처럼 화면 폭 전체를 덮는 글래스 띠, 내용만 컨테이너에 맞춘다 */}
          <div className="glass sticky top-(--header-height) z-20 mt-4 border-b border-(--glass-line)">
            <div className="container space-y-2.5 py-2.5">
              {/* iOS 검색 필드: 테두리 없는 회색 채움 */}
              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색"
                  className="bg-foreground/[0.06] placeholder:text-muted-foreground text-body h-9 w-full rounded-[10px] pr-9 pl-8 outline-none [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="검색어 지우기"
                    className="bg-muted-foreground/50 text-background absolute top-1/2 right-2.5 flex size-4 -translate-y-1/2 items-center justify-center rounded-full"
                  >
                    <X className="size-3" strokeWidth={3} />
                  </button>
                )}
              </div>
              <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
                <Chip active={!country} onClick={() => setCountry(null)}>
                  전체
                </Chip>
                {countries.map(([code, count]) => (
                  <Chip key={code} active={country === code} onClick={() => setCountry(code)}>
                    {flagEmoji(code)} {countryName(code)}
                    <span className="tabular opacity-50">{count}</span>
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="container">
            {groups.length === 0 ? (
              <EmptyState
                icon={<SearchX />}
                title="결과 없음"
                description={query ? `‘${query}’에 대한 결과가 없습니다.` : undefined}
                action={
                  <Button
                    variant="link"
                    onClick={() => {
                      setQuery('');
                      setCountry(null);
                    }}
                  >
                    필터 지우기
                  </Button>
                }
              />
            ) : (
              <div className="mt-6 space-y-10">
                {groups.map(([year, list]) => (
                  <section key={year}>
                    <h2 className="text-title2 tabular mb-3">{year}</h2>
                    <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
                      {list.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
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
        'text-subheadline inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 transition-colors',
        active
          ? 'bg-primary text-primary-foreground font-semibold'
          : 'bg-foreground/[0.06] text-foreground hover:bg-foreground/10'
      )}
    >
      {children}
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="mt-6 h-9 w-full rounded-[10px]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
