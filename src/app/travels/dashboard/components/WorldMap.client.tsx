'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { TravelCard } from '@/app/travels/list/components/TravelCard';
import WorldMap, { Geo } from '@/components/ui/common/WorldMap';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { getCountryCode } from '@/lib/countryMapping';
import { Travel } from '@/service/travelsList/types';

interface WorldMapClientProps {
  visitedCodes: string[];
  travels: Travel[];
}

export default function WorldMapClient({ visitedCodes, travels }: WorldMapClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(
    null
  );

  // 선택된 국가의 여행들만 필터링
  const filteredTravels = travels.filter((t) => t.countryCode === selectedCountry?.code);

  const handleCountryClick = (geo: Geo) => {
    const countryName = geo.properties.name || geo.properties.NAME || '알 수 없음';
    const code = getCountryCode(countryName);
    if (code && visitedCodes.includes(code)) {
      setSelectedCountry({ code, name: countryName });
    }
  };

  return (
    <>
      <div className="h-125 w-full">
        <WorldMap visitedCodes={visitedCodes} onCountryClick={handleCountryClick} />
      </div>

      <Drawer open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        <DrawerContent className="max-h-[60vh]">
          <div className="w-full p-6">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold">
                {selectedCountry?.name} 여행 기록 ({filteredTravels.length}개)
              </DrawerTitle>
            </DrawerHeader>
            {filteredTravels.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                해당 국가의 여행 기록이 없습니다.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto pb-4">
                <div className="flex min-w-max gap-4">
                  {filteredTravels.map((travel) => (
                    <Link key={travel.id} href={`/travels/${travel.id}`} className="w-80 shrink-0">
                      <TravelCard travel={travel} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
