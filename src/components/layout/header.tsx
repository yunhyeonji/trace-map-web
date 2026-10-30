'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Plus, Settings } from 'lucide-react';

import Logo from '@/assets/image/logo.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../theme/themeToggle';

export const NAV_ITEMS = [
  { href: '/', label: '지도' },
  { href: '/trips', label: '기록' },
];

export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

const Header = () => {
  const pathname = usePathname() ?? '/';
  const isEditing = pathname.endsWith('/new') || pathname.endsWith('/edit');
  const [scrolled, setScrolled] = useState(false);

  // 맨 위에서는 배경에 녹아 있다가, 스크롤하면 구분선과 그림자가 생긴다
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'glass sticky top-0 z-40 border-b transition-[border-color,box-shadow] duration-300',
        scrolled
          ? 'border-(--glass-line) shadow-[0_8px_24px_-12px_rgb(0_0_0/0.15)]'
          : 'border-transparent'
      )}
    >
      <div className="container flex h-(--header-height) items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* 투명 배경에 검은 선 로고라 다크 모드에서는 반전해 흰 선으로 보이게 한다 */}
          <Image src={Logo} alt="" className="size-8 object-contain dark:invert" priority />
          <span className="text-headline">TraceMap</span>
        </Link>

        {/* 세그먼트 컨트롤 */}
        <nav className="bg-foreground/[0.06] hidden items-center gap-0.5 rounded-full p-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-subheadline rounded-full px-4 py-1.5 transition-all',
                isActivePath(pathname, item.href)
                  ? 'bg-card text-foreground shadow-[0_1px_3px_rgb(0_0_0/0.12)]'
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
