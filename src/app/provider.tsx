'use client';
import React from 'react';

import { ThemeProvider } from '@/components/theme/themeProvider';
import { ToastProvider } from '@/components/ui/toast';
import { TripsProvider } from '@/features/trips/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <TripsProvider>{children}</TripsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
