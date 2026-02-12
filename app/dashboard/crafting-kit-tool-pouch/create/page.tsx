import Form from '@/app/ui/crafting-kit-tool-pouch/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Item',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Crafting Kit + Tool Pouch', href: '/dashboard/crafting-kit-tool-pouch' },
          {
            label: 'Create Item',
            href: '/dashboard/crafting-kit-tool-pouch/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
