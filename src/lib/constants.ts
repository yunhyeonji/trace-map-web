export const MAP_CONFIG = {
  NOMINATIM_API_URL:
    process.env.NEXT_PUBLIC_NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org',
  DEFAULT_CENTER: {
    lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LAT || '37.5665'),
    lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LNG || '126.978'),
  },
  SEARCH_MIN_LENGTH: 3,
  SEARCH_LIMIT: 6,
  SEARCH_DEBOUNCE_MS: 400,

  // Leaflet 아이콘
  LEAFLET_ICON: {
    iconUrl:
      process.env.NEXT_PUBLIC_LEAFLET_ICON_URL ||
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl:
      process.env.NEXT_PUBLIC_LEAFLET_ICON_RETINA_URL ||
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl:
      process.env.NEXT_PUBLIC_LEAFLET_ICON_SHADOW_URL ||
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  },

  // 지도 타일
  TILE: {
    url:
      process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
} as const;
