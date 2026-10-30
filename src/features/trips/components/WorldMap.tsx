'use client';

import React, { memo, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import { Country, findCountryByGeo, flagEmoji } from '@/lib/countries';

const GEO_URL =
  process.env.NEXT_PUBLIC_MAP_URL ||
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  /** 나라 코드 → 여행 횟수 */
  counts: Map<string, number>;
  onSelect?: (country: Country) => void;
}

function WorldMap({ counts, onSelect }: WorldMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ label: string; x: number; y: number } | null>(null);
  const max = Math.max(1, ...counts.values());

  const moveTip = (e: React.MouseEvent, label: string) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ label, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165, center: [10, 8] }}
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties?.name !== 'Antarctica')
              .map((geo) => {
                const country = findCountryByGeo(geo.id, geo.properties?.name);
                const count = country ? (counts.get(country.code) ?? 0) : 0;
                const visited = count > 0;
                // 많이 간 나라일수록 진하게
                const strength = visited ? 55 + Math.round((count / max) * 45) : 0;
                const fill = visited
                  ? `color-mix(in oklch, var(--primary) ${strength}%, var(--map-land))`
                  : 'var(--map-land)';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={-1}
                    onMouseMove={(e) =>
                      visited &&
                      country &&
                      moveTip(e, `${flagEmoji(country.code)} ${country.name} · ${count}번`)
                    }
                    onMouseLeave={() => setTip(null)}
                    onClick={() => visited && country && onSelect?.(country)}
                    style={{
                      default: {
                        fill,
                        stroke: 'var(--map-stroke)',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                      hover: {
                        fill: visited ? 'var(--highlight)' : fill,
                        stroke: 'var(--map-stroke)',
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: visited ? 'pointer' : 'default',
                      },
                      pressed: { fill: 'var(--highlight)', outline: 'none' },
                    }}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>

      {tip && (
        <div
          className="bg-foreground text-background shadow-lift pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.label}
        </div>
      )}
    </div>
  );
}

export default memo(WorldMap);
