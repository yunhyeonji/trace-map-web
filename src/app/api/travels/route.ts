import { NextResponse } from 'next/server';

import { getTravelList } from '@/service/travels/travelService';

export async function GET() {
  try {
    const travels = await getTravelList();
    return NextResponse.json(travels);
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json({ error: '여행 데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
