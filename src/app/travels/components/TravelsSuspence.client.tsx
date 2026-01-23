'use client';
import React, { use, useMemo, useState } from 'react';

import Link from 'next/link';

import { Filter } from '@/components/layout/filter';
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

  // 2. 최종적으로 화면에 렌더링할 필터링된 리스트
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

  // 3. 실시간 필터 개수 집계 (Faceted Search 로직)
  const { countryCounts, yearCounts } = useMemo(() => {
    const cCounts: Record<string, number> = {};
    const yCounts: Record<string, number> = {};

    // 초기값 세팅 (모든 필터를 0으로 초기화)
    filters.countries.forEach((c) => (cCounts[c.code] = 0));
    filters.years.forEach((y) => (yCounts[y.year] = 0));

    // '현재 필터링된 결과물'을 돌면서 개수를 셉니다.
    filteredTravels.forEach((t) => {
      if (t.countryCode) {
        cCounts[t.countryCode] = (cCounts[t.countryCode] || 0) + 1;
      }
      if (t.date?.start) {
        const y = new Date(t.date.start).getFullYear().toString();
        yCounts[y] = (yCounts[y] || 0) + 1;
      }
    });

    return { countryCounts: cCounts, yearCounts: yCounts };
  }, [filteredTravels, filters]);

  // 필터 토글 핸들러
  const handleCountryToggle = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((i) => i !== code) : [...prev, code]
    );
  };

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((i) => i !== year) : [...prev, year]
    );
  };

  return (
    <div className="flex flex-col gap-8 py-6 md:flex-row">
      {/* --- 분리된 필터 컴포넌트 연결 --- */}
      <Filter
        filters={filters}
        selectedCountries={selectedCountries}
        selectedYears={selectedYears}
        countryCounts={countryCounts}
        yearCounts={yearCounts}
        onCountryChange={handleCountryToggle}
        onYearChange={handleYearToggle}
      />

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
            <Link key={travel.id} href={`/travels/${travel.id}`}>
              <TravelCard travel={travel} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TravelsSuspence;
