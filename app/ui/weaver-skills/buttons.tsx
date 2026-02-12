import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteWeaverSkill } from '@/app/lib/actions';

export function CreateWeaverSkill() {
  return (
    <Link
      href="/dashboard/weaver-skills/create"
      className="flex h-10 items-center rounded-lg bg-thorny-red px-4 text-sm font-medium text-silk-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-thorny-red"
    >
      <span className="hidden md:block">Create Weaver Skill</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateWeaverSkill({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/weaver-skills/${id}/edit`}
      className="rounded-md border border-thorny-purple p-2 hover:bg-thorny-purple hover:text-silk-white transition-colors"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteWeaverSkill({ id }: { id: string }) {
  const deleteWeaverSkillWithId = deleteWeaverSkill.bind(null, id);

  return (
    <form action={deleteWeaverSkillWithId}>
      <button className="rounded-md border border-thorny-red p-2 hover:bg-thorny-red hover:text-silk-white transition-colors">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
