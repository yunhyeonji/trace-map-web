import * as React from 'react';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * iOS 설정 앱의 inset grouped list.
 * 회색 머리말 → 흰 묶음 → 회색 꼬리말 순서로 쌓인다.
 */
function GroupedSection({
  header,
  footer,
  className,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      {header && (
        <h2 className="text-muted-foreground text-footnote mb-1.5 px-4 uppercase">{header}</h2>
      )}
      <div className="bg-card rounded-xl">{children}</div>
      {footer && <p className="text-muted-foreground text-footnote mt-1.5 px-4">{footer}</p>}
    </section>
  );
}

/** 한 줄. 위쪽 구분선은 왼쪽 여백만큼 들여서 그린다 (첫 줄은 없음) */
function GroupedRow({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative flex min-h-11 items-center gap-3 px-4 py-2.5',
        'before:bg-border before:absolute before:top-0 before:right-0 before:left-4 before:h-px first:before:hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** 누를 수 있는 줄 (오른쪽 꺾쇠) */
function GroupedButtonRow({
  className,
  children,
  chevron = true,
  ...props
}: React.ComponentProps<'button'> & { chevron?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'active:bg-accent relative flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl disabled:opacity-40',
        'before:bg-border before:absolute before:top-0 before:right-0 before:left-4 before:h-px first:before:hidden',
        className
      )}
      {...props}
    >
      {children}
      {chevron && <ChevronRight className="text-muted-foreground/60 ml-auto size-4 shrink-0" />}
    </button>
  );
}

export { GroupedButtonRow, GroupedRow, GroupedSection };
