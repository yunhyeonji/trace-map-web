'use client';
import React, { use } from 'react';

import Link from 'next/link';

import { Travel } from '@/service/travels/types';

import { TravelCard } from './TravelCard';

interface Props {
  promiseTravels: Promise<Travel[]>;
}

const TravelsSuspence = ({ promiseTravels }: Props) => {
  const travels = use(promiseTravels);

  return (
    <div className="flex flex-col gap-4 py-4">
      {travels.length === 0 ? (
        <div className="text-muted-foreground p-4 text-center">여행 기록이 없습니다.</div>
      ) : (
        travels.map((travel) => (
          <Link key={travel.id} href={`travels/${travel.id}`}>
            <TravelCard travel={travel} />
          </Link>
        ))
      )}
    </div>
  );
};

export default TravelsSuspence;
