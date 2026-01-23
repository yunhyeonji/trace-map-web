import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const ListSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 py-6 md:flex-row">
      {/* --- 좌측 필터 사이드바 스켈레톤 --- */}
      <aside className="sticky top-(--sticky-top) flex h-fit w-full flex-col gap-6 rounded-xl border px-3 py-2 md:w-64">
        <Skeleton className="h-6 w-24" />
        <Separator />

        <div>
          <Skeleton className="mb-4 h-5 w-20" />
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="mb-4 h-5 w-20" />
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* --- 우측 리스트 영역 스켈레톤 --- */}
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="mb-2 h-5 w-32" />

        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border py-0">
            {/* 이미지 영역 스켈레톤 */}
            <div className="relative aspect-3/1 overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>

            <CardContent className="p-6">
              {/* 제목 스켈레톤 */}
              <Skeleton className="mb-2 h-7 w-3/4" />

              {/* 요약 스켈레톤 */}
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* 날짜 및 동행자 정보 스켈레톤 */}
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListSkeleton;
