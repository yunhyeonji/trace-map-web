import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: string | number | Date | null, dateFormat = 'yyyy.MM.dd') {
  if (!date) return '';
  return format(new Date(date), dateFormat, { locale: ko });
}

export function formatDateRange(
  start: string | number | Date | null,
  end: string | number | Date | null
): string {
  if (!start) return '';
  const startFormatted = formatDate(start);
  if (!end || start === end) return startFormatted;
  const endFormatted = formatDate(end);
  return `${startFormatted} - ${endFormatted}`;
}
