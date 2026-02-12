import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import MaskShardsTable from '@/app/ui/mask-shards/table';
import { CreateMaskShard } from '@/app/ui/mask-shards/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchMaskShardsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mask Shards',
};

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchMaskShardsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-silk-white`}>Mask Shards</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search mask shards..." />
        <CreateMaskShard />
      </div>
      <Suspense key={query + currentPage} fallback={<div className="text-silk-white">Loading...</div>}>
        <MaskShardsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
