import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteSilkHeart } from '@/app/lib/actions';

export function CreateSilkHeart() {
  return (
    <Link
      href="/dashboard/silk-hearts/create"
      className="flex h-10 items-center rounded-lg bg-thorny-purple px-4 text-sm font-medium text-silk-white transition-colors hover:bg-thorny-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thorny-purple"
    >
      <span className="hidden md:block">Create Silk Heart</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSilkHeart({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/silk-hearts/${id}/edit`}
      className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-purple transition-colors"
    >
      <PencilIcon className="w-5 text-silk-silver hover:text-thorny-purple" />
    </Link>
  );
}

export function DeleteSilkHeart({ id }: { id: string }) {
  const deleteSilkHeartWithId = deleteSilkHeart.bind(null, id);

  return (
    <form action={deleteSilkHeartWithId}>
      <button className="rounded-md border border-silk-silver p-2 hover:bg-void-black hover:border-thorny-red transition-colors">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-silk-silver hover:text-thorny-red" />
      </button>
    </form>
  );
}
