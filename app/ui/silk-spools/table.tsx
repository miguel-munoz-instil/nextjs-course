import { UpdateSilkSpool, DeleteSilkSpool } from '@/app/ui/silk-spools/buttons';
import SilkSpoolStatus from '@/app/ui/silk-spools/status';
import { fetchFilteredSilkSpools } from '@/app/lib/data';

export default async function SilkSpoolsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const spools = await fetchFilteredSilkSpools(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-void-black border border-thorny-purple p-2 md:pt-0">
          <div className="md:hidden">
            {spools?.map((spool) => (
              <div
                key={spool.id}
                className="mb-2 w-full rounded-md bg-black border border-silk-silver/30 p-4"
              >
                <div className="flex items-center justify-between border-b border-silk-silver/30 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-silk-white font-medium">{spool.name}</p>
                    </div>
                    <p className="text-sm text-silk-silver">{spool.notes || 'No notes'}</p>
                  </div>
                  <SilkSpoolStatus status={spool.status} />
                </div>
                <div className="flex w-full items-center justify-end pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateSilkSpool id={spool.id} />
                    <DeleteSilkSpool id={spool.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-silk-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 text-silk-silver">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-silk-silver">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-silk-silver">
                  Notes
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-black">
              {spools?.map((spool) => (
                <tr
                  key={spool.id}
                  className="w-full border-b border-silk-silver/30 py-3 text-sm last-of-type:border-none hover:bg-void-black/50 transition-colors"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p className="text-silk-white font-medium">{spool.name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <SilkSpoolStatus status={spool.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-silk-silver">
                    {spool.notes || '-'}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSilkSpool id={spool.id} />
                      <DeleteSilkSpool id={spool.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
