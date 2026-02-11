// import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// import { notionClient } from '@/lib/notion';

// import { CommonResponse } from '../common';
// import { parseListData } from '../travelsList/travelListService';
// import { NOTION_PROPERTIES, Travel } from '../travelsList/types';

// import { DashboardData } from './types';

// export const getDashboardStats = async (): Promise<CommonResponse<DashboardData>> => {
//   try {
//     // 1. 직접 노션 데이터 쿼리
//     const response = await notionClient.databases.query({
//       database_id: process.env.NOTION_DATABASE_ID!,
//       sorts: [{ property: NOTION_PROPERTIES.DATE, direction: 'descending' }],
//     });

//     const travels = response.results
//       .filter((page): page is PageObjectResponse => 'properties' in page)
//       .map(parseListData)
//       .filter((t): t is Travel => t !== null);

//     const now = new Date();
//     const currentYear = now.getFullYear();

//     // 2. 집계 로직
//     const visitedCodes = Array.from(
//       new Set(travels.map((t) => t.countryCode).filter(Boolean))
//     ) as string[];

//     const tripsThisYear = travels.filter((t) => {
//       if (!t.date?.start) return false;
//       return new Date(t.date.start).getFullYear() === currentYear;
//     }).length;

//     const countryCounts: Record<string, { name: string; count: number }> = {};
//     travels.forEach((t) => {
//       if (t.countryCode && t.country) {
//         countryCounts[t.countryCode] = {
//           name: t.country,
//           count: (countryCounts[t.countryCode]?.count || 0) + 1,
//         };
//       }
//     });

//     const mostVisited = Object.values(countryCounts).sort((a, b) => b.count - a.count)[0] || {
//       name: '미정',
//       count: 0,
//     };

//     const totalDays = travels.reduce((acc, t) => {
//       if (t.date?.start && t.date?.end) {
//         const start = new Date(t.date.start);
//         const end = new Date(t.date.end);
//         const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
//         return acc + (diff > 0 ? diff : 0);
//       }
//       return acc;
//     }, 0);

//     const cities = new Set(
//       travels
//         .flatMap((t) => t.citys || [])
//         .map((city) => city.trim())
//         .filter(Boolean)
//     );

//     return {
//       success: true,
//       status: { code: 200, message: '대시보드 데이터를 성공적으로 가져왔습니다.' },
//       data: {
//         stats: {
//           totalCountries: visitedCodes.length,
//           totalCities: cities.size,
//           tripsThisYear,
//           mostVisited,
//           totalDays,
//         },
//         mapData: {
//           visitedCodes,
//         },
//         travels: travels,
//       },
//     };
//   } catch (error) {
//     console.error('getDashboardStats Error:', error);
//     throw new Error('대시보드 데이터를 생성하는 중에 문제가 발생했습니다.');
//   }
// };

// /** 월별 여행 횟수 집계 함수 */
// export const getMonthlyTravelCount = (travels: Travel[]) => {
//   const currentYear = new Date().getFullYear();

//   const monthly = Array.from({ length: 12 }, (_, i) => ({
//     month: i + 1,
//     count: 0,
//   }));

//   travels.forEach((t) => {
//     const start = t.date?.start;
//     if (!start) return;

//     const date = new Date(start);
//     if (isNaN(date.getTime())) return;

//     const year = date.getFullYear();
//     const monthIndex = date.getMonth();

//     if (year !== currentYear) return;
//     if (monthIndex < 0 || monthIndex > 11) return;
//     if (!monthly[monthIndex]) return;

//     monthly[monthIndex].count += 1;
//   });

//   return monthly;
// };
