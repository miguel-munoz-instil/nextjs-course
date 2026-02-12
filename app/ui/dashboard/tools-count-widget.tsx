import { fetchToolsCount } from '@/app/lib/data';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export default async function ToolsCountWidget() {
  const { collected, total } = await fetchToolsCount();
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-void-black border-2 border-needle-green p-6 shadow-sm hover:border-thorny-purple transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-silk-silver">
            Tools Collected
          </p>
          <p className="mt-2 text-4xl font-bold text-silk-white">
            {collected} <span className="text-2xl text-silk-silver">/ {total}</span>
          </p>
          <p className="mt-1 text-xs text-needle-green">
            {percentage}% of all tools
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-needle-green/20">
          <WrenchScrewdriverIcon className="h-8 w-8 text-needle-green" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-2 bg-void-black rounded-full overflow-hidden border border-silk-silver/30">
          <div
            className="h-full bg-needle-green transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-silk-silver">{percentage}%</span>
      </div>
    </div>
  );
}
