import React from 'react';

import { cn } from '@/lib/utils';

/** iOS의 Large Title. 오른쪽에 보조 동작을 둘 수 있다 */
export default function PageTitle({
  title,
  subtitle,
  trailing,
  className,
}: {
  title: string;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h1 className="text-large-title">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-subheadline mt-1">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
