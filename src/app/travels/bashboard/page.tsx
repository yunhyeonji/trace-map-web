import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/ui/common/ErrorFallback';
// import { getDashboardStats } from '@/service/dashboard/dashboardService';

import DashboardSkeleton from './components/DashboardSkeleton';
import DashboardSuspence from './components/DashboardSuspence.client';

export default async function DashboardPage() {
  // const promiseDashBoard = getDashboardStats();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<DashboardSkeleton />}>
        {/* <DashboardSuspence promiseDashBoard={promiseDashBoard} /> */}
      </Suspense>
    </ErrorBoundary>
  );
}
