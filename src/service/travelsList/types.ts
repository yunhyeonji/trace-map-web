export interface Travel {
  id: number;
  title: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  titleImageUrl: string;
  tags?: string[];
  description?: string;
  companions?: string[];
}

export interface TravelPlace {
  title: string;
  location: string;
  memo?: string;
  lat: number;
  lon: number;
  order: number;
}

export interface TravelCreateRequest {
  title: string;
  startDate: string; // ISO 8601 format
  endDate: string;
  memo?: string;
  companions?: string[];
  tags?: string[];
  places: TravelPlace[];
  images?: string[]; // 이미지 URL 배열
  countryCode: string; // 국가 코드 추가
}

export interface TravelCreateResponse {
  id: string;
  message: string;
}

export interface ImageUploadResponse {
  urls: string[];
}
