'use client';
import { use } from 'react';

import { Calendar, Clock, Globe, MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommonResponse } from '@/service/common';
import { getMonthlyTravelCount } from '@/service/dashboard/dashboardService';
import { DashboardData } from '@/service/dashboard/types';

import StatCard from './StatCard';
import TravelTrendChart from './TravelTrendChart.client';
import WorldMapClient from './WorldMap.client';

interface Props {
  promiseDashBoard: Promise<CommonResponse<DashboardData>>;
}

function DashboardSuspence({ promiseDashBoard }: Props) {
  const { data } = use(promiseDashBoard);

  const iconClassName = 'text-muted-foreground h-9 w-9';
  const statData = [
    {
      title: '지구 한 바퀴',
      value: `${data.stats.totalCountries.toLocaleString()}`,
      description: `지금까지 ${data.stats.totalCountries.toLocaleString()}개국, ${data.stats.totalCities.toLocaleString()}개 도시를 방문했어요.`,
      icon: <Globe className={iconClassName} />,
    },
    {
      title: '올해의 기록',
      value: `${data.stats.tripsThisYear.toLocaleString()}회`,
      description: `2026년에만 ${data.stats.tripsThisYear.toLocaleString()}번의 새로운 여행을 떠났네요!`,
      icon: <Calendar className={iconClassName} />,
    },
    {
      title: '최애 국가',
      value: data.stats.mostVisited.name,
      description: `가장 자주 간 나라는 ${data.stats.mostVisited.name}(${data.stats.mostVisited.count.toLocaleString()}회)이에요!`,
      icon: <MapPin className={iconClassName} />,
    },
    {
      title: '여행 기간',
      value: `${data.stats.totalDays.toLocaleString()}일`,
      description: `총 ${data.stats.totalDays.toLocaleString()}일 동안 길 위에서 시간을 보냈어요.`,
      icon: <Clock className={iconClassName} />,
    },
  ];

  return (
    <div className="bg-background flex flex-col gap-6 p-4 md:p-8">
      {/* 1. 상단 요약 카드 영역 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statData.map((data) => (
          <StatCard
            key={data.title}
            title={data.title}
            value={data.value}
            description={data.description}
            icon={data.icon}
          />
        ))}
      </div>

      {/* 2. 메인 지도 영역 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="flex flex-col pb-0 lg:col-span-3">
          <CardHeader>
            <CardTitle>나의 여행 발자취</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/20 relative overflow-hidden rounded-b-xl p-0">
            <WorldMapClient visitedCodes={data.mapData.visitedCodes} travels={data.travels} />
          </CardContent>
        </Card>

        {/* 지도 옆 보조 정보 (가장 최근 여행 등) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">실시간 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground space-y-4 text-sm"></div>
          </CardContent>
        </Card>
      </div>

      {/* 3. 하단 차트 영역 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">대륙별 분포</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center px-2">
            Donut Chart
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">올해의 흐름</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center px-2">
            <TravelTrendChart data={getMonthlyTravelCount(data.travels)} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">계절/동행인</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center px-2">
            Radar or Bar Chart
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardSuspence;
