import Form from '@/app/ui/needle-upgrades/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchNeedleUpgradeById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Needle Upgrade',
};

export const dynamic = 'force-dynamic';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const upgrade = await fetchNeedleUpgradeById(id);

  if (!upgrade) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Needle Upgrades', href: '/dashboard/needle-upgrades' },
          {
            label: 'Edit Needle Upgrade',
            href: `/dashboard/needle-upgrades/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form upgrade={upgrade} />
    </main>
  );
}
