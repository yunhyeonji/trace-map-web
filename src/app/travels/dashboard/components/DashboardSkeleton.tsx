import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="bg-background flex flex-col gap-6 p-4 md:p-8">
      {/* 1. 상단 요약 카드 영역 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="mb-2 h-8 w-32" />
                <Skeleton className="h-9 w-9 rounded" />
              </div>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. 메인 지도 영역 스켈레톤 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="flex flex-col pb-0 lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="bg-muted/20 relative overflow-hidden rounded-b-xl p-0">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>

        {/* 지도 옆 보조 정보 스켈레톤 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. 하단 차트 영역 스켈레톤 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="bg-muted/10 flex h-62.5 items-center justify-center">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
