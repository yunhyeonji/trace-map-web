'use client';

import React, { useRef, useState } from 'react';

import { format } from 'date-fns';

import PageTitle from '@/components/layout/pageTitle';
import ConfirmAlert from '@/components/ui/confirm-alert';
import { GroupedButtonRow, GroupedRow, GroupedSection } from '@/components/ui/grouped-list';
import { useToast } from '@/components/ui/toast';
import { useTrips } from '@/features/trips/store';

/** iOS 설정 앱 구성: 정보 → 백업 → 샘플 → 위험한 동작 순서 */
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
      toast(e instanceof Error ? e.message : '문제가 발생했습니다', 'error');
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
      toast('백업 파일을 저장했습니다');
    });

  const handleImport = (file: File) =>
    run('import', async () => {
      const count = await importBackup(file);
      toast(`기록 ${count}개를 가져왔습니다`);
    });

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <PageTitle title="설정" />

      <div className="mt-6 space-y-8">
        <GroupedSection
          header="저장 공간"
          footer="기록은 이 브라우저에만 저장되며 다른 기기와 동기화되지 않습니다."
        >
          <GroupedRow>
            <span className="text-body">기록</span>
            <span className="text-muted-foreground text-body tabular ml-auto">{trips.length}</span>
          </GroupedRow>
          <GroupedRow>
            <span className="text-body">사진</span>
            <span className="text-muted-foreground text-body tabular ml-auto">{photoCount}</span>
          </GroupedRow>
        </GroupedSection>

        <GroupedSection header="백업" footer="가져온 기록은 같은 항목을 덮어씁니다.">
          <GroupedButtonRow
            chevron={false}
            onClick={handleExport}
            disabled={!!busy || !trips.length}
            className="text-primary text-body"
          >
            {busy === 'export' ? '준비 중…' : '백업 파일 내보내기'}
          </GroupedButtonRow>
          <GroupedButtonRow
            chevron={false}
            onClick={() => fileRef.current?.click()}
            disabled={!!busy}
            className="text-primary text-body"
          >
            {busy === 'import' ? '가져오는 중…' : '백업 파일 가져오기'}
          </GroupedButtonRow>
        </GroupedSection>
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

        <GroupedSection footer="둘러보기용 여행 기록 5개를 추가합니다.">
          <GroupedButtonRow
            chevron={false}
            disabled={!!busy}
            onClick={() =>
              run('sample', async () => {
                await loadSamples();
                toast('샘플 기록을 추가했습니다');
              })
            }
            className="text-primary text-body"
          >
            샘플 기록 추가
          </GroupedButtonRow>
        </GroupedSection>

        <GroupedSection>
          <GroupedButtonRow
            chevron={false}
            onClick={() => setConfirmClear(true)}
            disabled={!!busy || !trips.length}
            className="text-destructive text-body justify-center"
          >
            모든 기록 삭제
          </GroupedButtonRow>
        </GroupedSection>
      </div>

      <ConfirmAlert
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="모든 기록을 삭제하시겠습니까?"
        message={`기록 ${trips.length}개와 사진 ${photoCount}장이 삭제됩니다. 이 동작은 취소할 수 없습니다.`}
        confirmLabel="삭제"
        destructive
        onConfirm={() =>
          run('clear', async () => {
            await clearAll();
            setConfirmClear(false);
            toast('모든 기록을 삭제했습니다');
          })
        }
      />

      <p className="text-muted-foreground text-footnote mt-10 text-center">
        지도 데이터 © OpenStreetMap
      </p>
    </div>
  );
}
