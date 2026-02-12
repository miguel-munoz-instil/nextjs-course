'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import { updateTool, ToolState } from '@/app/lib/actions';
import { ToolForm } from '@/app/lib/definitions';

export default function EditToolForm({ tool }: { tool: ToolForm }) {
  const initialState: ToolState = { message: null, errors: {} };
  const updateToolWithId = updateTool.bind(null, tool.id);
  const [state, formAction] = useActionState(updateToolWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Tool Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Tool Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={tool.name}
              placeholder="Enter tool name"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tool Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              defaultValue={tool.notes}
              placeholder="Enter notes (optional)"
              rows={3}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="notes-error"
            />
          </div>
          <div id="notes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.notes &&
              state.errors.notes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tool Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the tool status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={tool.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
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
                  defaultChecked={tool.status === 'collected'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="collected"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Collected <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          {state.message && (
            <div
              className="mt-4 flex items-center gap-2 text-sm text-red-500"
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
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Tool</Button>
      </div>
    </form>
  );
}
