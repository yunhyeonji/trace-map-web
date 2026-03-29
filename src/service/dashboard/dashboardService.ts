import { CommonResponse } from '../common';
import { Travel } from '../travelsList/types';

import { DashboardData } from './types';

/** 월별 여행 횟수 집계 함수 */
export const getMonthlyTravelCount = (travels: Travel[]) => {
  const currentYear = new Date().getFullYear();

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: 0,
  }));

  travels.forEach((t) => {
    const start = t.startDate;
    if (!start) return;

    const date = new Date(start);
    if (isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    if (year !== currentYear) return;
    if (monthIndex < 0 || monthIndex > 11) return;
    if (!monthly[monthIndex]) return;

    monthly[monthIndex].count += 1;
  });

  return monthly;
};

export const getDashboardStats = async (): Promise<CommonResponse<DashboardData>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('대시보드 데이터 조회 실패');
  }

  return res.json();
};
