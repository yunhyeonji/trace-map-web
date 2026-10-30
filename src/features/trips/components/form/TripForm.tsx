'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ChevronDown, ChevronUp, Loader2, MapPinned, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getCountry } from '@/lib/countries';
import { formatDuration } from '@/lib/date';
import { cn } from '@/lib/utils';

import { tripDays } from '../../stats';
import { useTrips } from '../../store';
import { Place, Trip, TripDraft } from '../../types';
import RouteMap from '../RouteMap';

import ChipInput from './ChipInput';
import CountryPicker from './CountryPicker';
import PhotoPicker, { PhotoItem } from './PhotoPicker';
import PlaceSearch, { PlaceResult } from './PlaceSearch';

type Errors = Partial<Record<'title' | 'countryCode' | 'startDate' | 'endDate', string>>;

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

function validate(d: TripDraft): Errors {
  const e: Errors = {};
  if (!d.title.trim()) e.title = '제목을 적어주세요';
  if (!d.countryCode) e.countryCode = '나라를 골라주세요';
  if (!d.startDate) e.startDate = '언제 떠났는지 알려주세요';
  if (d.startDate && d.endDate && d.endDate < d.startDate) e.endDate = '시작일보다 빠를 수 없어요';
  return e;
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
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof TripDraft>(key: K, value: TripDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
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
    const found = validate(draft);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('필수 항목을 확인해주세요', 'error');
      return;
    }

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
      toast(trip ? '수정했어요' : '기록을 남겼어요');
      router.replace(`/trips/${saved.id}`);
    } catch (err) {
      console.error(err);
      toast('저장하지 못했어요. 브라우저 저장 공간을 확인해주세요', 'error');
      setSaving(false);
    }
  };

  const days = draft.startDate
    ? tripDays({ startDate: draft.startDate, endDate: draft.endDate || undefined })
    : 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="pb-28">
      <div className="container max-w-3xl py-8 md:py-12">
        <h1 className="text-[28px] font-bold tracking-tight md:text-3xl">
          {trip ? '기록 수정' : '새 여행 기록'}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <span className="text-highlight">*</span> 표시만 채우면 저장할 수 있어요. 나머지는 천천히.
        </p>

        <div className="mt-8 space-y-5">
          {/* 1. 기본 정보 */}
          <Section step={1} title="어디로, 언제 다녀왔나요?">
            <Field label="제목" required error={errors.title} htmlFor="title">
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="예: 골목마다 노란 트램이 지나가던 리스본"
                aria-invalid={!!errors.title}
                maxLength={60}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="나라" required error={errors.countryCode} htmlFor="countryCode">
                <div id="countryCode">
                  <CountryPicker
                    value={draft.countryCode}
                    onChange={(code) => set('countryCode', code)}
                    invalid={!!errors.countryCode}
                  />
                </div>
              </Field>
              <Field label="도시" htmlFor="city">
                <Input
                  id="city"
                  value={draft.city ?? ''}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="예: 리스본"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="떠난 날" required error={errors.startDate} htmlFor="startDate">
                <Input
                  id="startDate"
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => set('startDate', e.target.value)}
                  aria-invalid={!!errors.startDate}
                />
              </Field>
              <Field
                label="돌아온 날"
                error={errors.endDate}
                hint={days ? formatDuration(days) : '당일치기면 비워두세요'}
                htmlFor="endDate"
              >
                <Input
                  id="endDate"
                  type="date"
                  value={draft.endDate ?? ''}
                  min={draft.startDate || undefined}
                  onChange={(e) => set('endDate', e.target.value)}
                  aria-invalid={!!errors.endDate}
                />
              </Field>
            </div>
          </Section>

          {/* 2. 장소 */}
          <Section
            step={2}
            title="다녀온 곳"
            description="방문한 순서대로 추가하면 지도에 동선이 그려져요."
          >
            <PlaceSearch onPick={addPlace} />

            {draft.places.length > 0 ? (
              <>
                <RouteMap places={draft.places} className="h-56 sm:h-72" />
                <ol className="space-y-2">
                  {draft.places.map((p, i) => (
                    <li key={p.id} className="bg-background flex gap-3 rounded-xl border p-3">
                      <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{p.address}</p>
                        <input
                          value={p.memo ?? ''}
                          onChange={(e) => updatePlace(p.id, { memo: e.target.value })}
                          placeholder="한 줄 메모 (선택)"
                          className="placeholder:text-muted-foreground/70 focus:border-ring mt-2 w-full border-b border-dashed bg-transparent pb-1 text-base outline-none focus:border-solid md:text-[13px]"
                        />
                      </div>
                      <div className="flex shrink-0 flex-col items-center">
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
                      </div>
                      <IconBtn
                        label="장소 삭제"
                        onClick={() =>
                          set(
                            'places',
                            draft.places.filter((x) => x.id !== p.id)
                          )
                        }
                      >
                        <X />
                      </IconBtn>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <div className="text-muted-foreground flex items-center gap-3 rounded-xl border border-dashed p-4 text-sm">
                <MapPinned className="size-5 shrink-0" />
                아직 추가한 장소가 없어요. 위에서 검색해 추가해보세요.
              </div>
            )}
          </Section>

          {/* 3. 사진 */}
          <Section step={3} title="사진" description="별표를 누른 사진이 커버가 돼요.">
            <PhotoPicker
              items={photos}
              coverId={draft.coverPhotoId}
              onChange={(items) => {
                setPhotos(items);
                setDirty(true);
              }}
              onCoverChange={(id) => set('coverPhotoId', id)}
            />
          </Section>

          {/* 4. 이야기 */}
          <Section step={4} title="이야기">
            <Field label="기억하고 싶은 순간" htmlFor="story">
              <Textarea
                id="story"
                value={draft.story}
                onChange={(e) => set('story', e.target.value)}
                placeholder="무엇이 좋았나요? 다음엔 무엇을 다르게 하고 싶나요?"
                className="min-h-40"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="함께한 사람" hint="Enter로 추가" htmlFor="companions">
                <ChipInput
                  id="companions"
                  values={draft.companions}
                  onChange={(v) => set('companions', v)}
                  placeholder="예: 지수"
                />
              </Field>
              <Field label="태그" hint="Enter로 추가" htmlFor="tags">
                <ChipInput
                  id="tags"
                  values={draft.tags}
                  onChange={(v) => set('tags', v)}
                  placeholder="예: 혼행, 맛집"
                  prefix="#"
                />
              </Field>
            </div>
          </Section>
        </div>
      </div>

      {/* 저장 바 */}
      <div className="bg-background/90 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="container flex h-18 max-w-3xl items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={saving}>
            취소
          </Button>
          <Button type="submit" size="lg" disabled={saving} className="min-w-32">
            {saving && <Loader2 className="animate-spin" />}
            {saving ? '저장 중' : trip ? '수정 완료' : '기록 저장'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card shadow-card rounded-2xl border p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="bg-primary-soft text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
          {step}
        </span>
        <div>
          <h2 className="text-[17px] font-bold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground mt-0.5 text-[13px]">{description}</p>}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-[13px] font-semibold">
          {label}
          {required && <span className="text-highlight -ml-1">*</span>}
        </Label>
        {hint && !error && <span className="text-muted-foreground text-xs">{hint}</span>}
      </div>
      {children}
      {error && <p className={cn('text-destructive text-xs font-medium')}>{error}</p>}
    </div>
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
      className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1 disabled:opacity-25 [&_svg]:size-4"
      {...props}
    >
      {children}
    </button>
  );
}
