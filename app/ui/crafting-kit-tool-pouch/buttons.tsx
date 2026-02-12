import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCraftingKitToolPouch } from '@/app/lib/actions';

export function CreateCraftingKitToolPouch() {
  return (
    <Link
      href="/dashboard/crafting-kit-tool-pouch/create"
      className="flex h-10 items-center rounded-lg bg-thorny-purple px-4 text-sm font-medium text-silk-white transition-colors hover:bg-thorny-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thorny-purple"
    >
      <span className="hidden md:block">Create Item</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCraftingKitToolPouch({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/crafting-kit-tool-pouch/${id}/edit`}
      className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-purple transition-colors"
    >
      <PencilIcon className="w-5 text-silk-silver hover:text-thorny-purple" />
    </Link>
  );
}

export function DeleteCraftingKitToolPouch({ id }: { id: string }) {
  const deleteCraftingKitToolPouchWithId = deleteCraftingKitToolPouch.bind(null, id);

  return (
    <form action={deleteCraftingKitToolPouchWithId}>
      <button className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-red transition-colors">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-silk-silver hover:text-thorny-red" />
      </button>
    </form>
  );
}
