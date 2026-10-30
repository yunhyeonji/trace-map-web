'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

import { CheckCircle2, CircleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list, { id, message, tone }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--tabbar-space)+0.5rem)] z-60 flex flex-col items-center gap-2 px-4 md:bottom-8"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'animate-in fade-in-0 slide-in-from-bottom-2 bg-foreground text-background shadow-lift flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium'
            )}
          >
            {t.tone === 'success' ? (
              <CheckCircle2 className="text-primary-soft size-4" />
            ) : (
              <CircleAlert className="text-highlight size-4" />
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
