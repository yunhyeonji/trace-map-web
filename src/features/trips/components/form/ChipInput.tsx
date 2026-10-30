'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ChipInputProps {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  prefix?: string;
}

/** Enter나 쉼표로 항목을 추가하는 입력 */
export default function ChipInput({ id, values, onChange, placeholder, prefix }: ChipInputProps) {
  const [text, setText] = useState('');

  const commit = () => {
    const next = text
      .split(',')
      .map((s) => s.trim().replace(/^#/, ''))
      .filter((s) => s && !values.includes(s));
    if (next.length) onChange([...values, ...next]);
    setText('');
  };

  return (
    <div
      className={cn(
        'bg-card border-input focus-within:border-ring focus-within:ring-ring/20 flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border px-2 py-1.5 focus-within:ring-4'
      )}
    >
      {values.map((v) => (
        <span
          key={v}
          className="bg-muted inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-[13px] font-medium"
        >
          {prefix}
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="text-muted-foreground hover:bg-background hover:text-foreground rounded-full p-0.5"
            aria-label={`${v} 삭제`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Backspace' && !text && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length ? '' : placeholder}
        className="min-w-28 flex-1 bg-transparent px-1.5 text-base outline-none md:text-sm"
      />
    </div>
  );
}
