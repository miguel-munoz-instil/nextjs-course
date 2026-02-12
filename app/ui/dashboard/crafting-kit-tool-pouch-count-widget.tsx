import { CubeIcon } from '@heroicons/react/24/outline';
import { fetchCraftingKitToolPouchCount } from '@/app/lib/data';

export default async function CraftingKitToolPouchCountWidget() {
  const { collected, total } = await fetchCraftingKitToolPouchCount();
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-void-black border-2 border-silk-silver p-6 shadow-sm hover:border-needle-green transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-silk-silver">
            Crafting Kit + Tool Pouch
          </p>
          <p className="mt-2 text-3xl font-bold text-silk-white">
            {collected}/{total}
          </p>
          <p className="mt-1 text-xs text-silk-silver">
            {percentage}% complete
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-silk-silver/20">
          <CubeIcon className="h-6 w-6 text-silk-silver" />
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-void-black rounded-full overflow-hidden border border-silk-silver/30">
        <div
          className="h-full bg-silk-silver transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
