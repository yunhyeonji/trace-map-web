'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { createId, db } from './db';
import { blobToDataUrl, dataUrlToBlob, forgetPhotoUrls } from './photos';
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    db.getAllTrips()
      .then((all) => setTrips(sortTrips(all)))
      .catch((e) => console.error('기록을 불러오지 못했어요', e))
      .finally(() => setReady(true));
  }, []);

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

      if (newPhotos.length) await db.putPhotos(newPhotos);
      await db.putTrip(trip);
      if (removedPhotoIds.length) {
        await db.deletePhotos(removedPhotoIds);
        forgetPhotoUrls(removedPhotoIds);
      }

      setTrips((list) => sortTrips([...list.filter((t) => t.id !== trip.id), trip]));
      return trip;
    },
    [trips]
  );

  const deleteTrip = useCallback(
    async (id: string) => {
      const trip = trips.find((t) => t.id === id);
      if (!trip) return;
      await db.deleteTrip(trip);
      forgetPhotoUrls(trip.photoIds);
      setTrips((list) => list.filter((t) => t.id !== id));
    },
    [trips]
  );

  const loadSamples = useCallback(async () => {
    const now = Date.now();
    const samples = SAMPLE_TRIPS.map<Trip>((draft, i) => ({
      ...draft,
      id: createId(),
      createdAt: now - i,
      updatedAt: now - i,
    }));
    await db.putTrips(samples);
    setTrips((list) => sortTrips([...list, ...samples]));
  }, []);

  const exportBackup = useCallback(async () => {
    const photos = await db.getAllPhotos();
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
  }, [trips]);

  const importBackup = useCallback(async (file: File) => {
    const backup = JSON.parse(await file.text()) as Backup;
    if (backup?.app !== 'tracemap' || !Array.isArray(backup.trips)) {
      throw new Error('TraceMap 백업 파일이 아니에요.');
    }
    const photos: Photo[] = await Promise.all(
      (backup.photos ?? []).map(async (p) => ({
        id: p.id,
        width: p.width,
        height: p.height,
        blob: await dataUrlToBlob(p.data),
      }))
    );
    if (photos.length) await db.putPhotos(photos);
    await db.putTrips(backup.trips);
    setTrips((list) => {
      const ids = new Set(backup.trips.map((t) => t.id));
      return sortTrips([...list.filter((t) => !ids.has(t.id)), ...backup.trips]);
    });
    return backup.trips.length;
  }, []);

  const clearAll = useCallback(async () => {
    await db.clear();
    forgetPhotoUrls(trips.flatMap((t) => t.photoIds));
    setTrips([]);
  }, [trips]);

  const value = useMemo(
    () => ({
      trips,
      ready,
      getTrip,
      saveTrip,
      deleteTrip,
      loadSamples,
      exportBackup,
      importBackup,
      clearAll,
    }),
    [trips, ready, getTrip, saveTrip, deleteTrip, loadSamples, exportBackup, importBackup, clearAll]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips는 TripsProvider 안에서 써야 해요.');
  return ctx;
}
