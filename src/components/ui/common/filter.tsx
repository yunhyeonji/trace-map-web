'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FilterGroup } from '@/service/common';

interface TravelFilterProps {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (type: string, code: string) => void;
}

export const Filter = ({ filterGroups, selectedFilters, onFilterChange }: TravelFilterProps) => {
  return (
    <aside className="sticky top-(--sticky-top) flex h-fit w-full flex-col gap-6 rounded-xl border px-3 py-4 md:w-64">
      <h2 className="font-semibold">검색 필터</h2>
      <Separator />

      {filterGroups.length === 0 ? (
        <span>필터 목록이 없습니다</span>
      ) : (
        filterGroups.map((group) => {
          const currentSelected = selectedFilters[group.type] || [];

          return (
            <div key={group.type} className="flex flex-col gap-4">
              <div>
                <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                  {group.title}
                </h3>
                <div className="grid gap-3">
                  {group.items.map((item) => {
                    const isSelected = currentSelected.includes(item.code);
                    return (
                      <div key={item.code} className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${group.type}-${item.code}`}
                            checked={isSelected}
                            onCheckedChange={() => onFilterChange(group.type, item.code)}
                          />
                          <Label
                            htmlFor={`${group.type}-${item.code}`}
                            className={`cursor-pointer text-sm leading-none font-medium transition-colors ${item.count === 0 && !isSelected ? 'text-muted-foreground/30' : 'text-foreground'}`}
                          >
                            {item.name}
                          </Label>
                        </div>
                        <Badge
                          variant="secondary"
                          className="min-w-5 justify-center px-1.5 py-0 text-[10px]"
                        >
                          {item.count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })
      )}
    </aside>
  );
};
