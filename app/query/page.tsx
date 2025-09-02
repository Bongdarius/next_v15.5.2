'use client';

import QueryPage from '@/components/query/QueryPage';
import { Suspense } from 'react';

export default function Page() {
  const name = 20;
  const name2 = '20';
  return (
    <Suspense fallback={<div>Loading query...</div>}>
      <QueryPage />
    </Suspense>
  );
}
