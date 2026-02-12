import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import SilkSpoolsTable from '@/app/ui/silk-spools/table';
import { CreateSilkSpool } from '@/app/ui/silk-spools/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchSilkSpoolsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Silk Spools',
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
  const totalPages = await fetchSilkSpoolsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-silk-white`}>Silk Spools</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search silk spools..." />
        <CreateSilkSpool />
      </div>
      <Suspense key={query + currentPage} fallback={<div className="text-silk-white">Loading...</div>}>
        <SilkSpoolsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
