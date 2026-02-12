import Form from '@/app/ui/mask-shards/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Mask Shard',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Mask Shards', href: '/dashboard/mask-shards' },
          {
            label: 'Create Mask Shard',
            href: '/dashboard/mask-shards/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
