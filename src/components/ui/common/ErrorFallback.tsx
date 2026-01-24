'use client';

import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="bg-destructive/5 border-destructive/20 mt-(--sticky-top) flex flex-col items-center justify-center rounded-xl border py-20">
      <p className="text-destructive mb-2 font-semibold">데이터를 불러오지 못했습니다.</p>
      <p className="text-muted-foreground mb-6 text-sm">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button
        onClick={() => {
          resetErrorBoundary();
          window.location.reload();
        }}
        className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white shadow-sm transition-colors"
      >
        다시 시도하기
      </button>
    </div>
  );
}
