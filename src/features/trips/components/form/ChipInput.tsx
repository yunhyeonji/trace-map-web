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

  const commit = (raw = text) => {
    const next = raw
      .split(',')
      .map((s) => s.trim().replace(/^#/, ''))
      .filter((s, i, arr) => s && !values.includes(s) && arr.indexOf(s) === i);
    if (next.length) onChange([...values, ...next]);
    setText('');
  };

  return (
    <div className={cn('flex min-h-11 w-full min-w-0 flex-wrap items-center gap-1.5 py-1.5')}>
      {values.map((v) => (
        <span
          key={v}
          className="bg-muted text-footnote inline-flex max-w-full min-w-0 items-center gap-1 rounded-full py-1 pr-1 pl-2.5"
        >
          <span className="truncate">
            {prefix}
            {v}
          </span>
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
        onChange={(e) => {
          // 한글 입력 중에는 keydown으로 쉼표를 못 잡아서 값에서 직접 나눈다
          const value = e.target.value;
          const cut = value.lastIndexOf(',');
          if (cut === -1) {
            setText(value);
            return;
          }
          commit(value.slice(0, cut));
          setText(value.slice(cut + 1));
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Backspace' && !text && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={() => commit()}
        placeholder={values.length ? '' : placeholder}
        size={1}
        // 기본 너비(size=20)가 모바일에서 박스를 밀어내지 않도록 0에서 시작해 남은 공간만 채운다
        className="text-body placeholder:text-muted-foreground h-7 w-0 min-w-20 flex-1 bg-transparent outline-none"
      />
    </div>
  );
}
