'use client';
import React, { use, useMemo, useState } from 'react';

import Link from 'next/link';

import { Filter } from '@/components/ui/common/filter';
import { CommonResponse } from '@/service/common';
import { Travel } from '@/service/travelsList/types';

import { TravelCard } from './TravelCard';

interface Props {
  promiseTravels: Promise<CommonResponse<Travel[]>>;
}

const TravelsSuspence = ({ promiseTravels }: Props) => {
  const data = use(promiseTravels);
  const initialFilters = data?.metadata?.filters;

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // 필터링 로직
  const filteredTravels = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((t) => {
      return Object.entries(selectedFilters).every(([type, codes]) => {
        if (codes.length === 0) return true;
        if (type === 'country') return codes.includes(t.countryCode);
        return true;
      });
    });
  }, [data?.data, selectedFilters]);

  // 2. 실시간 개수가 반영된 필터 그룹 생성 (사이드바 렌더링용)
  const dynamicFilters = useMemo(() => {
    if (!initialFilters || !data?.data) return [];

    return initialFilters.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        const count = data.data.filter((t) => {
          const otherFilters = Object.entries(selectedFilters).filter(
            ([type]) => type !== group.type
          );

          const passOtherFilters = otherFilters.every(([type, codes]) => {
            if (codes.length === 0) return true;
            if (type === 'country') return codes.includes(t.countryCode);
            return true;
          });

          if (!passOtherFilters) return false;
          if (group.type === 'country') return t.countryCode === item.code;

          return true;
        }).length;

        return { ...item, count };
      }),
    }));
  }, [data?.data, selectedFilters, initialFilters]);

  // 통합 핸들러
  const handleFilterChange = (type: string, code: string) => {
    setSelectedFilters((prev) => {
      const prevList = prev[type] || [];
      const newList = prevList.includes(code)
        ? prevList.filter((c) => c !== code)
        : [...prevList, code];

      return { ...prev, [type]: newList };
    });
  };

  return (
    <div className="flex flex-col gap-8 py-6 md:flex-row">
      {/* --- 분리된 필터 컴포넌트 연결 --- */}
      <Filter
        filterGroups={dynamicFilters ?? []}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
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
