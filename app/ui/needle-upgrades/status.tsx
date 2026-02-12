import { ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function NeedleUpgradeStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-silk-silver text-void-black': status === 'pending',
          'bg-needle-green text-void-black': status === 'collected',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4" />
        </>
      ) : null}
      {status === 'collected' ? (
        <>
          Collected
          <CheckIcon className="ml-1 w-4" />
        </>
      ) : null}
    </span>
  );
}
