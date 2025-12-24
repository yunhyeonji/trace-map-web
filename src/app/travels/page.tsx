'use client';

import { useEffect, useState } from 'react';

import { TravelCard } from '@/app/travels/components/TravelCard';
import { Travel } from '@/service/travels/types';

const TravelsPage = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await fetch('/api/travels');
        if (!response.ok) {
          throw new Error('데이터 로딩 실패');
        }
        const data = await response.json();
        setTravels(data);
      } catch (error) {
        console.error('여행 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();
  }, []);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="container">
      <div className="flex flex-col gap-4 py-4">
        {travels.length === 0 ? (
          <div className="text-muted-foreground p-4 text-center">여행 기록이 없습니다.</div>
        ) : (
          travels.map((travel) => (
            <TravelCard
              key={travel.id}
              travel={travel}
              isSelected={selectedId === travel.id}
              onClick={() => setSelectedId(travel.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TravelsPage;
