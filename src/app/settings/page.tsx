'use client';

import React, { useRef, useState } from 'react';

import { format } from 'date-fns';
import { Download, HardDrive, Sparkles, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { useTrips } from '@/features/trips/store';

export default function SettingsPage() {
  const { trips, exportBackup, importBackup, clearAll, loadSamples } = useTrips();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const photoCount = trips.reduce((n, t) => n + t.photoIds.length, 0);

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    try {
      await task();
    } catch (e) {
      toast(e instanceof Error ? e.message : '문제가 생겼어요', 'error');
    } finally {
      setBusy(null);
    }
  };

  const handleExport = () =>
    run('export', async () => {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tracemap-backup-${format(new Date(), 'yyyyMMdd')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('백업 파일을 내려받았어요');
    });

  const handleImport = (file: File) =>
    run('import', async () => {
      const count = await importBackup(file);
      toast(`기록 ${count}개를 가져왔어요`);
    });

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <h1 className="text-[28px] font-bold tracking-tight md:text-3xl">데이터 관리</h1>

      <div className="bg-primary-soft text-primary mt-6 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed">
        <HardDrive className="mt-0.5 size-5 shrink-0" />
        <p>
          모든 기록은 <b>지금 쓰는 브라우저 안에만</b> 저장돼요. 브라우저 데이터를 지우거나 다른
          기기에서 열면 보이지 않으니, 가끔 백업 파일을 내려받아 두세요.
        </p>
      </div>

      <dl className="bg-border mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border">
        <div className="bg-card p-4">
          <dt className="text-muted-foreground text-xs">저장된 기록</dt>
          <dd className="tabular mt-1 text-2xl font-bold">{trips.length}</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="text-muted-foreground text-xs">저장된 사진</dt>
          <dd className="tabular mt-1 text-2xl font-bold">{photoCount}</dd>
        </div>
      </dl>

      <ul className="bg-card mt-6 divide-y overflow-hidden rounded-2xl border">
        <Row
          icon={<Download />}
          title="백업 파일 내려받기"
          description="기록과 사진을 JSON 파일 하나로 저장해요."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!!busy || !trips.length}
            >
              {busy === 'export' ? '준비 중…' : '내려받기'}
            </Button>
          }
        />
        <Row
          icon={<Upload />}
          title="백업 파일에서 가져오기"
          description="같은 기록은 백업 내용으로 덮어써요."
          action={
            <>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImport(f);
                  e.target.value = '';
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={!!busy}
              >
                {busy === 'import' ? '가져오는 중…' : '파일 선택'}
              </Button>
            </>
          }
        />
        <Row
          icon={<Sparkles />}
          title="샘플 기록 추가"
          description="둘러보기용 여행 5개를 추가해요."
          action={
            <Button
              variant="outline"
              size="sm"
              disabled={!!busy}
              onClick={() =>
                run('sample', async () => {
                  await loadSamples();
                  toast('샘플 기록을 추가했어요');
                })
              }
            >
              추가
            </Button>
          }
        />
        <Row
          icon={<Trash2 />}
          danger
          title="모든 기록 지우기"
          description="이 브라우저에 저장된 기록과 사진을 모두 삭제해요."
          action={
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmClear(true)}
              disabled={!!busy || !trips.length}
            >
              지우기
            </Button>
          }
        />
      </ul>

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent hideClose>
          <DialogTitle>정말 모두 지울까요?</DialogTitle>
          <DialogDescription>
            기록 {trips.length}개와 사진 {photoCount}장이 삭제돼요. 백업 파일이 없다면 되돌릴 수
            없어요.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                run('clear', async () => {
                  await clearAll();
                  setConfirmClear(false);
                  toast('모든 기록을 지웠어요');
                })
              }
            >
              모두 지우기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-muted-foreground mt-10 text-center text-xs">
        TraceMap · 지도 데이터 © OpenStreetMap 기여자
      </p>
    </div>
  );
}

function Row({
  icon,
  title,
  description,
  action,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <li className="flex items-center gap-4 p-4 sm:p-5">
      <span
        className={
          danger
            ? 'bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-[18px]'
            : 'bg-muted flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-[18px]'
        }
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-[13px]">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </li>
  );
}
