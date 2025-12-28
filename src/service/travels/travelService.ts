/* eslint-disable simple-import-sort/imports */
import { notionClient } from '@/lib/notion';
import { NOTION_PROPERTIES, Travel } from './types';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const parseListData = (page: PageObjectResponse): Travel | null => {
  try {
    const properties = page.properties;

    // travelName (title)
    const travelNameProperty = properties[NOTION_PROPERTIES.TRAVEL_NAME];
    const travelName =
      travelNameProperty && 'title' in travelNameProperty
        ? travelNameProperty.title.map((text) => text.plain_text).join('')
        : '';

    // date (date)
    const dateProperty = properties[NOTION_PROPERTIES.DATE];
    const date =
      dateProperty && 'date' in dateProperty && dateProperty.date
        ? {
            start: dateProperty.date.start,
            end: dateProperty.date.end,
          }
        : null;

    // destination (rich_text 또는 url)
    const destinationProperty = properties[NOTION_PROPERTIES.DESTINATION];
    let destination: string | null = null;
    if (destinationProperty) {
      if ('rich_text' in destinationProperty) {
        destination = destinationProperty.rich_text.map((text) => text.plain_text).join('') || null;
      } else if ('url' in destinationProperty && destinationProperty.url) {
        destination = destinationProperty.url;
      }
    }

    // companions (multi_select 또는 people)
    const companionsProperty = properties[NOTION_PROPERTIES.COMPANIONS];
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

    // coverPhoto (files)
    const coverPhotoProperty = properties[NOTION_PROPERTIES.COVER_PHOTO];
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

    // summary (rich_text)
    const summaryProperty = properties[NOTION_PROPERTIES.SUMMARY];
    const summary =
      summaryProperty && 'rich_text' in summaryProperty
        ? summaryProperty.rich_text.map((text) => text.plain_text).join('') || null
        : null;

    return {
      id: page.id,
      travelName,
      date,
      destination,
      companions,
      coverPhoto,
      summary,
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
    // 스켈레톤 테스트를 위한 지연
    // await new Promise((resolve) => setTimeout(resolve, 2000));

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
