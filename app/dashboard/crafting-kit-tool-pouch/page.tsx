import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import CraftingKitToolPouchTable from '@/app/ui/crafting-kit-tool-pouch/table';
import { CreateCraftingKitToolPouch } from '@/app/ui/crafting-kit-tool-pouch/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchCraftingKitToolPouchPages } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crafting Kit + Tool Pouch',
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
  const totalPages = await fetchCraftingKitToolPouchPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-silk-white`}>Crafting Kit + Tool Pouch</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search items..." />
        <CreateCraftingKitToolPouch />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <CraftingKitToolPouchTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
