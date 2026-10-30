import React from 'react';

import type { Metadata, Viewport } from 'next';

import Header from '@/components/layout/header';
import TabBar from '@/components/layout/tabBar';

import './globals.css';

import Providers from './provider';

export const metadata: Metadata = {
  title: {
    default: 'TraceMap — 나의 여행 기록장',
    template: '%s · TraceMap',
  },
  description: '다녀온 여행을 사진·동선·이야기로 남기고, 세계 지도를 채워가는 개인 여행 기록장',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1714' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1 pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom))] md:pb-0">
              {children}
            </main>
            <TabBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
