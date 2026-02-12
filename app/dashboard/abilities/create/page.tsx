import Form from '@/app/ui/abilities/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Ability',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abilities', href: '/dashboard/abilities' },
          {
            label: 'Create Ability',
            href: '/dashboard/abilities/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
