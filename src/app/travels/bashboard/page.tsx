import { getDashboardStats } from '@/service/dashboard/dashboardService';

import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import DashboardSkeleton from './components/DashboardSkeleton';
import DashboardSuspence from './components/DashboardSuspence.client';
import { ErrorFallback } from '@/components/ui/common/ErrorFallback';

export default async function DashboardPage() {
  const promiseDashBoard = getDashboardStats();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardSuspence promiseDashBoard={promiseDashBoard} />
      </Suspense>
    </ErrorBoundary>
  );
}
