import { TripRepository } from './repository';
import { Photo, Trip } from './types';

const DB_NAME = 'tracemap';
const DB_VERSION = 1;

type StoreName = 'trips' | 'photos';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('trips')) db.createObjectStore('trips', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('photos'))
        db.createObjectStore('photos', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });

  return dbPromise;
}

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(
  stores: StoreName | StoreName[],
  mode: 'readonly' | 'readwrite',
  run: (t: IDBTransaction) => Promise<T> | T
): Promise<T> {
  const db = await openDB();
  const t = db.transaction(stores, mode);
  const done = new Promise<void>((resolve, reject) => {
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
  const result = await run(t);
  await done;
  return result;
}

const getPhoto = (id: string) =>
  tx('photos', 'readonly', (t) => promisify<Photo | undefined>(t.objectStore('photos').get(id)));

export const db = {
  getAllTrips: () =>
    tx('trips', 'readonly', (t) => promisify<Trip[]>(t.objectStore('trips').getAll())),

  putTrip: (trip: Trip) => tx('trips', 'readwrite', (t) => void t.objectStore('trips').put(trip)),

  putTrips: (trips: Trip[]) =>
    tx('trips', 'readwrite', (t) => {
      const store = t.objectStore('trips');
      trips.forEach((trip) => store.put(trip));
    }),

  deleteTrip: (trip: Trip) =>
    tx(['trips', 'photos'], 'readwrite', (t) => {
      t.objectStore('trips').delete(trip.id);
      const photos = t.objectStore('photos');
      trip.photoIds.forEach((id) => photos.delete(id));
    }),

  getPhoto,

  getPhotoBlob: (id: string) => getPhoto(id).then((p) => p?.blob),

  putPhotos: (photos: Photo[]) =>
    tx('photos', 'readwrite', (t) => {
      const store = t.objectStore('photos');
      photos.forEach((p) => store.put(p));
    }),

  deletePhotos: (ids: string[]) =>
    tx('photos', 'readwrite', (t) => {
      const store = t.objectStore('photos');
      ids.forEach((id) => store.delete(id));
    }),

  clear: () =>
    tx(['trips', 'photos'], 'readwrite', (t) => {
      t.objectStore('trips').clear();
      t.objectStore('photos').clear();
    }),
} satisfies TripRepository;

export function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
