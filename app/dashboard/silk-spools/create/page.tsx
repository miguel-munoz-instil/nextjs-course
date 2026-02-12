import Form from '@/app/ui/silk-spools/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Silk Spool',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Silk Spools', href: '/dashboard/silk-spools' },
          {
            label: 'Create Silk Spool',
            href: '/dashboard/silk-spools/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
