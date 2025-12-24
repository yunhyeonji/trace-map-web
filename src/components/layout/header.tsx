import React from 'react';

import Image from 'next/image';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import Logo from '@/assets/image/logo.png';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { ThemeToggle } from '../theme/themeToggle';
import { Kbd, KbdGroup } from '../ui/kbd';

const Header = () => {
  return (
    <header className="bg-background/80 sticky top-0 z-30 border-b shadow backdrop-blur">
      <div className="container flex h-(--header-height) items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <Image src={Logo} alt="TraceMap 로고" className="h-9 w-9 rounded-full object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-muted-foreground text-sm font-semibold tracking-tight">
              My Travel Log
            </span>
            <span className="text-base font-semibold tracking-tight">TraceMap</span>
          </div>
        </div>

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
          <Button size="icon-sm" variant="outline" aria-label="새 여행 기록 추가">
            <span className="i-lucide-plus size-4" aria-hidden />
          </Button>
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
