import Form from '@/app/ui/crafting-kit-tool-pouch/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCraftingKitToolPouchById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Item',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const item = await fetchCraftingKitToolPouchById(id);

  if (!item) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Crafting Kit + Tool Pouch', href: '/dashboard/crafting-kit-tool-pouch' },
          {
            label: 'Edit Item',
            href: `/dashboard/crafting-kit-tool-pouch/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form item={item} />
    </main>
  );
}
