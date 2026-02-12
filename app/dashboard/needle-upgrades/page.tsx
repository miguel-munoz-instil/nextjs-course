import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import NeedleUpgradesTable from '@/app/ui/needle-upgrades/table';
import { CreateNeedleUpgrade } from '@/app/ui/needle-upgrades/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchNeedleUpgradesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Needle Upgrades',
};

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
  const totalPages = await fetchNeedleUpgradesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-silk-white`}>Needle Upgrades</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search needle upgrades..." />
        <CreateNeedleUpgrade />
      </div>
      <Suspense key={query + currentPage} fallback={<div className="text-silk-white">Loading...</div>}>
        <NeedleUpgradesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
