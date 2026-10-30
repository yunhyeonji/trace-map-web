import React from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center',
        className
      )}
    >
      <div className="bg-primary-soft text-primary mb-4 flex size-12 items-center justify-center rounded-full">
        {icon}
      </div>
      <p className="font-bold">{title}</p>
      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-xs text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
