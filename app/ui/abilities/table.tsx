import { UpdateAbility, DeleteAbility } from '@/app/ui/abilities/buttons';
import AbilityStatus from '@/app/ui/abilities/status';
import { fetchFilteredAbilities } from '@/app/lib/data';

export default async function AbilitiesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const abilities = await fetchFilteredAbilities(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-void-black p-2 md:pt-0 border border-silk-silver/30">
          <div className="md:hidden">
            {abilities?.map((ability) => (
              <div
                key={ability.id}
                className="mb-2 w-full rounded-md bg-void-black border border-thorny-purple p-4"
              >
                <div className="flex items-center justify-between border-b border-silk-silver/30 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-silk-white">{ability.name}</p>
                    </div>
                    <p className="text-sm text-silk-silver">{ability.notes}</p>
                  </div>
                  <AbilityStatus status={ability.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateAbility id={ability.id} />
                    <DeleteAbility id={ability.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-silk-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Notes
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-void-black">
              {abilities?.map((ability) => (
                <tr
                  key={ability.id}
                  className="w-full border-b border-silk-silver/30 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-thorny-purple/10"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-silk-white">{ability.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <AbilityStatus status={ability.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-silk-silver">
                    {ability.notes}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAbility id={ability.id} />
                      <DeleteAbility id={ability.id} />
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
