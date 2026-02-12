import { SparklesIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-silk-white`}
    >
      <SparklesIcon className="h-12 w-12 animate-pulse" />
      <p className="text-[44px]">Silksong</p>
    </div>
  );
}
