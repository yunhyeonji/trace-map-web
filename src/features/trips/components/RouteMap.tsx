'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

// Leaflet은 window가 필요해서 클라이언트에서만 불러온다
const RouteMap = dynamic(() => import('./RouteMap.client'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
});

export default RouteMap;
