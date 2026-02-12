import { fetchWeaverSkillsCount } from '@/app/lib/data';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default async function WeaverSkillsCountWidget() {
  const { collected, total } = await fetchWeaverSkillsCount();
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-void-black border-2 border-thorny-purple p-6 shadow-sm hover:border-needle-green transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-silk-silver">
            Weaver Skills Collected
          </p>
          <p className="mt-2 text-4xl font-bold text-silk-white">
            {collected} <span className="text-2xl text-silk-silver">/ {total}</span>
          </p>
          <p className="mt-1 text-xs text-thorny-purple">
            {percentage}% of all skills
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-thorny-purple/20">
          <SparklesIcon className="h-8 w-8 text-thorny-purple" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-2 bg-void-black rounded-full overflow-hidden border border-silk-silver/30">
          <div
            className="h-full bg-thorny-purple transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-silk-silver">{percentage}%</span>
      </div>
    </div>
  );
}
