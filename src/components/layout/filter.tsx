'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TravelListResponse } from '@/service/travels/types';

interface TravelFilterProps {
  filters: TravelListResponse['filters'];
  selectedCountries: string[];
  selectedYears: string[];
  // 실시간으로 계산된 개수들
  countryCounts: Record<string, number>;
  yearCounts: Record<string, number>;
  onCountryChange: (code: string) => void;
  onYearChange: (year: string) => void;
}

export const Filter = ({
  filters,
  selectedCountries,
  selectedYears,
  countryCounts,
  yearCounts,
  onCountryChange,
  onYearChange,
}: TravelFilterProps) => {
  return (
    <aside className="sticky top-(--sticky-top) flex h-fit w-full flex-col gap-6 rounded-xl border px-3 py-4 md:w-64">
      <h2 className="font-semibold">검색 필터</h2>
      <Separator />
      <div>
        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">여행 국가</h3>
        <div className="grid gap-3">
          {filters.countries.map((c) => {
            const count = countryCounts[c.code] || 0;
            return (
              <div key={c.code} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${c.code}`}
                    checked={selectedCountries.includes(c.code)}
                    onCheckedChange={() => onCountryChange(c.code)}
                  />
                  <Label
                    htmlFor={`country-${c.code}`}
                    className={`cursor-pointer text-sm leading-none font-medium transition-colors ${count === 0 && !selectedCountries.includes(c.code) ? 'text-muted-foreground/50' : ''}`}
                  >
                    {c.name}
                  </Label>
                </div>
                <Badge
                  variant="secondary"
                  className="min-w-5 justify-center px-1.5 py-0 text-[10px]"
                >
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">여행 연도</h3>
        <div className="grid gap-3">
          {filters.years.map((y) => {
            const count = yearCounts[y.year] || 0;
            return (
              <div key={y.year} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${y.year}`}
                    checked={selectedYears.includes(y.year)}
                    onCheckedChange={() => onYearChange(y.year)}
                  />
                  <Label
                    htmlFor={`year-${y.year}`}
                    className={`cursor-pointer text-sm leading-none font-medium transition-colors ${count === 0 && !selectedYears.includes(y.year) ? 'text-muted-foreground/50' : ''}`}
                  >
                    {y.year}년
                  </Label>
                </div>
                <Badge
                  variant="secondary"
                  className="min-w-[20px] justify-center px-1.5 py-0 text-[10px]"
                >
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
