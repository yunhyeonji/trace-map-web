import React from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** iOS ContentUnavailableView처럼 아이콘·제목·설명·동작만 가운데에 둔다 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-20 text-center', className)}>
      <div className="text-muted-foreground/70 mb-3 [&_svg]:size-11 [&_svg]:stroke-[1.5]">
        {icon}
      </div>
      <p className="text-title3">{title}</p>
      {description && (
        <p className="text-muted-foreground text-subheadline mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
