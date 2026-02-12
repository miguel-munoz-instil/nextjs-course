import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function WeaverSkillStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-silk-silver text-void-black': status === 'pending',
          'bg-needle-green text-silk-white': status === 'collected',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-void-black" />
        </>
      ) : null}
      {status === 'collected' ? (
        <>
          Collected
          <CheckIcon className="ml-1 w-4 text-silk-white" />
        </>
      ) : null}
    </span>
  );
}
