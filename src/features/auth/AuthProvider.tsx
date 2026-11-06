'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type OAuthProvider = 'google' | 'kakao';

interface AuthContextValue {
  /** Supabase 환경 변수가 설정되어 로그인할 수 있는지 */
  enabled: boolean;
  /** 저장된 세션을 확인했는지. 그 전에는 로컬/원격 중 어디서 읽을지 모른다 */
  ready: boolean;
  user: User | null;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 로그인 후 돌아올 곳. 세션 코드는 supabase 클라이언트가 URL에서 읽어 처리한다
const redirectTo = () => `${window.location.origin}/settings`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (alive) setUser(data.session?.user ?? null);
      })
      .catch((error) => console.error('로그인 세션을 확인하지 못했습니다', error))
      .finally(() => alive && setReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // 토큰 갱신 때마다 객체가 바뀌므로 사용자가 같으면 그대로 둔다
      setUser((prev) => (prev?.id === session?.user.id ? prev : (session?.user ?? null)));
      setReady(true);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo() },
    });
    if (error) throw error;
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({ enabled: !!supabase, ready, user, signInWithOAuth, signInWithEmail, signOut }),
    [ready, user, signInWithOAuth, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return ctx;
}
