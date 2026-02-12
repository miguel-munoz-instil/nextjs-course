import Form from '@/app/ui/tools/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Tool',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tools', href: '/dashboard/tools' },
          {
            label: 'Create Tool',
            href: '/dashboard/tools/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
