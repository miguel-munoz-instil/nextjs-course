'use client';

import Link from 'next/link';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createWeaverSkill, WeaverSkillState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() {
  const initialState: WeaverSkillState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createWeaverSkill, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-void-black border border-thorny-purple p-4 md:p-6">
        {/* Weaver Skill Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-silk-white">
            Weaver Skill Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter weaver skill name"
              className="peer block w-full rounded-md border border-thorny-purple bg-void-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver outline-2 focus:border-thorny-red"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-thorny-red" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-silk-white">
            Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              placeholder="Add notes (optional)"
              rows={4}
              className="peer block w-full rounded-md border border-thorny-purple bg-void-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver outline-2 focus:border-thorny-red"
              aria-describedby="notes-error"
            />
          </div>
          <div id="notes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.notes &&
              state.errors.notes.map((error: string) => (
                <p className="mt-2 text-sm text-thorny-red" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Percentage */}
        <div className="mb-4">
          <label htmlFor="percentage" className="mb-2 block text-sm font-medium text-silk-white">
            Percentage
          </label>
          <div className="relative">
            <input
              id="percentage"
              name="percentage"
              type="number"
              min="1"
              defaultValue="1"
              className="peer block w-full rounded-md border border-thorny-purple bg-void-black py-2 px-3 text-sm text-silk-white outline-2 focus:border-thorny-red"
            />
          </div>
        </div>

        {/* Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-silk-white">
            Set the weaver skill status
          </legend>
          <div className="rounded-md border border-thorny-purple bg-void-black px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked
                  className="h-4 w-4 cursor-pointer border-silk-silver bg-void-black text-silk-silver focus:ring-2 focus:ring-thorny-red"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-silk-silver px-3 py-1.5 text-xs font-medium text-void-black"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="collected"
                  name="status"
                  type="radio"
                  value="collected"
                  className="h-4 w-4 cursor-pointer border-silk-silver bg-void-black text-needle-green focus:ring-2 focus:ring-thorny-red"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="collected"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-needle-green px-3 py-1.5 text-xs font-medium text-silk-white"
                >
                  Collected <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-thorny-red" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
        {state.message && (
          <div
            className="mt-4 p-3 rounded-md bg-thorny-red/20 border border-thorny-red"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-sm text-thorny-red">{state.message}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/weaver-skills"
          className="flex h-10 items-center rounded-lg bg-void-black border border-silk-silver px-4 text-sm font-medium text-silk-white transition-colors hover:bg-silk-silver hover:text-void-black"
        >
          Cancel
        </Link>
        <Button type="submit">Create Weaver Skill</Button>
      </div>
    </form>
  );
}
