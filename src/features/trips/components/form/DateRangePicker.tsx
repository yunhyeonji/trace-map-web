'use client';

import { useState } from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateRange, formatDuration, today } from '@/lib/date';
import { cn } from '@/lib/utils';

import { tripDays } from '../../stats';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const toKey = (d: Date) => format(d, 'yyyy-MM-dd');

interface DateRangePickerProps {
  id?: string;
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

/** 여행 기간을 달력 하나로 고른다. 첫 클릭은 출발일, 두 번째 클릭은 도착일 */
export default function DateRangePicker({
  id,
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(parseISO(startDate || today())));
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<'days' | 'months'>('days');
  // 떠난 날만 고르고 돌아온 날을 기다리는 중인지
  const picking = !!startDate && !endDate && open;

  const handleOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setMonth(startOfMonth(parseISO(startDate || today())));
      setView('days');
    }
    setHover(null);
  };

  const pick = (key: string) => {
    if (!startDate || endDate || key < startDate) {
      onChange({ startDate: key, endDate: '' });
      return;
    }
    // 같은 날을 다시 누르면 당일치기
    onChange({ startDate, endDate: key === startDate ? '' : key });
    setOpen(false);
  };

  const days = startDate ? tripDays({ startDate, endDate: endDate || undefined }) : 0;

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'text-body tabular flex items-center gap-1 outline-none',
            open ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {startDate
            ? `${formatDateRange(startDate, endDate || undefined)} (${formatDuration(days)})`
            : '선택'}
          <ChevronsUpDown className="size-3.5 opacity-60" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-auto max-w-[calc(100vw-2rem)] rounded-xl p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
          <p className="text-subheadline text-muted-foreground">
            {!startDate || endDate ? '출발일 선택' : '도착일 선택'}
          </p>
          {startDate && (
            <button
              type="button"
              onClick={() => onChange({ startDate: '', endDate: '' })}
              className="text-primary text-subheadline"
            >
              지우기
            </button>
          )}
        </div>

        {view === 'months' ? (
          <MonthGrid
            value={month}
            onSelect={(m) => {
              setMonth(m);
              setView('days');
            }}
          />
        ) : (
          <div className="flex gap-6 p-4" onMouseLeave={() => setHover(null)}>
            <Month
              month={month}
              startDate={startDate}
              endDate={endDate}
              hover={picking ? hover : null}
              onPick={pick}
              onHover={setHover}
              onTitleClick={() => setView('months')}
              prev={() => setMonth((m) => addMonths(m, -1))}
              next={() => setMonth((m) => addMonths(m, 1))}
              hideNextOnWide
            />
            <div className="hidden sm:block">
              <Month
                month={addMonths(month, 1)}
                startDate={startDate}
                endDate={endDate}
                hover={picking ? hover : null}
                onPick={pick}
                onHover={setHover}
                onTitleClick={() => setView('months')}
                next={() => setMonth((m) => addMonths(m, 1))}
              />
            </div>
          </div>
        )}

        {/* 하단 */}
        <div className="flex items-center justify-between gap-2 border-t px-4 py-2.5">
          <button
            type="button"
            onClick={() => {
              setMonth(startOfMonth(new Date()));
              setView('days');
            }}
            className="text-primary text-subheadline"
          >
            오늘
          </button>
          {picking && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-primary text-subheadline font-semibold"
            >
              당일로 완료
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MonthProps {
  month: Date;
  startDate: string;
  endDate: string;
  hover: string | null;
  onPick: (key: string) => void;
  onHover: (key: string) => void;
  onTitleClick: () => void;
  prev?: () => void;
  next?: () => void;
  /** 두 달이 보이는 넓은 화면에서는 다음 버튼을 오른쪽 달에 둔다 */
  hideNextOnWide?: boolean;
}

function Month({
  month,
  startDate,
  endDate,
  hover,
  onPick,
  onHover,
  onTitleClick,
  prev,
  next,
  hideNextOnWide,
}: MonthProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });
  // 돌아온 날을 고르는 중이면 마우스 위치까지 미리 칠해준다
  const rangeEnd = endDate || (hover && hover > startDate ? hover : '');

  return (
    <div className="w-[17.5rem]">
      <div className="mb-3 flex h-8 items-center justify-between">
        <NavButton label="이전 달" onClick={prev} />
        <button
          type="button"
          onClick={onTitleClick}
          className="hover:bg-accent text-headline tabular rounded-full px-3 py-1"
        >
          {format(month, 'yyyy년 M월')}
        </button>
        <NavButton
          label="다음 달"
          onClick={next}
          className={hideNextOnWide ? 'sm:invisible' : undefined}
          right
        />
      </div>

      <div className="text-caption grid grid-cols-7 text-center font-semibold">
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            className={cn(
              'py-1.5',
              i === 0 ? 'text-highlight' : i === 6 ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = toKey(day);
          const outside = !isSameMonth(day, month);
          if (outside) return <span key={key} className="h-10" />;

          const isStart = key === startDate;
          const isEnd = key === rangeEnd;
          const inRange = !!startDate && !!rangeEnd && key > startDate && key < rangeEnd;
          const hasRange = !!startDate && !!rangeEnd;
          const weekday = day.getDay();

          return (
            <div
              key={key}
              className={cn(
                'relative h-10',
                // 기간 띠
                inRange && 'bg-primary-soft',
                inRange && weekday === 0 && 'rounded-l-full',
                inRange && weekday === 6 && 'rounded-r-full',
                isStart &&
                  hasRange &&
                  'to-primary-soft bg-gradient-to-r from-transparent from-50% to-50%',
                isEnd &&
                  hasRange &&
                  'from-primary-soft bg-gradient-to-r from-50% to-transparent to-50%'
              )}
            >
              <button
                type="button"
                onClick={() => onPick(key)}
                onMouseEnter={() => onHover(key)}
                className={cn(
                  'tabular text-body relative mx-auto flex size-10 items-center justify-center rounded-full transition-colors',
                  isStart || isEnd
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'hover:bg-accent',
                  !(isStart || isEnd) && !inRange && weekday === 0 && 'text-highlight',
                  inRange && 'text-primary font-semibold'
                )}
              >
                {day.getDate()}
                {isToday(day) && !(isStart || isEnd) && (
                  <span className="bg-primary absolute bottom-1.5 size-1 rounded-full" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  right,
  className,
}: {
  label: string;
  onClick?: () => void;
  right?: boolean;
  className?: string;
}) {
  if (!onClick) return <span className="size-8" />;
  const Icon = right ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'text-muted-foreground hover:bg-accent hover:text-foreground flex size-8 items-center justify-center rounded-full',
        className
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

/** 연·월을 빠르게 옮기는 화면 (몇 년 전 여행을 기록할 때) */
function MonthGrid({ value, onSelect }: { value: Date; onSelect: (month: Date) => void }) {
  const [year, setYear] = useState(value.getFullYear());
  const now = new Date();

  return (
    <div className="w-[17.5rem] p-4 sm:w-[37rem]">
      <div className="mb-3 flex h-8 items-center justify-between">
        <NavButton label="이전 해" onClick={() => setYear((y) => y - 1)} />
        <span className="text-headline tabular">{year}년</span>
        <NavButton label="다음 해" onClick={() => setYear((y) => y + 1)} right />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 12 }, (_, m) => {
          const selected = year === value.getFullYear() && m === value.getMonth();
          const current = year === now.getFullYear() && m === now.getMonth();
          return (
            <button
              key={m}
              type="button"
              onClick={() => onSelect(new Date(year, m, 1))}
              className={cn(
                'text-subheadline h-11 rounded-xl transition-colors',
                selected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                current && !selected && 'text-primary font-bold'
              )}
            >
              {m + 1}월
            </button>
          );
        })}
      </div>
    </div>
  );
}
