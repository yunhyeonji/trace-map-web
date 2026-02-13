import { CommonResponse } from '../common';

import { Travel } from './types';

export const getTravelsList = async (): Promise<CommonResponse<Travel[]>> => {
  const res = await fetch(`${process.env.API_BASE_URL}/travels/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('여행 목록 조회 실패');
  }

  return res.json();
};
