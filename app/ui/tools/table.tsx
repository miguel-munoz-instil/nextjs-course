import { UpdateTool, DeleteTool } from '@/app/ui/tools/buttons';
import ToolStatus from '@/app/ui/tools/status';
import { fetchFilteredTools } from '@/app/lib/data';

export default async function ToolsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const tools = await fetchFilteredTools(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-void-black p-2 md:pt-0 border border-thorny-purple">
          <div className="md:hidden">
            {tools?.map((tool) => (
              <div
                key={tool.id}
                className="mb-2 w-full rounded-md bg-black border border-silk-silver p-4"
              >
                <div className="flex items-center justify-between border-b border-silk-silver pb-4">
                  <div>
                    <p className="text-sm font-medium text-silk-white">{tool.name}</p>
                  </div>
                  <ToolStatus status={tool.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm text-silk-silver">{tool.notes}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateTool id={tool.id} />
                    <DeleteTool id={tool.id} />
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
              {tools?.map((tool) => (
                <tr
                  key={tool.id}
                  className="w-full border-b border-void-black py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p className="text-silk-white">{tool.name}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ToolStatus status={tool.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-silk-silver">
                    {tool.notes}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTool id={tool.id} />
                      <DeleteTool id={tool.id} />
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
