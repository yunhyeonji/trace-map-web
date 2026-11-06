'use client';
import React from 'react';

import { ThemeProvider } from '@/components/theme/themeProvider';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/features/auth/AuthProvider';
import LocalMigrationPrompt from '@/features/auth/LocalMigrationPrompt';
import { TripsProvider } from '@/features/trips/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <AuthProvider>
          <TripsProvider>
            {children}
            <LocalMigrationPrompt />
          </TripsProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
