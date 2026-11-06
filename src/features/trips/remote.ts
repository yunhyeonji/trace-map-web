import { SupabaseClient } from '@supabase/supabase-js';

import { PHOTO_BUCKET } from '@/lib/supabase';

import { TripRepository } from './repository';
import { Place, Trip } from './types';

interface TripRow {
  id: string;
  title: string;
  country_code: string;
  city: string | null;
  start_date: string;
  end_date: string | null;
  places: Place[];
  photo_ids: string[];
  cover_photo_id: string | null;
  story: string;
  companions: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

const toRow = (t: Trip): TripRow => ({
  id: t.id,
  title: t.title,
  country_code: t.countryCode,
  city: t.city ?? null,
  start_date: t.startDate,
  end_date: t.endDate || null,
  places: t.places,
  photo_ids: t.photoIds,
  cover_photo_id: t.coverPhotoId ?? null,
  story: t.story,
  companions: t.companions,
  tags: t.tags,
  created_at: new Date(t.createdAt).toISOString(),
  updated_at: new Date(t.updatedAt).toISOString(),
});

const fromRow = (r: TripRow): Trip => ({
  id: r.id,
  title: r.title,
  countryCode: r.country_code,
  city: r.city ?? undefined,
  startDate: r.start_date,
  endDate: r.end_date ?? undefined,
  places: r.places ?? [],
  photoIds: r.photo_ids ?? [],
  coverPhotoId: r.cover_photo_id ?? undefined,
  story: r.story ?? '',
  companions: r.companions ?? [],
  tags: r.tags ?? [],
  createdAt: Date.parse(r.created_at),
  updatedAt: Date.parse(r.updated_at),
});

function check<T>({ data, error }: { data: T; error: unknown }): T {
  if (error) throw error;
  return data;
}

/** Supabase에 저장하는 저장소. RLS가 user_id를 강제하므로 쿼리에 굳이 걸 필요는 없다 */
export function createRemoteRepo(client: SupabaseClient, userId: string): TripRepository {
  const bucket = () => client.storage.from(PHOTO_BUCKET);
  const photoPath = (id: string) => `${userId}/${id}.jpg`;

  const removePhotos = async (ids: string[]) => {
    if (!ids.length) return;
    check(await bucket().remove(ids.map(photoPath)));
  };

  const getPhotoBlob = async (id: string) => {
    const { data, error } = await bucket().download(photoPath(id));
    return error || !data ? undefined : data;
  };

  return {
    getAllTrips: async () => {
      const rows = check(await client.from('trips').select('*').order('start_date', { ascending: false }));
      return (rows as TripRow[]).map(fromRow);
    },

    putTrip: async (trip) => {
      check(await client.from('trips').upsert({ ...toRow(trip), user_id: userId }));
    },

    putTrips: async (trips) => {
      if (!trips.length) return;
      check(
        await client.from('trips').upsert(trips.map((t) => ({ ...toRow(t), user_id: userId })))
      );
    },

    deleteTrip: async (trip) => {
      check(await client.from('trips').delete().eq('id', trip.id));
      await removePhotos(trip.photoIds);
    },

    getPhotoBlob,

    // 크기는 따로 저장하지 않는다. 백업·이전할 때만 필요하므로 그때 읽는다
    getPhoto: async (id) => {
      const blob = await getPhotoBlob(id);
      if (!blob) return undefined;
      const bitmap = await createImageBitmap(blob);
      const photo = { id, blob, width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return photo;
    },

    putPhotos: async (photos) => {
      await Promise.all(
        photos.map(async (p) =>
          check(
            await bucket().upload(photoPath(p.id), p.blob, {
              contentType: 'image/jpeg',
              upsert: true,
            })
          )
        )
      );
    },

    deletePhotos: removePhotos,

    clear: async () => {
      const rows = check(await client.from('trips').select('photo_ids')) as Pick<
        TripRow,
        'photo_ids'
      >[];
      await removePhotos(rows.flatMap((r) => r.photo_ids));
      check(await client.from('trips').delete().eq('user_id', userId));
    },
  };
}
