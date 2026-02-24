'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

import Logo from '@/assets/image/logo.png';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { ThemeToggle } from '../theme/themeToggle';
import { Kbd, KbdGroup } from '../ui/kbd';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 sticky top-0 z-30 border-b shadow backdrop-blur">
      {/* 모바일 헤더 */}
      <div className="container flex h-(--header-height) items-center gap-2 px-3 md:hidden">
        <Link href="/travels/bashboard" className="flex min-w-0 items-center gap-2">
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Image src={Logo} alt="TraceMap 로고" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
              TraceMap
            </span>
          </div>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button size="icon-sm" variant="ghost" aria-label="검색">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="새 여행 기록 추가">
            <PlusIcon className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button size="icon-sm" variant="ghost" aria-label="프로필">
            <div className="bg-muted flex size-7 items-center justify-center rounded-full text-xs font-medium">
              TM
            </div>
          </Button>
        </div>
      </div>

      {/* 데스크톱 헤더 */}
      <div className="container hidden h-(--header-height) items-center gap-4 md:flex">
        <Link href="/travels/bashboard" className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <Image src={Logo} alt="TraceMap 로고" className="h-9 w-9 rounded-full object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-muted-foreground text-sm font-semibold tracking-tight">
              My Travel Log
            </span>
            <span className="text-base font-semibold tracking-tight">TraceMap</span>
          </div>
        </Link>

        <div className="ml-6 max-w-xl flex-1">
          <InputGroup className="bg-muted/60 text-muted-foreground focus-within:bg-background focus-within:text-foreground h-12 rounded-full">
            <InputGroupInput
              placeholder="여행 기록, 도시, 친구를 검색해보세요"
              className="placeholder:text-muted-foreground/70 px-3 text-sm"
            />
            <InputGroupAddon align="inline-end">
              <KbdGroup>
                <Kbd className="bg-secondary text-muted-foreground/80 flex h-7 gap-1 rounded-full px-3 text-[11px]">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Search</span>
                </Kbd>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {pathname === '/travels/list/create' ? (
            <div className="bg-muted h-8 w-8 rounded-full" />
          ) : (
            <Link
              href="/travels/list/create"
              className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-full p-2"
            >
              <PlusIcon className="h-4 w-4" />
            </Link>
          )}
          <ThemeToggle />
          <Button size="icon-sm" variant="ghost" aria-label="프로필">
            <div className="bg-muted flex size-7 items-center justify-center rounded-full text-xs font-medium">
              TM
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
