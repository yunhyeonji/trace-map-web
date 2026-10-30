'use client';

import { useMemo, useState } from 'react';

import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { COUNTRIES, flagEmoji, getCountry } from '@/lib/countries';

interface CountryPickerProps {
  id?: string;
  value: string;
  onChange: (code: string) => void;
}

/**
 * 그룹 목록의 한 줄 오른쪽에 들어가는 값 버튼 (iOS 설정의 선택 항목처럼).
 * 데스크톱은 팝오버, 모바일은 하단 시트로 연다. 모바일 팝오버는 키보드가 올라오면
 * 화면이 줄어 목록 위쪽(검색창)이 잘린다.
 */
export default function CountryPicker({ id, value, onChange }: CountryPickerProps) {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = getCountry(value);

  const handleOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery('');
  };

  const trigger = (
    <button
      id={id}
      type="button"
      className="text-body text-muted-foreground focus-visible:text-foreground flex items-center gap-1 outline-none"
    >
      {selected ? `${flagEmoji(selected.code)} ${selected.name}` : '선택'}
      <ChevronsUpDown className="size-3.5 opacity-60" />
    </button>
  );

  const list = (
    <CountryList
      query={query}
      onQueryChange={setQuery}
      value={value}
      // 모바일에서 자동 포커스하면 키보드가 시트를 덮는다
      autoFocus={isDesktop}
      onSelect={(code) => {
        onChange(code);
        handleOpen(false);
      }}
    />
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align="end" className="flex max-h-96 w-72 flex-col rounded-xl p-0">
          {list}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="flex h-[80dvh] flex-col">
        <DrawerTitle className="text-headline py-3 text-center">나라</DrawerTitle>
        {list}
      </DrawerContent>
    </Drawer>
  );
}

function CountryList({
  query,
  onQueryChange,
  value,
  autoFocus,
  onSelect,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  value: string;
  autoFocus: boolean;
  onSelect: (code: string) => void;
}) {
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.includes(q) || c.en.toLowerCase().includes(q) || c.code.toLowerCase() === q
    );
  }, [query]);

  return (
    <>
      {/* iOS 검색 필드: 목록이 스크롤돼도 위에 고정 */}
      <div className="shrink-0 px-3 pt-1 pb-2">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <input
            autoFocus={autoFocus}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="검색"
            className="bg-foreground/[0.06] placeholder:text-muted-foreground text-body h-9 w-full rounded-[10px] pr-3 pl-8 outline-none [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {list.length === 0 && (
          <li className="text-muted-foreground text-subheadline px-3 py-6 text-center">
            결과 없음
          </li>
        )}
        {list.map((c) => (
          <li key={c.code}>
            <button
              type="button"
              onClick={() => onSelect(c.code)}
              className="hover:bg-accent active:bg-accent text-body flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left"
            >
              <span className="text-xl leading-none">{flagEmoji(c.code)}</span>
              <span className="flex-1">{c.name}</span>
              {c.code === value && <Check className="text-primary size-4" strokeWidth={2.5} />}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
