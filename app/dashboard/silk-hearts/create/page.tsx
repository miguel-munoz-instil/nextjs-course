import Form from '@/app/ui/silk-hearts/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Silk Heart',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Silk Hearts', href: '/dashboard/silk-hearts' },
          {
            label: 'Create Silk Heart',
            href: '/dashboard/silk-hearts/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
