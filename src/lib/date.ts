import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: string | null | undefined, dateFormat = 'yyyy.MM.dd') {
  if (!date) return '';
  return format(parseISO(date), dateFormat, { locale: ko });
}

/** 2025.03.14 – 03.18 처럼 같은 해는 줄여서 보여준다 */
export function formatDateRange(start: string, end?: string): string {
  if (!start) return '';
  if (!end || start === end) return formatDate(start);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${formatDate(start)} – ${formatDate(end, sameYear ? 'MM.dd' : 'yyyy.MM.dd')}`;
}

/** 4박 5일 / 당일 */
export function formatDuration(days: number): string {
  if (days <= 1) return '당일';
  return `${days - 1}박 ${days}일`;
}

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
