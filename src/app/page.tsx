'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PageTitle from '@/components/layout/pageTitle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import TripCard from '@/features/trips/components/TripCard';
import WorldMap from '@/features/trips/components/WorldMap';
import { computeStats } from '@/features/trips/stats';
import { useTrips } from '@/features/trips/store';
import { countryName, flagEmoji } from '@/lib/countries';

const NO_VISITS = new Map<string, number>();

export default function HomePage() {
  const { trips, ready } = useTrips();
  const stats = useMemo(() => computeStats(trips), [trips]);
  const router = useRouter();

  if (!ready) return <HomeSkeleton />;
  if (trips.length === 0) return <Welcome />;

  const visited = [...stats.countryCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="container py-8 md:py-12">
      <PageTitle title="여행 지도" />

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="여행" value={stats.trips} unit="회" />
        <Stat label="나라" value={stats.countries} unit="개국" />
        <Stat label="도시" value={stats.cities} unit="곳" />
        <Stat label="여행한 날" value={stats.days} unit="일" />
      </dl>

      <section className="bg-card mt-3 rounded-xl p-4 md:p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-headline">방문한 나라</h2>
          {stats.favorite && (
            <p className="text-muted-foreground text-footnote">
              가장 많이 간 곳 {flagEmoji(stats.favorite.code)} {countryName(stats.favorite.code)}
            </p>
          )}
        </div>
        <div className="-mx-2 mt-3 md:mx-0">
          <WorldMap
            counts={stats.countryCounts}
            onSelect={(c) => router.push(`/trips?country=${c.code}`)}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visited.map(([code, count]) => (
            <Link
              key={code}
              href={`/trips?country=${code}`}
              className="bg-muted text-subheadline active:bg-accent hover:bg-accent inline-flex h-8 items-center gap-1.5 rounded-full px-3 transition-colors"
            >
              {flagEmoji(code)} {countryName(code)}
              <span className="text-muted-foreground tabular">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-title2">최근 기록</h2>
          <Link href="/trips" className="text-primary text-body hover:opacity-70">
            모두 보기
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-card rounded-xl px-4 py-3.5">
      <dt className="text-muted-foreground text-footnote">{label}</dt>
      <dd className="mt-0.5">
        <span className="text-title1 tabular">{value}</span>
        <span className="text-muted-foreground text-subheadline ml-0.5">{unit}</span>
      </dd>
    </div>
  );
}

function Welcome() {
  const { loadSamples } = useTrips();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSample = async () => {
    setLoading(true);
    await loadSamples();
    toast('샘플 기록을 추가했습니다');
  };

  return (
    <div className="container py-12 md:py-20">
      <section className="mx-auto max-w-md text-center">
        <h1 className="text-large-title">다녀온 여행을 기록하세요</h1>
        <p className="text-muted-foreground text-body mt-3">
          사진과 장소, 메모를 한곳에 모으고 방문한 나라를 지도에서 확인합니다.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="lg" asChild className="w-full max-w-xs">
            <Link href="/trips/new">새 기록</Link>
          </Button>
          <Button variant="link" onClick={handleSample} disabled={loading} className="text-body">
            {loading ? '추가하는 중…' : '샘플 기록으로 둘러보기'}
          </Button>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-4xl opacity-80">
        <WorldMap counts={NO_VISITS} />
      </div>
      <p className="text-muted-foreground text-footnote mt-6 text-center">
        기록은 이 브라우저에만 저장됩니다.
      </p>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <Skeleton className="h-10 w-40" />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mt-3 aspect-[2/1] w-full rounded-xl" />
    </div>
  );
}
