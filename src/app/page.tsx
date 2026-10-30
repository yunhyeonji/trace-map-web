'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowRight, Plus, Sparkles } from 'lucide-react';

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
  const coverage = Math.round((stats.countries / 195) * 1000) / 10;

  return (
    <div className="container py-8 md:py-12">
      {/* 인트로 */}
      <section className="max-w-2xl">
        <p className="text-primary text-sm font-semibold">나의 여행 지도</p>
        <h1 className="mt-2 text-[28px] leading-tight font-bold tracking-tight md:text-4xl">
          지금까지 <span className="text-primary">{stats.countries}개국</span>에서
          <br />
          <span className="tabular">{stats.days}</span>일을 보냈어요
        </h1>
      </section>

      {/* 통계 */}
      <dl className="bg-border mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4">
        <Stat label="여행" value={stats.trips} unit="번" />
        <Stat label="나라" value={stats.countries} unit="곳" hint={`세계의 ${coverage}%`} />
        <Stat label="도시" value={stats.cities} unit="곳" />
        <Stat
          label="가장 자주 간 곳"
          value={stats.favorite ? countryName(stats.favorite.code) : '-'}
          hint={stats.favorite ? `${stats.favorite.count}번 방문` : undefined}
        />
      </dl>

      {/* 세계 지도 */}
      <section className="bg-card shadow-card mt-6 rounded-2xl border p-4 md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-bold">발자취</h2>
          <p className="text-muted-foreground hidden text-xs sm:block">
            색칠된 나라를 누르면 그 나라 기록만 볼 수 있어요
          </p>
        </div>
        <div className="-mx-2 mt-2 md:mx-0">
          <WorldMap
            counts={stats.countryCounts}
            onSelect={(c) => router.push(`/trips?country=${c.code}`)}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {visited.map(([code, count]) => (
            <Link
              key={code}
              href={`/trips?country=${code}`}
              className="bg-muted hover:bg-primary-soft hover:text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
            >
              <span>{flagEmoji(code)}</span>
              {countryName(code)}
              <span className="text-muted-foreground tabular text-xs">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 기록 */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">최근 기록</h2>
          <Link
            href="/trips"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium"
          >
            전체 보기 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {trips.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: number | string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="bg-card flex flex-col gap-1 p-4 md:p-5">
      <dt className="text-muted-foreground text-xs font-medium">{label}</dt>
      <dd className="truncate text-2xl font-bold tracking-tight md:text-[28px]">
        <span className="tabular">{value}</span>
        {unit && (
          <span className="text-muted-foreground ml-0.5 text-base font-semibold">{unit}</span>
        )}
      </dd>
      {hint && <dd className="text-muted-foreground text-xs">{hint}</dd>}
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
    toast('샘플 기록 5개를 불러왔어요');
  };

  return (
    <div className="container py-10 md:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <span className="bg-highlight-soft text-highlight inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5" />
          서버 없이, 내 브라우저에만 저장돼요
        </span>
        <h1 className="mt-5 text-[32px] leading-[1.2] font-bold tracking-tight md:text-5xl">
          다녀온 여행을
          <br />
          <span className="text-primary">지도 위에</span> 남겨보세요
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-relaxed md:text-lg">
          사진, 다녀온 곳, 그날의 이야기를 한 장의 기록으로.
          <br className="hidden sm:block" /> 기록이 쌓이면 세계 지도가 채워져요.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/trips/new">
              <Plus />첫 여행 기록하기
            </Link>
          </Button>
          <Button size="lg" variant="outline" onClick={handleSample} disabled={loading}>
            {loading ? '불러오는 중…' : '샘플로 둘러보기'}
          </Button>
        </div>
      </section>

      <div className="bg-card shadow-card relative mx-auto mt-12 max-w-4xl rounded-2xl border p-4 md:p-8">
        <WorldMap counts={NO_VISITS} />
        <ol className="mt-6 grid gap-4 text-left sm:grid-cols-3">
          {[
            ['기본 정보', '어디로, 언제 다녀왔는지'],
            ['다녀온 곳', '장소를 검색하면 동선이 그려져요'],
            ['사진과 이야기', '그날의 기억을 짧게라도'],
          ].map(([title, desc], i) => (
            <li key={title} className="flex gap-3">
              <span className="bg-primary-soft text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-muted-foreground mt-0.5 text-[13px]">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-10 w-80 max-w-full" />
      <Skeleton className="mt-2 h-10 w-56" />
      <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
      <Skeleton className="mt-6 aspect-[2/1] w-full rounded-2xl" />
    </div>
  );
}
