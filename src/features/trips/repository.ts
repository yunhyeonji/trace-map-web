import { Photo, Trip } from './types';

/**
 * 기록 저장소. 로그인하지 않으면 IndexedDB(`db.ts`),
 * 로그인하면 Supabase(`remote.ts`) 구현을 쓴다. 화면은 어느 쪽인지 모른다.
 */
export interface TripRepository {
  getAllTrips: () => Promise<Trip[]>;
  putTrip: (trip: Trip) => Promise<void>;
  putTrips: (trips: Trip[]) => Promise<void>;
  /** 기록과 거기 딸린 사진을 함께 지운다 */
  deleteTrip: (trip: Trip) => Promise<void>;
  getPhoto: (id: string) => Promise<Photo | undefined>;
  /** 화면에 보여줄 때는 크기 없이 이미지만 필요하다 */
  getPhotoBlob: (id: string) => Promise<Blob | undefined>;
  putPhotos: (photos: Photo[]) => Promise<void>;
  deletePhotos: (ids: string[]) => Promise<void>;
  clear: () => Promise<void>;
}
