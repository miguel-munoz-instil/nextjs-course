import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import SilkHeartsTable from '@/app/ui/silk-hearts/table';
import { CreateSilkHeart } from '@/app/ui/silk-hearts/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchSilkHeartsPages } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Silk Hearts',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchSilkHeartsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-silk-white`}>Silk Hearts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search silk hearts..." />
        <CreateSilkHeart />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <SilkHeartsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
