// Notion 데이터베이스 속성명 상수
export const NOTION_PROPERTIES = {
  TRAVEL_NAME: 'travelName',
  DATE: 'date',
  DESTINATION: 'destination',
  COMPANIONS: 'companions',
  COVER_PHOTO: 'coverPhoto',
  SUMMARY: 'summary',
} as const;

// 여행 데이터 타입
export interface Travel {
  id: string;
  travelName: string;
  date: {
    start: string | null;
    end: string | null;
  } | null;
  destination: string | null;
  companions: string[];
  coverPhoto: string | null;
  summary: string | null;
  url: string;
  createdTime: string;
  lastEditedTime: string;
}
