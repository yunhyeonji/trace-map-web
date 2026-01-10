// Notion 데이터베이스 속성명 상수
export const NOTION_PROPERTIES = {
  TRAVEL_NAME: 'travelName',
  DATE: 'date',
  LOCATION: 'location',
  PEOPLE: 'people',
  COVER: 'cover',
  MEMO: 'memo',
  TAGS: 'tags',
} as const;

// 여행 데이터 타입
export interface Travel {
  id: string;
  travelName: string;
  date: {
    start: string | null;
    end: string | null;
  } | null;
  location: string | null;
  companions: string[];
  coverPhoto: string | null;
  memo: string | null;
  tags: string[] | null; //
  url: string;
  createdTime: string;
  lastEditedTime: string;
}
