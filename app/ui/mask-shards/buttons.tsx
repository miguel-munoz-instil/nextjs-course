import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteMaskShard } from '@/app/lib/actions';

export function CreateMaskShard() {
  return (
    <Link
      href="/dashboard/mask-shards/create"
      className="flex h-10 items-center rounded-lg bg-thorny-red px-4 text-sm font-medium text-silk-white transition-colors hover:bg-thorny-red/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thorny-red"
    >
      <span className="hidden md:block">Create Mask Shard</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateMaskShard({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/mask-shards/${id}/edit`}
      className="rounded-md border border-thorny-purple p-2 hover:bg-thorny-purple/20 transition-colors"
    >
      <PencilIcon className="w-5 text-thorny-purple" />
    </Link>
  );
}

export function DeleteMaskShard({ id }: { id: string }) {
  const deleteMaskShardWithId = deleteMaskShard.bind(null, id);
  
  return (
    <form action={deleteMaskShardWithId}>
      <button className="rounded-md border border-thorny-red p-2 hover:bg-thorny-red/20 transition-colors">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-thorny-red" />
      </button>
    </form>
  );
}
