'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateAbility, AbilityState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { AbilityForm } from '@/app/lib/definitions';
import { BoltIcon } from '@heroicons/react/24/outline';

export default function EditAbilityForm({ ability }: { ability: AbilityForm }) {
  const initialState: AbilityState = { message: null, errors: {} };
  const updateAbilityWithId = updateAbility.bind(null, ability.id);
  const [state, formAction] = useActionState(updateAbilityWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-void-black border border-thorny-purple p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-silk-white">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={ability.name}
              placeholder="Enter ability name"
              className="peer block w-full rounded-md border border-silk-silver bg-void-black py-2 pl-10 text-sm text-silk-white placeholder:text-silk-silver/50 focus:border-thorny-purple focus:outline-none focus:ring-1 focus:ring-thorny-purple"
              aria-describedby="name-error"
            />
            <BoltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-silk-silver peer-focus:text-thorny-purple" />
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

        {/* Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium text-silk-white">
            Set the ability status
          </legend>
          <div className="rounded-md border border-silk-silver bg-void-black px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={ability.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-silk-silver bg-void-black text-thorny-purple focus:ring-2 focus:ring-thorny-purple"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-silk-silver/20 px-3 py-1.5 text-xs font-medium text-silk-silver"
                >
                  Pending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="collected"
                  name="status"
                  type="radio"
                  value="collected"
                  defaultChecked={ability.status === 'collected'}
                  className="h-4 w-4 cursor-pointer border-silk-silver bg-void-black text-thorny-purple focus:ring-2 focus:ring-thorny-purple"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="collected"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-needle-green/20 px-3 py-1.5 text-xs font-medium text-needle-green"
                >
                  Collected
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

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-silk-white">
            Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={ability.notes}
              placeholder="Enter notes about this ability"
              className="peer block w-full rounded-md border border-silk-silver bg-void-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver/50 focus:border-thorny-purple focus:outline-none focus:ring-1 focus:ring-thorny-purple"
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

        {/* Hidden Percentage Field */}
        <input type="hidden" name="percentage" value={ability.percentage} />

        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-thorny-red">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/abilities"
          className="flex h-10 items-center rounded-lg bg-silk-silver/20 px-4 text-sm font-medium text-silk-silver transition-colors hover:bg-silk-silver/30"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Ability</Button>
      </div>
    </form>
  );
}
