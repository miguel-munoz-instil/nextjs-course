import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function CrestStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-silk-silver/20 text-silk-silver': status === 'pending',
          'bg-needle-green/20 text-needle-green': status === 'collected',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-silk-silver" />
        </>
      ) : null}
      {status === 'collected' ? (
        <>
          Collected
          <CheckIcon className="ml-1 w-4 text-needle-green" />
        </>
      ) : null}
    </span>
  );
}
