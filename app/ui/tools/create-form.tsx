'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { createTool, ToolState } from '@/app/lib/actions';

export default function Form() {
  const initialState: ToolState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createTool, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-void-black border border-thorny-purple p-4 md:p-6">
        {/* Tool Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-silk-white">
            Tool Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter tool name"
              className="peer block w-full rounded-md border border-silk-silver bg-black text-silk-white py-2 px-3 text-sm outline-2 placeholder:text-silk-silver focus:border-thorny-red"
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

        {/* Tool Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-silk-white">
            Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              placeholder="Enter notes (optional)"
              rows={3}
              className="peer block w-full rounded-md border border-silk-silver bg-black text-silk-white py-2 px-3 text-sm outline-2 placeholder:text-silk-silver focus:border-thorny-red"
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

        {/* Tool Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-silk-white">
            Set the tool status
          </legend>
          <div className="rounded-md border border-silk-silver bg-black px-[14px] py-3">
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
          {state.message && (
            <div
              className="mt-4 flex items-center gap-2 text-sm text-thorny-red"
              aria-live="polite"
              aria-atomic="true"
            >
              <p>{state.message}</p>
            </div>
          )}
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/tools"
          className="flex h-10 items-center rounded-lg bg-void-black border border-silk-silver px-4 text-sm font-medium text-silk-white transition-colors hover:bg-thorny-purple"
        >
          Cancel
        </Link>
        <Button type="submit">Create Tool</Button>
      </div>
    </form>
  );
}
