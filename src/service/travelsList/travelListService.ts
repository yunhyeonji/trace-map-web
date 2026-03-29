import { CommonResponse } from '../common';

import { ImageUploadResponse, Travel, TravelCreateRequest, TravelCreateResponse } from './types';

export const getTravelsList = async (): Promise<CommonResponse<Travel[]>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/list`, {
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

export const createTravel = async (
  data: TravelCreateRequest
): Promise<CommonResponse<TravelCreateResponse>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '여행 기록 생성 실패');
  }

  return res.json();
};

export const uploadTravelImages = async (
  files: File[]
): Promise<CommonResponse<ImageUploadResponse>> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travels/images`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '이미지 업로드 실패');
  }

  return res.json();
};
