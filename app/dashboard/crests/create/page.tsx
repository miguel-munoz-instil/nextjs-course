import Form from '@/app/ui/crests/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Crest',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Crests', href: '/dashboard/crests' },
          {
            label: 'Create Crest',
            href: '/dashboard/crests/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
