'use client';
import React, { use, useMemo, useState } from 'react';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TravelListResponse } from '@/service/travels/types';

import { TravelCard } from './TravelCard';

interface Props {
  promiseTravels: Promise<TravelListResponse>;
}

const TravelsSuspence = ({ promiseTravels }: Props) => {
  const { travels, filters } = use(promiseTravels);

  // 1. 필터 상태 관리
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  // 2. 필터링된 데이터 계산
  const filteredTravels = useMemo(() => {
    return travels.filter((travel) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        (travel.countryCode && selectedCountries.includes(travel.countryCode));

      const year = travel.date?.start ? new Date(travel.date.start).getFullYear().toString() : null;
      const yearMatch = selectedYears.length === 0 || (year && selectedYears.includes(year));

      return countryMatch && yearMatch;
    });
  }, [travels, selectedCountries, selectedYears]);

  // 필터 핸들러
  const toggleFilter = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setList((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  return (
    <div className="flex flex-col gap-8 py-6 md:flex-row">
      {/* --- 좌측 필터 사이드바 --- */}
      <aside className="sticky top-(--sticky-top) flex h-fit w-full flex-col gap-6 rounded-xl border px-3 py-2 md:w-64">
        <h2 className="font-semibold">검색 필터</h2>
        <Separator />

        <div>
          <h3 className="mb-4 text-sm font-semibold">여행 국가</h3>
          <div className="grid gap-3">
            {filters.countries.map((c) => (
              <div key={c.code} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${c.code}`}
                    checked={selectedCountries.includes(c.code)}
                    onCheckedChange={() =>
                      toggleFilter(selectedCountries, setSelectedCountries, c.code)
                    }
                  />
                  <Label
                    htmlFor={`country-${c.code}`}
                    className="cursor-pointer text-sm leading-none font-medium"
                  >
                    {c.name}
                  </Label>
                </div>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {c.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">여행 연도</h3>
          <div className="grid gap-3">
            {filters.years.map((y) => (
              <div key={y.year} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${y.year}`}
                    checked={selectedYears.includes(y.year)}
                    onCheckedChange={() => toggleFilter(selectedYears, setSelectedYears, y.year)}
                  />
                  <Label
                    htmlFor={`year-${y.year}`}
                    className="cursor-pointer text-sm leading-none font-medium"
                  >
                    {y.year}년
                  </Label>
                </div>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {y.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* --- 우측 리스트 영역 --- */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-muted-foreground mb-2 text-sm">
          총 <strong>{filteredTravels.length}</strong>개의 기록
        </div>

        {filteredTravels.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border border-dashed py-20 text-center">
            해당 조건에 맞는 여행 기록이 없어요.
          </div>
        ) : (
          filteredTravels.map((travel) => (
            <Link key={travel.id} href={`travels/${travel.id}`}>
              <TravelCard travel={travel} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TravelsSuspence;
