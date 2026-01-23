import { Suspense } from 'react';

import { getTravelList } from '@/service/travels/travelService';

import ListSkeleton from './components/ListSkeleton';
import TravelsSuspence from './components/TravelsSuspence.client';

const TravelsPage = async () => {
  const promiseTravels = getTravelList();

  return (
    <div className="container">
      <Suspense fallback={<ListSkeleton />}>
        <TravelsSuspence promiseTravels={promiseTravels} />
      </Suspense>
    </div>
  );
};

export default TravelsPage;
