import type { Metadata } from 'next';

import TripForm from '@/features/trips/components/form/TripForm';

export const metadata: Metadata = { title: '새 기록' };

export default function NewTripPage() {
  return <TripForm />;
}
