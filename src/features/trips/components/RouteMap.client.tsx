'use client';

import { useEffect, useRef } from 'react';

import L from 'leaflet';

import { MAP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Place } from '../types';

function pinIcon(index: number, active: boolean) {
  return L.divIcon({
    className: 'tm-pin',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div style="
      width:30px;height:30px;border-radius:9999px;display:flex;align-items:center;justify-content:center;
      font:700 13px/1 'Pretendard Variable',system-ui,sans-serif;
      background:${active ? 'var(--highlight)' : 'var(--primary)'};color:var(--primary-foreground);
      border:2.5px solid var(--card);box-shadow:0 4px 12px rgb(0 0 0 / .25);
      transform:scale(${active ? 1.15 : 1});transition:transform .15s;
    ">${index + 1}</div>`,
  });
}

interface RouteMapProps {
  places: Place[];
  activeId?: string | null;
  onPinClick?: (place: Place) => void;
  className?: string;
}

/**
 * react-leaflet은 React 19의 이중 마운트에서 깨져서 Leaflet을 직접 다룬다.
 * 지도는 한 번만 만들고, 장소가 바뀌면 레이어만 다시 그린다.
 */
export default function RouteMap({ places, activeId, onPinClick, className }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const onPinClickRef = useRef(onPinClick);
  onPinClickRef.current = onPinClick;

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [MAP_CONFIG.DEFAULT_CENTER.lat, MAP_CONFIG.DEFAULT_CENTER.lng],
      zoom: 4,
      scrollWheelZoom: false,
    });
    L.tileLayer(MAP_CONFIG.TILE.url, { attribution: MAP_CONFIG.TILE.attribution }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // 컨테이너 크기가 바뀌면(레이아웃 이동 등) 타일을 다시 맞춘다
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // 경로와 핀 그리기
  const routeKey = places.map((p) => `${p.id}:${p.lat},${p.lng}`).join('|');
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const latlngs = places.map((p) => L.latLng(p.lat, p.lng));

    if (latlngs.length > 1) {
      L.polyline(latlngs, {
        color: 'var(--primary)',
        weight: 3,
        opacity: 0.8,
        dashArray: '2 8',
        lineCap: 'round',
      }).addTo(layer);
    }

    places.forEach((p, i) => {
      L.marker([p.lat, p.lng], {
        icon: pinIcon(i, p.id === activeId),
        zIndexOffset: p.id === activeId ? 1000 : 0,
      })
        .bindTooltip(p.name, { direction: 'top', offset: [0, -16] })
        .on('click', () => onPinClickRef.current?.(p))
        .addTo(layer);
    });
    // places는 routeKey로 비교한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, activeId]);

  // 장소 목록이 바뀔 때만 화면을 맞춘다
  useEffect(() => {
    const map = mapRef.current;
    if (!map || places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0]!.lat, places[0]!.lng], 14);
    } else {
      map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), {
        padding: [40, 40],
        maxZoom: 15,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  return (
    <div className={cn('relative isolate overflow-hidden rounded-2xl border', className)}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
