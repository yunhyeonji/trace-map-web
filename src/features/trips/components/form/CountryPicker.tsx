'use client';

import { useMemo, useState } from 'react';

import { Check, ChevronDown, Search } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COUNTRIES, flagEmoji, getCountry } from '@/lib/countries';
import { cn } from '@/lib/utils';

interface CountryPickerProps {
  value: string;
  onChange: (code: string) => void;
  invalid?: boolean;
}

export default function CountryPicker({ value, onChange, invalid }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = getCountry(value);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.includes(q) || c.en.toLowerCase().includes(q) || c.code.toLowerCase() === q
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'bg-card border-input focus-visible:border-ring focus-visible:ring-ring/20 flex h-11 w-full items-center gap-2 rounded-xl border px-3.5 text-left text-base outline-none focus-visible:ring-4 md:text-sm',
            invalid && 'border-destructive'
          )}
        >
          {selected ? (
            <>
              <span className="text-lg leading-none">{flagEmoji(selected.code)}</span>
              <span className="font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">나라 선택</span>
          )}
          <ChevronDown className="text-muted-foreground ml-auto size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 rounded-2xl p-0"
      >
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="text-muted-foreground size-4" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="나라 검색"
            className="h-11 flex-1 bg-transparent text-base outline-none md:text-sm"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {list.length === 0 && (
            <li className="text-muted-foreground px-3 py-6 text-center text-sm">
              찾는 나라가 없어요
            </li>
          )}
          {list.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQuery('');
                }}
                className="hover:bg-accent flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm"
              >
                <span className="text-lg leading-none">{flagEmoji(c.code)}</span>
                <span className="flex-1">{c.name}</span>
                {c.code === value && <Check className="text-primary size-4" />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
