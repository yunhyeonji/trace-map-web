'use client';

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline,Popup, TileLayer } from 'react-leaflet';

import L from 'leaflet';

import { MAP_CONFIG } from '@/lib/constants';

import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: MAP_CONFIG.LEAFLET_ICON.iconRetinaUrl,
  iconUrl: MAP_CONFIG.LEAFLET_ICON.iconUrl,
  shadowUrl: MAP_CONFIG.LEAFLET_ICON.shadowUrl,
});

type Place = {
  id: string | number;
  title: string;
  location: string;
  memo?: string;
  lat?: number;
  lon?: number;
};

interface MapViewProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
}

export default function MapView({ places, onPlaceClick }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-muted/20 flex h-130 w-full items-center justify-center rounded-lg border">
        <div className="text-muted-foreground">지도 로딩 중...</div>
      </div>
    );
  }

  // lat, lon이 있는 장소만 필터링
  const validPlaces = places.filter((p) => p.lat != null && p.lon != null);

  // 중심 좌표 계산 (안전하게)
  const center: [number, number] =
    validPlaces.length > 0 && validPlaces[0]
      ? [validPlaces[0].lat!, validPlaces[0].lon!]
      : [MAP_CONFIG.DEFAULT_CENTER.lat, MAP_CONFIG.DEFAULT_CENTER.lng];

  // 경로 그리기용 좌표 배열
  const positions: [number, number][] = validPlaces.map((p) => [p.lat!, p.lon!]);

  return (
    <div className="h-130 w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={center}
        zoom={validPlaces.length > 0 ? 13 : 11}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer attribution={MAP_CONFIG.TILE.attribution} url={MAP_CONFIG.TILE.url} />

        {validPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat!, place.lon!]}
            eventHandlers={{
              click: () => onPlaceClick?.(place),
            }}
          >
            <Popup>
              <div className="min-w-50">
                <div className="font-semibold">{place.title}</div>
                {place.memo && (
                  <div className="text-muted-foreground mt-1 text-sm">{place.memo}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline positions={positions} color="#3b82f6" weight={3} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
}
