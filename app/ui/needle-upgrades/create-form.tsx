'use client';

import Link from 'next/link';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createNeedleUpgrade, NeedleUpgradeState } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() {
  const initialState: NeedleUpgradeState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createNeedleUpgrade, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-void-black border border-thorny-purple p-4 md:p-6">
        {/* Needle Upgrade Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-silk-white">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter needle upgrade name"
              className="peer block w-full rounded-md border border-thorny-purple bg-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver focus:border-thorny-red focus:outline-none focus:ring-1 focus:ring-thorny-red"
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
              rows={4}
              placeholder="Enter notes (optional)"
              className="peer block w-full rounded-md border border-thorny-purple bg-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver focus:border-thorny-red focus:outline-none focus:ring-1 focus:ring-thorny-red"
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
              defaultValue={1}
              min={1}
              className="peer block w-full rounded-md border border-thorny-purple bg-black py-2 px-3 text-sm text-silk-white placeholder:text-silk-silver focus:border-thorny-red focus:outline-none focus:ring-1 focus:ring-thorny-red"
              aria-describedby="percentage-error"
            />
          </div>
          <div id="percentage-error" aria-live="polite" aria-atomic="true">
            {state.errors?.percentage &&
              state.errors.percentage.map((error: string) => (
                <p className="mt-2 text-sm text-thorny-red" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-silk-white">
            Set the status
          </legend>
          <div className="rounded-md border border-thorny-purple bg-black px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked
                  className="h-4 w-4 cursor-pointer border-silk-silver bg-void-black text-thorny-purple focus:ring-2 focus:ring-thorny-red"
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
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-needle-green px-3 py-1.5 text-xs font-medium text-void-black"
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
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/needle-upgrades"
          className="flex h-10 items-center rounded-lg bg-void-black border border-silk-silver px-4 text-sm font-medium text-silk-white transition-colors hover:bg-silk-silver/20"
        >
          Cancel
        </Link>
        <Button type="submit">Create Needle Upgrade</Button>
      </div>
    </form>
  );
}
