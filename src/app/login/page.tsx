'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Mail } from 'lucide-react';

import Logo from '@/assets/image/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { OAuthProvider, useAuth } from '@/features/auth/AuthProvider';

const PROVIDERS: { id: OAuthProvider; label: string; className?: string }[] = [
  { id: 'google', label: 'Google로 계속하기' },
  {
    id: 'kakao',
    label: '카카오로 계속하기',
    className: 'border-0 bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90',
  },
];

export default function LoginPage() {
  const { enabled, ready, user, signInWithOAuth, signInWithEmail } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace('/settings');
  }, [ready, user, router]);

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    try {
      await task();
    } catch (e) {
      toast(e instanceof Error ? e.message : '로그인하지 못했습니다', 'error');
      setBusy(null);
    }
  };

  return (
    <div className="container flex max-w-sm flex-col items-center py-12 md:py-20">
      <Image src={Logo} alt="" className="size-14 object-contain dark:invert" />
      <h1 className="text-title2 mt-4">TraceMap 로그인</h1>
      <p className="text-muted-foreground text-subheadline mt-1.5 text-center">
        로그인하면 기록이 계정에 저장되어
        <br />
        다른 기기에서도 이어서 볼 수 있어요.
      </p>

      {!enabled ? (
        <p className="bg-card text-muted-foreground text-footnote mt-8 rounded-xl p-4 text-center">
          로그인 서버가 설정되지 않았습니다. 지금은 이 브라우저에만 기록이 저장됩니다.
        </p>
      ) : sentTo ? (
        <div className="bg-card mt-8 w-full rounded-xl p-5 text-center">
          <Mail className="text-primary mx-auto size-8" />
          <p className="text-headline mt-3">메일을 확인해 주세요</p>
          <p className="text-muted-foreground text-footnote mt-1">
            {sentTo}로 보낸 링크를 누르면 로그인됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex w-full flex-col gap-2.5">
          {PROVIDERS.map((p) => (
            <Button
              key={p.id}
              size="lg"
              variant="outline"
              disabled={!!busy}
              className={p.className}
              onClick={() => run(p.id, () => signInWithOAuth(p.id))}
            >
              {busy === p.id ? '이동 중…' : p.label}
            </Button>
          ))}

          <div className="my-3 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-footnote">또는</span>
            <Separator className="flex-1" />
          </div>

          <form
            className="flex flex-col gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              const value = email.trim();
              if (!value) return;
              run('email', async () => {
                await signInWithEmail(value);
                setSentTo(value);
                setBusy(null);
              });
            }}
          >
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg" variant="soft" disabled={!!busy}>
              {busy === 'email' ? '보내는 중…' : '이메일로 로그인 링크 받기'}
            </Button>
          </form>
        </div>
      )}

      <Link href="/" className="text-primary text-subheadline mt-8">
        로그인 없이 계속하기
      </Link>
    </div>
  );
}
