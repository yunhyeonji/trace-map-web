import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notionClient } from '@/lib/notion';

import { CommonResponse } from '../common';

import { NOTION_PROPERTIES, Travel } from './types';

export const parseListData = (page: PageObjectResponse): Travel | null => {
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

    const countryProperty = properties[NOTION_PROPERTIES.COUNTRY];
    const country =
      countryProperty && 'select' in countryProperty ? countryProperty.select?.name || null : null;

    const countryCodeProperty = properties[NOTION_PROPERTIES.COUNTRYCODE];
    const countryCode =
      countryCodeProperty && 'rich_text' in countryCodeProperty
        ? countryCodeProperty.rich_text.map((t) => t.plain_text).join('') || null
        : null;

    const citysProperty = properties[NOTION_PROPERTIES.CITYS];
    let citys: string[] = [];
    if (citysProperty && 'multi_select' in citysProperty) {
      citys = citysProperty.multi_select.map((item) => item.name);
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
        : [];

    // 최종 반환 객체 속성명 통일
    return {
      id: page.id,
      travelName,
      date,
      location,
      country,
      countryCode,
      citys,
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

export const getTravelsList = async (): Promise<CommonResponse<Travel[]>> => {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [{ property: NOTION_PROPERTIES.DATE, direction: 'descending' }],
    });

    const travels = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(parseListData)
      .filter((post): post is Travel => post !== null);

    // --- 집계 로직 시작 (필터 데이터 계산) ---
    const countryStats: Record<string, { name: string; count: number }> = {};
    const yearStats: Record<string, number> = {};

    travels.forEach((t) => {
      if (t.country && t.countryCode) {
        countryStats[t.countryCode] = {
          name: t.country,
          count: (countryStats[t.countryCode]?.count || 0) + 1,
        };
      }
      if (t.date?.start) {
        const year = new Date(t.date.start).getFullYear().toString();
        yearStats[year] = (yearStats[year] || 0) + 1;
      }
    });

    return {
      success: true,
      status: { code: 200, message: '성공' },
      data: travels,
      metadata: {
        filters: [
          {
            type: 'country',
            title: '여행 국가',
            items: Object.entries(countryStats).map(([code, info]) => ({
              code,
              name: info.name,
              count: info.count,
            })),
          },
          {
            type: 'year',
            title: '여행 연도',
            items: Object.entries(yearStats)
              .map(([year, count]) => ({ code: year, name: `${year}년`, count }))
              .sort((a, b) => b.code.localeCompare(a.code)),
          },
        ],
      },
    };
  } catch (error) {
    console.error('getTravelsList Error:', error);
    throw new Error('노션 데이터를 가져오는 중에 문제가 발생했습니다.');
  }
};
