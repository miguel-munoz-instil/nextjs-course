'use client';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  BeakerIcon,
  PuzzlePieceIcon,
  CircleStackIcon,
  HeartIcon,
  CubeIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Tools', href: '/dashboard/tools', icon: WrenchScrewdriverIcon },
  { name: 'Weaver Skills', href: '/dashboard/weaver-skills', icon: SparklesIcon },
  { name: 'Needle Upgrades', href: '/dashboard/needle-upgrades', icon: BeakerIcon },
  { name: 'Mask Shards', href: '/dashboard/mask-shards', icon: PuzzlePieceIcon },
  { name: 'Silk Spools', href: '/dashboard/silk-spools', icon: CircleStackIcon },
  { name: 'Silk Hearts', href: '/dashboard/silk-hearts', icon: HeartIcon },
  { name: 'Crafting Kit + Tool Pouch', href: '/dashboard/crafting-kit-tool-pouch', icon: CubeIcon },
  { name: 'Crests', href: '/dashboard/crests', icon: ShieldCheckIcon },
  { name: 'Abilities', href: '/dashboard/abilities', icon: BoltIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-void-black p-3 text-sm font-medium hover:bg-thorny-purple hover:text-silk-white md:flex-none md:justify-start md:p-2 md:px-3 transition-colors',
              {
                'bg-thorny-red text-silk-white': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
