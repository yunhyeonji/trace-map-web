'use client';

import { useEffect, useRef, useState } from 'react';

import { Loader2, MapPin, Search } from 'lucide-react';

import { MAP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { createId } from '../../db';
import { Place } from '../../types';

export interface PlaceResult extends Place {
  countryCode?: string;
  city?: string;
}

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: {
    country_code?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
  };
}

async function searchPlaces(query: string, signal: AbortSignal): Promise<PlaceResult[]> {
  const url = new URL('/search', MAP_CONFIG.NOMINATIM_API_URL);
  url.searchParams.set('format', 'json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(MAP_CONFIG.SEARCH_LIMIT));
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', 'ko,en');

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('장소 검색에 실패했습니다');
  const data = (await res.json()) as NominatimItem[];

  return data.map((d) => ({
    id: createId(),
    name: d.name || d.display_name.split(',')[0]!.trim(),
    address: d.display_name,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
    countryCode: d.address?.country_code?.toUpperCase(),
    city: d.address?.city || d.address?.town || d.address?.village || d.address?.state,
  }));
}

export default function PlaceSearch({ onPick }: { onPick: (place: PlaceResult) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        setResults(await searchPlaces(q, controller.signal));
        setStatus('idle');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setStatus('error');
      }
    }, MAP_CONFIG.SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (r: PlaceResult) => {
    onPick(r);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (results[0]) pick(results[0]);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="장소 검색"
        className="bg-foreground/[0.06] placeholder:text-muted-foreground text-body h-9 w-full rounded-[10px] pr-9 pl-8 outline-none"
      />
      {status === 'loading' && (
        <Loader2 className="text-muted-foreground absolute top-1/2 right-2.5 size-4 -translate-y-1/2 animate-spin" />
      )}

      {showPanel && (
        <div className="bg-popover shadow-lift animate-in fade-in-0 slide-in-from-top-1 absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border">
          {status === 'error' ? (
            <p className="text-muted-foreground text-subheadline px-4 py-6 text-center">
              검색할 수 없습니다. 잠시 후 다시 시도하세요.
            </p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground text-subheadline px-4 py-6 text-center">
              {status === 'loading' ? '검색 중…' : '결과 없음'}
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className={cn(
                      'hover:bg-accent flex w-full items-start gap-3 rounded-xl p-2.5 text-left'
                    )}
                  >
                    <span className="bg-primary-soft text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                      <MapPin className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-body block truncate">{r.name}</span>
                      <span className="text-muted-foreground text-footnote line-clamp-1">
                        {r.address}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-muted-foreground text-caption border-t px-4 py-2">© OpenStreetMap</p>
        </div>
      )}
    </div>
  );
}
