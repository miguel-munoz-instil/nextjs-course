import Form from '@/app/ui/needle-upgrades/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Needle Upgrade',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Needle Upgrades', href: '/dashboard/needle-upgrades' },
          {
            label: 'Create Needle Upgrade',
            href: '/dashboard/needle-upgrades/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
