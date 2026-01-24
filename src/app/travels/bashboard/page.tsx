import { React } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import StatCard from './components/StatCard';
import { statData } from './data';

export default function DashboardPage() {
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
        <Card className="flex min-h-125 flex-col lg:col-span-3">
          <CardHeader>
            <CardTitle>나의 여행 발자취</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/20 relative flex-1 overflow-hidden rounded-b-xl">
            <div className="text-muted-foreground absolute inset-0 flex items-center justify-center italic">
              Map Component Loading...
            </div>
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
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center">
            Donut Chart
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">올해의 흐름</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center">
            Line Chart
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">계절/동행인</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center">
            Radar or Bar Chart
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
