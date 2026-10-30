'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BookOpen, Map, Plus, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

import { isActivePath } from './header';

const TABS = [
  { href: '/', label: '지도', icon: Map },
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
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10.5px] font-semibold transition-all active:scale-95',
          active ? 'bg-foreground/[0.07] text-foreground' : 'text-muted-foreground'
        )}
      >
        <Icon className="size-[22px]" strokeWidth={active ? 2.3 : 1.8} />
        {label}
      </Link>
    );
  };

  // 화면 아래에 떠 있는 글래스 캡슐
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-40 flex justify-center px-4 md:hidden">
      <div className="glass pointer-events-auto flex h-(--tabbar-height) w-full max-w-sm items-stretch gap-1 rounded-full border border-(--glass-line) p-1.5 shadow-(--glass-shadow)">
        {tab(home!)}
        {tab(trips!)}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/trips/new"
            aria-label="새 기록"
            className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full shadow-[0_6px_16px_-4px_var(--primary)] transition-transform active:scale-90"
          >
            <Plus className="size-6" strokeWidth={2.4} />
          </Link>
        </div>
        {tab(settings!)}
      </div>
    </nav>
  );
}
