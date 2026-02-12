import { fetchCollectedToolsPercentage, fetchCollectedWeaverSkillsPercentage, fetchCollectedNeedleUpgradesPercentage, fetchCollectedMaskShardsPercentage, fetchCollectedSilkSpoolsPercentage, fetchCollectedSilkHeartsPercentage, fetchCollectedCraftingKitToolPouchPercentage, fetchCollectedCrestsPercentage, fetchCollectedAbilitiesPercentage } from '@/app/lib/data';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default async function CollectedPercentageWidget() {
  const toolsPercentage = await fetchCollectedToolsPercentage();
  const weaverSkillsPercentage = await fetchCollectedWeaverSkillsPercentage();
  const needleUpgradesPercentage = await fetchCollectedNeedleUpgradesPercentage();
  const maskShardsPercentage = await fetchCollectedMaskShardsPercentage();
  const silkSpoolsPercentage = await fetchCollectedSilkSpoolsPercentage();
  const silkHeartsPercentage = await fetchCollectedSilkHeartsPercentage();
  const craftingKitToolPouchPercentage = await fetchCollectedCraftingKitToolPouchPercentage();
  const crestsPercentage = await fetchCollectedCrestsPercentage();
  const abilitiesPercentage = await fetchCollectedAbilitiesPercentage();
  const totalPercentage = Number(toolsPercentage) + Number(weaverSkillsPercentage) + Number(needleUpgradesPercentage) + Number(maskShardsPercentage) + Number(silkSpoolsPercentage) + Number(silkHeartsPercentage) + Number(craftingKitToolPouchPercentage) + Number(crestsPercentage) + Number(abilitiesPercentage);

  return (
    <div className="rounded-xl bg-void-black border-2 border-thorny-purple p-6 shadow-sm hover:border-thorny-red transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-silk-silver">
            Collected Progress
          </p>
          <p className="mt-2 text-4xl font-bold text-silk-white">
            {totalPercentage}%
          </p>
          <p className="mt-1 text-xs text-silk-silver">
            Total completion percentage
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-thorny-purple/20">
          <SparklesIcon className="h-8 w-8 text-thorny-purple animate-pulse" />
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-void-black rounded-full overflow-hidden border border-silk-silver/30">
        <div
          className="h-full bg-gradient-to-r from-thorny-purple via-thorny-red to-needle-green transition-all duration-500"
          style={{ width: `${Math.min(totalPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
