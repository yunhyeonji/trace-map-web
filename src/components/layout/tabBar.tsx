'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BookOpen, Map, Plus, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

import { isActivePath } from './header';

const TABS = [
  { href: '/', label: '홈', icon: Map },
  { href: '/trips', label: '기록', icon: BookOpen },
  { href: '/settings', label: '설정', icon: Settings },
];

/** 모바일 하단 탭바. 작성/수정 화면에서는 저장 바에 자리를 내준다 */
export default function TabBar() {
  const pathname = usePathname() ?? '/';
  if (pathname.endsWith('/new') || pathname.endsWith('/edit')) return null;

  const [home, trips, settings] = TABS;

  const tab = ({ href, label, icon: Icon }: (typeof TABS)[number]) => {
    const active = isActivePath(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
          active ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-background/90 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex h-(--tabbar-height) items-stretch px-2">
        {tab(home!)}
        {tab(trips!)}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/trips/new"
            aria-label="새 기록"
            className="bg-primary text-primary-foreground shadow-lift flex size-12 items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <Plus className="size-6" />
          </Link>
        </div>
        {tab(settings!)}
      </div>
    </nav>
  );
}
