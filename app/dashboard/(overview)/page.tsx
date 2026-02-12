import CollectedPercentageWidget from '@/app/ui/dashboard/collected-percentage';
import ToolsCountWidget from '@/app/ui/dashboard/tools-count-widget';
import WeaverSkillsCountWidget from '@/app/ui/dashboard/weaver-skills-count-widget';
import NeedleUpgradesCountWidget from '@/app/ui/dashboard/needle-upgrades-count-widget';
import MaskShardsCountWidget from '@/app/ui/dashboard/mask-shards-count-widget';
import SilkSpoolsCountWidget from '@/app/ui/dashboard/silk-spools-count-widget';
import SilkHeartsCountWidget from '@/app/ui/dashboard/silk-hearts-count-widget';
import CraftingKitToolPouchCountWidget from '@/app/ui/dashboard/crafting-kit-tool-pouch-count-widget';
import CrestsCountWidget from '@/app/ui/dashboard/crests-count-widget';
import AbilitiesCountWidget from '@/app/ui/dashboard/abilities-count-widget';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};
 
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl text-silk-white`}>
        Dashboard
      </h1>
      <div className="mt-6 space-y-6">
        <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
          <CollectedPercentageWidget />
        </Suspense>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <ToolsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <WeaverSkillsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <NeedleUpgradesCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <MaskShardsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <SilkSpoolsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <SilkHeartsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <CraftingKitToolPouchCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <CrestsCountWidget />
          </Suspense>
          <Suspense fallback={<div className="h-32 rounded-xl bg-void-black animate-pulse" />}>
            <AbilitiesCountWidget />
          </Suspense>
        </div>
      </div>
    </main>
  );
}