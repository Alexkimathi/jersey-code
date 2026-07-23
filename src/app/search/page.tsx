import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><div className="max-w-7xl mx-auto px-4 py-8"><div className="text-center py-12">Loading search...</div></div></div>}>
      <SearchClient />
    </Suspense>
  );
}
