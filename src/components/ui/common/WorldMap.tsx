'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import { getCountryCode } from '@/lib/countryMapping';

const geoUrl = process.env.NEXT_PUBLIC_MAP_URL;

interface GeoProperties {
  name?: string;
  NAME?: string;
}

export interface Geo {
  properties: GeoProperties;
  rsmKey: string;
}

interface WorldMapProps {
  visitedCodes: string[];
  onCountryClick?: (geo: Geo) => void;
}

const WorldMap = ({ visitedCodes, onCountryClick }: WorldMapProps) => {
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative h-full w-full">
      {/* 🟦 Hover Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-neutral-50 shadow"
          style={{
            top: tooltip.y - 350,
            left: tooltip.x - 20,
          }}
        >
          {tooltip.name}
        </div>
      )}

      <ComposableMap
        projectionConfig={{
          scale: 160,
          rotate: [0, 0, 0],
        }}
        width={800}
        height={420}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4} center={[0, 5]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                // ❌ 남극 제거
                .filter(
                  (geo) =>
                    geo.properties.NAME !== 'Antarctica' && geo.properties.name !== 'Antarctica'
                )
                .map((geo) => {
                  const countryName = geo.properties.name || geo.properties.NAME || '알 수 없음';
                  const countryCode = getCountryCode(countryName);
                  const isVisited = countryCode ? visitedCodes.includes(countryCode) : false;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => isVisited && onCountryClick?.(geo)}
                      onMouseEnter={(e) => {
                        if (!isVisited) return;
                        setTooltip({
                          name: countryName,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseMove={(e) => {
                        if (!isVisited) return;
                        setTooltip((prev) =>
                          prev
                            ? {
                                ...prev,
                                x: e.clientX,
                                y: e.clientY,
                              }
                            : prev
                        );
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: {
                          fill: isVisited ? 'var(--primary)' : 'var(--muted)',
                          outline: 'none',
                          transition: 'fill 0.15s ease',
                        },
                        hover: {
                          fill: isVisited ? 'var(--primary-hover)' : 'var(--muted)',
                          cursor: isVisited ? 'pointer' : 'default',
                          outline: 'none',
                        },
                        pressed: {
                          fill: 'var(--primary)',
                          outline: 'none',
                        },
                      }}
                      stroke="var(--border)"
                      strokeWidth={0.5}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
