import Form from '@/app/ui/mask-shards/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMaskShardById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Mask Shard',
};

export const dynamic = 'force-dynamic';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const shard = await fetchMaskShardById(id);

  if (!shard) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Mask Shards', href: '/dashboard/mask-shards' },
          {
            label: 'Edit Mask Shard',
            href: `/dashboard/mask-shards/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form shard={shard} />
    </main>
  );
}
