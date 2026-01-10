/* eslint-disable simple-import-sort/imports */
import { notionClient } from '@/lib/notion';
import { NOTION_PROPERTIES, Travel } from './types';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const parseListData = (page: PageObjectResponse): Travel | null => {
  try {
    const properties = page.properties;

    // 1. travelName (title)
    const travelNameProperty = properties[NOTION_PROPERTIES.TRAVEL_NAME];
    const travelName =
      travelNameProperty && 'title' in travelNameProperty
        ? travelNameProperty.title.map((text) => text.plain_text).join('')
        : '';

    // 2. date (date)
    const dateProperty = properties[NOTION_PROPERTIES.DATE];
    const date =
      dateProperty && 'date' in dateProperty && dateProperty.date
        ? {
            start: dateProperty.date.start,
            end: dateProperty.date.end,
          }
        : null;

    // 3. location (rich_text 또는 url)
    const locationProperty = properties[NOTION_PROPERTIES.LOCATION];
    let location: string | null = null;
    if (locationProperty) {
      if ('rich_text' in locationProperty) {
        location = locationProperty.rich_text.map((text) => text.plain_text).join('') || null;
      } else if ('url' in locationProperty && locationProperty.url) {
        location = locationProperty.url;
      }
    }

    // 4. companions (multi_select 또는 people) - camelCase 유지
    const companionsProperty = properties[NOTION_PROPERTIES.PEOPLE];
    let companions: string[] = [];
    if (companionsProperty) {
      if ('multi_select' in companionsProperty) {
        companions = companionsProperty.multi_select.map((item) => item.name);
      } else if ('people' in companionsProperty) {
        companions = companionsProperty.people
          .map((person) => ('name' in person ? person.name : null))
          .filter((name): name is string => name !== null);
      }
    }

    // 5. coverPhoto (files)
    const coverPhotoProperty = properties[NOTION_PROPERTIES.COVER];
    let coverPhoto: string | null = null;
    if (
      coverPhotoProperty &&
      'files' in coverPhotoProperty &&
      coverPhotoProperty.files.length > 0
    ) {
      const file = coverPhotoProperty.files[0];
      if (file) {
        if ('file' in file && file.file) {
          coverPhoto = file.file.url;
        } else if ('external' in file && file.external) {
          coverPhoto = file.external.url;
        }
      }
    }

    // 6. memo (rich_text)
    const memoProperty = properties[NOTION_PROPERTIES.MEMO];
    const memo =
      memoProperty && 'rich_text' in memoProperty
        ? memoProperty.rich_text.map((text) => text.plain_text).join('') || null
        : null;

    // 7. tags
    const tagsProperty = properties[NOTION_PROPERTIES.TAGS];
    const tags =
      tagsProperty && 'multi_select' in tagsProperty
        ? tagsProperty.multi_select.map((item) => item.name)
        : null;

    // 최종 반환 객체 속성명 통일
    return {
      id: page.id,
      travelName,
      date,
      location,
      companions,
      coverPhoto,
      memo,
      tags,
      url: page.url,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  } catch (error) {
    console.error('페이지 파싱 에러:', error);
    return null;
  }
};

export const getTravelList = async (): Promise<Travel[]> => {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: NOTION_PROPERTIES.DATE,
          direction: 'descending',
        },
      ],
    });

    const posts = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(parseListData)
      .filter((post): post is Travel => post !== null);

    return posts;
  } catch (error) {
    console.error('Notion API 에러:', error);
    throw error;
  }
};
