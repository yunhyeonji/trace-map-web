export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  memo?: string;
}

export interface Trip {
  id: string;
  title: string;
  countryCode: string;
  city?: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD, 당일치기면 비워둔다 */
  endDate?: string;
  places: Place[];
  photoIds: string[];
  coverPhotoId?: string;
  story: string;
  companions: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type TripDraft = Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>;

export interface Photo {
  id: string;
  blob: Blob;
  width: number;
  height: number;
}
