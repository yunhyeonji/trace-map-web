import React from 'react';

import { Calendar, Clock, Globe, MapPin } from 'lucide-react';

export interface StatCardType {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const iconClassName = 'text-muted-foreground h-9 w-9';

export const statData: StatCardType[] = [
  {
    title: '지구 한 바퀴',
    value: '12',
    description: '지금까지 12개국, 45개 도시를 방문했어요.',
    icon: <Globe className={iconClassName} />,
  },
  {
    title: '올해의 기록',
    value: '3회',
    description: '2026년에만 3번의 새로운 여행을 떠났네요!',
    icon: <Calendar className={iconClassName} />,
  },
  {
    title: '최애 국가',
    value: '일본',
    description: '가장 자주 간 나라는 일본(5회)이에요!',
    icon: <MapPin className={iconClassName} />,
  },
  {
    title: '여행 기간',
    value: '128일',
    description: '총 128일 동안 길 위에서 시간을 보냈어요.',
    icon: <Clock className={iconClassName} />,
  },
];
