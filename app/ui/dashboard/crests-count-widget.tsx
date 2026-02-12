import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { fetchCrestsCount } from '@/app/lib/data';

export default async function CrestsCountWidget() {
  const { collected, total } = await fetchCrestsCount();
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-void-black border-2 border-needle-green p-6 shadow-sm hover:border-thorny-purple transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-silk-silver">
            Crests Collected
          </p>
          <p className="mt-2 text-3xl font-bold text-silk-white">
            {collected}/{total}
          </p>
          <p className="mt-1 text-xs text-silk-silver">
            {percentage}% complete
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-needle-green/20">
          <ShieldCheckIcon className="h-6 w-6 text-needle-green" />
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-void-black rounded-full overflow-hidden border border-silk-silver/30">
        <div
          className="h-full bg-needle-green transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
