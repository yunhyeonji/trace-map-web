import { Calendar, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
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
              <div className="flex items-center gap-1.5">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="text-muted-foreground h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListSkeleton;
