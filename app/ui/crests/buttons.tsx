import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCrest } from '@/app/lib/actions';

export function CreateCrest() {
  return (
    <Link
      href="/dashboard/crests/create"
      className="flex h-10 items-center rounded-lg bg-thorny-purple px-4 text-sm font-medium text-silk-white transition-colors hover:bg-thorny-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thorny-purple"
    >
      <span className="hidden md:block">Create Crest</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCrest({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/crests/${id}/edit`}
      className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-purple transition-colors"
    >
      <PencilIcon className="w-5 text-silk-silver hover:text-thorny-purple" />
    </Link>
  );
}

export function DeleteCrest({ id }: { id: string }) {
  const deleteCrestWithId = deleteCrest.bind(null, id);

  return (
    <form action={deleteCrestWithId}>
      <button className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-red transition-colors">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-silk-silver hover:text-thorny-red" />
      </button>
    </form>
  );
}
