'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Plus, Settings } from 'lucide-react';

import Logo from '@/assets/image/logo.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../theme/themeToggle';

export const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/trips', label: '기록' },
];

export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

const Header = () => {
  const pathname = usePathname() ?? '/';
  const isEditing = pathname.endsWith('/new') || pathname.endsWith('/edit');

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="container flex h-(--header-height) items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={Logo} alt="" className="size-8 rounded-full object-cover" priority />
          <span className="text-[17px] font-bold tracking-tight">TraceMap</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActivePath(pathname, item.href)
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
            <Link href="/settings" aria-label="데이터 관리">
              <Settings className="size-[1.15rem]" />
            </Link>
          </Button>
          {!isEditing && (
            <Button asChild className="ml-2 hidden md:inline-flex">
              <Link href="/trips/new">
                <Plus />새 기록
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
