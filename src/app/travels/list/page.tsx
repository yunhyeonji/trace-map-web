import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { getTravelsList } from '@/service/travelsList/travelListService';

import { ErrorFallback } from '../../../components/ui/common/ErrorFallback';

import ListSkeleton from './components/ListSkeleton';
import TravelsSuspence from './components/TravelsSuspence.client';

const TravelsPage = async () => {
  const promiseTravels = getTravelsList();

  return (
    <div className="container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<ListSkeleton />}>
          <TravelsSuspence promiseTravels={promiseTravels} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TravelsPage;
