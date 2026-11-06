'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

import { createId, db } from './db';
import { blobToDataUrl, dataUrlToBlob, forgetPhotoUrls, setPhotoSource } from './photos';
import { createRemoteRepo } from './remote';
import { SAMPLE_TRIPS } from './sample';
import { sortTrips } from './stats';
import { Photo, Trip, TripDraft } from './types';

interface SaveInput {
  id?: string;
  draft: TripDraft;
  /** 새로 추가된 사진 */
  newPhotos: Photo[];
  /** 수정 중에 지운 기존 사진 */
  removedPhotoIds: string[];
}

interface TripsContextValue {
  trips: Trip[];
  ready: boolean;
  /** local: 이 브라우저(IndexedDB), remote: 로그인한 계정(Supabase) */
  mode: 'local' | 'remote';
  /** 로그인했을 때 아직 계정으로 옮기지 않은 이 기기의 기록 수 */
  localTripCount: number;
  uploadLocalTrips: () => Promise<number>;
  getTrip: (id: string) => Trip | undefined;
  saveTrip: (input: SaveInput) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  loadSamples: () => Promise<void>;
  exportBackup: () => Promise<Blob>;
  importBackup: (file: File) => Promise<number>;
  clearAll: () => Promise<void>;
}

const TripsContext = createContext<TripsContextValue | null>(null);

interface Backup {
  app: 'tracemap';
  version: 1;
  exportedAt: string;
  trips: Trip[];
  photos: { id: string; width: number; height: number; data: string }[];
}

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userId = auth.user?.id;
  const repo = useMemo(
    () => (userId && supabase ? createRemoteRepo(supabase, userId) : db),
    [userId]
  );
  const mode: TripsContextValue['mode'] = repo === db ? 'local' : 'remote';

  const [trips, setTrips] = useState<Trip[]>([]);
  const [ready, setReady] = useState(false);
  const [localTripCount, setLocalTripCount] = useState(0);

  // 세션을 확인한 뒤에 읽어야 로컬 기록이 잠깐 보였다가 바뀌는 일이 없다
  useEffect(() => {
    if (!auth.ready) return;
    let alive = true;
    setPhotoSource(repo);
    setTrips([]);
    setReady(false);
    repo
      .getAllTrips()
      .then((all) => alive && setTrips(sortTrips(all)))
      .catch((e) => console.error('기록을 불러오지 못했습니다', e))
      .finally(() => alive && setReady(true));

    if (repo === db) setLocalTripCount(0);
    else db.getAllTrips().then((local) => alive && setLocalTripCount(local.length));

    return () => {
      alive = false;
    };
  }, [auth.ready, repo]);

  const getTrip = useCallback((id: string) => trips.find((t) => t.id === id), [trips]);

  const saveTrip = useCallback(
    async ({ id, draft, newPhotos, removedPhotoIds }: SaveInput) => {
      const now = Date.now();
      const prev = id ? trips.find((t) => t.id === id) : undefined;
      const trip: Trip = {
        ...draft,
        id: prev?.id ?? createId(),
        createdAt: prev?.createdAt ?? now,
        updatedAt: now,
      };

      if (newPhotos.length) await repo.putPhotos(newPhotos);
      await repo.putTrip(trip);
      if (removedPhotoIds.length) {
        await repo.deletePhotos(removedPhotoIds);
        forgetPhotoUrls(removedPhotoIds);
      }

      setTrips((list) => sortTrips([...list.filter((t) => t.id !== trip.id), trip]));
      return trip;
    },
    [repo, trips]
  );

  const deleteTrip = useCallback(
    async (id: string) => {
      const trip = trips.find((t) => t.id === id);
      if (!trip) return;
      await repo.deleteTrip(trip);
      forgetPhotoUrls(trip.photoIds);
      setTrips((list) => list.filter((t) => t.id !== id));
    },
    [repo, trips]
  );

  const loadSamples = useCallback(async () => {
    const now = Date.now();
    const samples = SAMPLE_TRIPS.map<Trip>((draft, i) => ({
      ...draft,
      id: createId(),
      createdAt: now - i,
      updatedAt: now - i,
    }));
    await repo.putTrips(samples);
    setTrips((list) => sortTrips([...list, ...samples]));
  }, [repo]);

  const exportBackup = useCallback(async () => {
    const photos = (await Promise.all(trips.flatMap((t) => t.photoIds).map(repo.getPhoto))).filter(
      (p): p is Photo => !!p
    );
    const backup: Backup = {
      app: 'tracemap',
      version: 1,
      exportedAt: new Date().toISOString(),
      trips,
      photos: await Promise.all(
        photos.map(async (p) => ({
          id: p.id,
          width: p.width,
          height: p.height,
          data: await blobToDataUrl(p.blob),
        }))
      ),
    };
    return new Blob([JSON.stringify(backup)], { type: 'application/json' });
  }, [repo, trips]);

  const importBackup = useCallback(
    async (file: File) => {
      const backup = JSON.parse(await file.text()) as Backup;
      if (backup?.app !== 'tracemap' || !Array.isArray(backup.trips)) {
        throw new Error('TraceMap 백업 파일이 아닙니다.');
      }
      const photos: Photo[] = await Promise.all(
        (backup.photos ?? []).map(async (p) => ({
          id: p.id,
          width: p.width,
          height: p.height,
          blob: await dataUrlToBlob(p.data),
        }))
      );
      if (photos.length) await repo.putPhotos(photos);
      await repo.putTrips(backup.trips);
      setTrips((list) => {
        const ids = new Set(backup.trips.map((t) => t.id));
        return sortTrips([...list.filter((t) => !ids.has(t.id)), ...backup.trips]);
      });
      return backup.trips.length;
    },
    [repo]
  );

  const clearAll = useCallback(async () => {
    await repo.clear();
    forgetPhotoUrls(trips.flatMap((t) => t.photoIds));
    setTrips([]);
  }, [repo, trips]);

  /** 이 기기의 기록을 사진과 함께 계정으로 옮기고, 옮긴 뒤 로컬에서는 지운다 */
  const uploadLocalTrips = useCallback(async () => {
    if (repo === db) return 0;
    const local = await db.getAllTrips();
    for (const trip of local) {
      const photos = (await Promise.all(trip.photoIds.map(db.getPhoto))).filter(
        (p): p is Photo => !!p
      );
      if (photos.length) await repo.putPhotos(photos);
    }
    await repo.putTrips(local);
    await db.clear();
    setLocalTripCount(0);
    setTrips((list) => {
      const ids = new Set(local.map((t) => t.id));
      return sortTrips([...list.filter((t) => !ids.has(t.id)), ...local]);
    });
    return local.length;
  }, [repo]);

  const value = useMemo(
    () => ({
      trips,
      ready,
      mode,
      localTripCount,
      uploadLocalTrips,
      getTrip,
      saveTrip,
      deleteTrip,
      loadSamples,
      exportBackup,
      importBackup,
      clearAll,
    }),
    [
      trips,
      ready,
      mode,
      localTripCount,
      uploadLocalTrips,
      getTrip,
      saveTrip,
      deleteTrip,
      loadSamples,
      exportBackup,
      importBackup,
      clearAll,
    ]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips는 TripsProvider 안에서 사용해야 합니다.');
  return ctx;
}
