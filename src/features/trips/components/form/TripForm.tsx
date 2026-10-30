'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ChevronDown, ChevronUp, X } from 'lucide-react';

import { GroupedRow, GroupedSection } from '@/components/ui/grouped-list';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getCountry } from '@/lib/countries';

import { useTrips } from '../../store';
import { Place, Trip, TripDraft } from '../../types';
import RouteMap from '../RouteMap';

import ChipInput from './ChipInput';
import CountryPicker from './CountryPicker';
import DateRangePicker from './DateRangePicker';
import PhotoPicker, { PhotoItem } from './PhotoPicker';
import PlaceSearch, { PlaceResult } from './PlaceSearch';

const EMPTY: TripDraft = {
  title: '',
  countryCode: '',
  city: '',
  startDate: '',
  endDate: '',
  places: [],
  photoIds: [],
  coverPhotoId: undefined,
  story: '',
  companions: [],
  tags: [],
};

const ROW_INPUT =
  'text-body placeholder:text-muted-foreground w-full min-w-0 bg-transparent outline-none';

/** iOS처럼 필수 항목이 채워져야 저장 버튼이 켜진다 */
function canSave(d: TripDraft) {
  return !!d.title.trim() && !!d.countryCode && !!d.startDate;
}

export default function TripForm({ trip }: { trip?: Trip }) {
  const router = useRouter();
  const toast = useToast();
  const { saveTrip } = useTrips();

  const [draft, setDraft] = useState<TripDraft>(() =>
    trip ? { ...EMPTY, ...trip, endDate: trip.endDate ?? '' } : EMPTY
  );
  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    (trip?.photoIds ?? []).map((id) => ({ id }))
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof TripDraft>(key: K, value: TripDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  // 저장하지 않고 나가려 할 때 한 번 붙잡는다
  useEffect(() => {
    if (!dirty || saving) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, saving]);

  const addPlace = (r: PlaceResult) => {
    const { countryCode, city, ...place } = r;
    set('places', [...draft.places, place]);
    // 첫 장소로 나라와 도시를 채워준다
    if (!draft.countryCode && countryCode && getCountry(countryCode))
      set('countryCode', countryCode);
    if (!draft.city && city) set('city', city);
  };

  const updatePlace = (id: string, patch: Partial<Place>) =>
    set(
      'places',
      draft.places.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const movePlace = (index: number, dir: -1 | 1) => {
    const next = [...draft.places];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item!);
    set('places', next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave(draft) || saving) return;

    setSaving(true);
    try {
      const photoIds = photos.map((p) => p.id);
      const saved = await saveTrip({
        id: trip?.id,
        draft: {
          ...draft,
          title: draft.title.trim(),
          city: draft.city?.trim() || undefined,
          endDate: draft.endDate || undefined,
          story: draft.story.trim(),
          photoIds,
          coverPhotoId: photoIds.includes(draft.coverPhotoId ?? '')
            ? draft.coverPhotoId
            : photoIds[0],
        },
        newPhotos: photos.flatMap((p) => (p.pending ? [p.pending] : [])),
        removedPhotoIds: (trip?.photoIds ?? []).filter((id) => !photoIds.includes(id)),
      });
      toast(trip ? '변경 사항을 저장했습니다' : '기록을 추가했습니다');
      router.replace(`/trips/${saved.id}`);
    } catch (err) {
      console.error(err);
      toast('저장하지 못했습니다. 브라우저 저장 공간을 확인하세요.', 'error');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="pb-16">
      {/* iOS 시트의 내비게이션 바: 취소 · 제목 · 저장 */}
      <div className="glass sticky top-(--header-height) z-30 border-b border-(--glass-line)">
        <div className="container grid h-12 max-w-2xl grid-cols-[1fr_auto_1fr] items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-primary text-body justify-self-start hover:opacity-70"
          >
            취소
          </button>
          <h1 className="text-headline">{trip ? '기록 편집' : '새 기록'}</h1>
          <button
            type="submit"
            disabled={!canSave(draft) || saving}
            className="text-primary text-headline disabled:text-muted-foreground/50 justify-self-end hover:opacity-70 disabled:hover:opacity-100"
          >
            {saving ? '저장 중…' : trip ? '완료' : '추가'}
          </button>
        </div>
      </div>

      <div className="container max-w-2xl space-y-8 py-6">
        <GroupedSection>
          <GroupedRow>
            <input
              id="title"
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="제목"
              maxLength={60}
              className={ROW_INPUT}
            />
          </GroupedRow>
          <GroupedRow>
            <input
              id="city"
              value={draft.city ?? ''}
              onChange={(e) => set('city', e.target.value)}
              placeholder="도시"
              className={ROW_INPUT}
            />
          </GroupedRow>
        </GroupedSection>

        <GroupedSection>
          <GroupedRow>
            <label htmlFor="countryCode" className="text-body">
              나라
            </label>
            <div className="ml-auto">
              <CountryPicker
                id="countryCode"
                value={draft.countryCode}
                onChange={(code) => set('countryCode', code)}
              />
            </div>
          </GroupedRow>
          <GroupedRow>
            <label htmlFor="startDate" className="text-body shrink-0">
              기간
            </label>
            <div className="ml-auto min-w-0">
              <DateRangePicker
                id="startDate"
                startDate={draft.startDate}
                endDate={draft.endDate ?? ''}
                onChange={({ startDate, endDate }) => {
                  set('startDate', startDate);
                  set('endDate', endDate);
                }}
              />
            </div>
          </GroupedRow>
        </GroupedSection>

        <GroupedSection
          header="다녀온 곳"
          footer="방문한 순서대로 추가하면 지도에 경로가 표시됩니다."
        >
          <GroupedRow>
            <div className="w-full">
              <PlaceSearch onPick={addPlace} />
            </div>
          </GroupedRow>
          {draft.places.length > 0 && (
            <>
              <div className="px-4 pb-3">
                <RouteMap places={draft.places} className="h-52 rounded-lg border-0 sm:h-64" />
              </div>
              {draft.places.map((p, i) => (
                <GroupedRow key={p.id} className="items-start">
                  <span className="bg-primary text-primary-foreground text-caption mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-semibold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body truncate">{p.name}</p>
                    <input
                      value={p.memo ?? ''}
                      onChange={(e) => updatePlace(p.id, { memo: e.target.value })}
                      placeholder="메모"
                      aria-label={`${p.name} 메모`}
                      className="text-subheadline text-muted-foreground placeholder:text-muted-foreground/60 focus:text-foreground mt-0.5 w-full bg-transparent outline-none"
                    />
                  </div>
                  <div className="-mr-1 flex shrink-0 items-center">
                    <IconBtn label="위로" disabled={i === 0} onClick={() => movePlace(i, -1)}>
                      <ChevronUp />
                    </IconBtn>
                    <IconBtn
                      label="아래로"
                      disabled={i === draft.places.length - 1}
                      onClick={() => movePlace(i, 1)}
                    >
                      <ChevronDown />
                    </IconBtn>
                    <IconBtn
                      label="삭제"
                      onClick={() =>
                        set(
                          'places',
                          draft.places.filter((x) => x.id !== p.id)
                        )
                      }
                    >
                      <X />
                    </IconBtn>
                  </div>
                </GroupedRow>
              ))}
            </>
          )}
        </GroupedSection>

        <GroupedSection
          header="사진"
          footer={photos.length > 0 ? '별표를 누른 사진이 대표 사진이 됩니다.' : undefined}
        >
          <div className={photos.length > 0 ? 'p-2' : 'px-4 py-2.5'}>
            <PhotoPicker
              items={photos}
              coverId={draft.coverPhotoId}
              onChange={(items) => {
                setPhotos(items);
                setDirty(true);
              }}
              onCoverChange={(id) => set('coverPhotoId', id)}
            />
          </div>
        </GroupedSection>

        <GroupedSection header="메모">
          <div className="px-4 py-1">
            <Textarea
              id="story"
              value={draft.story}
              onChange={(e) => set('story', e.target.value)}
              placeholder="기억하고 싶은 내용"
              className="text-body md:text-body min-h-32 rounded-none border-0 bg-transparent px-0 focus-visible:ring-0"
            />
          </div>
        </GroupedSection>

        <GroupedSection footer="Enter 또는 쉼표로 구분합니다.">
          <GroupedRow className="items-start py-0">
            <label htmlFor="companions" className="text-body w-24 shrink-0 py-[11px]">
              함께한 사람
            </label>
            <ChipInput
              id="companions"
              values={draft.companions}
              onChange={(v) => set('companions', v)}
              placeholder="없음"
            />
          </GroupedRow>
          <GroupedRow className="items-start py-0">
            <label htmlFor="tags" className="text-body w-24 shrink-0 py-[11px]">
              태그
            </label>
            <ChipInput
              id="tags"
              values={draft.tags}
              onChange={(v) => set('tags', v)}
              placeholder="없음"
              prefix="#"
            />
          </GroupedRow>
        </GroupedSection>
      </div>
    </form>
  );
}

function IconBtn({
  label,
  children,
  ...props
}: React.ComponentProps<'button'> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground rounded-md p-1.5 disabled:opacity-25 [&_svg]:size-4"
      {...props}
    >
      {children}
    </button>
  );
}
