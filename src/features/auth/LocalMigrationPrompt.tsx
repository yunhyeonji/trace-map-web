'use client';

import { useEffect, useState } from 'react';

import ConfirmAlert from '@/components/ui/confirm-alert';
import { useToast } from '@/components/ui/toast';
import { useTrips } from '@/features/trips/store';

import { useAuth } from './AuthProvider';

const dismissKey = (userId: string) => `tracemap:skip-upload:${userId}`;

/** 로그인했는데 이 기기에 남은 기록이 있으면 계정으로 옮길지 한 번 묻는다 */
export default function LocalMigrationPrompt() {
  const { user } = useAuth();
  const { mode, localTripCount, uploadLocalTrips } = useTrips();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== 'remote' || !user || !localTripCount) return setOpen(false);
    let skipped = false;
    try {
      skipped = sessionStorage.getItem(dismissKey(user.id)) === '1';
    } catch {
      // 저장소를 못 쓰면 매번 묻는다
    }
    setOpen(!skipped);
  }, [mode, user, localTripCount]);

  const close = (next: boolean) => {
    if (next || busy) return;
    setOpen(false);
    // "취소"를 누르면 이번 접속 동안은 다시 묻지 않는다
    try {
      if (user) sessionStorage.setItem(dismissKey(user.id), '1');
    } catch {
      // 기억하지 못해도 동작에는 문제없다
    }
  };

  return (
    <ConfirmAlert
      open={open}
      onOpenChange={close}
      title="이 기기의 기록을 계정으로 옮길까요?"
      message={
        busy
          ? '사진을 올리는 중입니다…'
          : `로그인 전에 남긴 기록 ${localTripCount}개가 있습니다. 옮기면 다른 기기에서도 볼 수 있고, 이 브라우저에서는 지워집니다.`
      }
      confirmLabel={busy ? '옮기는 중…' : '옮기기'}
      onConfirm={async () => {
        if (busy) return;
        setBusy(true);
        try {
          const count = await uploadLocalTrips();
          toast(`기록 ${count}개를 계정으로 옮겼습니다`);
          setOpen(false);
        } catch (e) {
          toast(e instanceof Error ? e.message : '기록을 옮기지 못했습니다', 'error');
        } finally {
          setBusy(false);
        }
      }}
    />
  );
}
