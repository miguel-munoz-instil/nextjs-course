import Form from '@/app/ui/crests/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCrestById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Crest',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const crest = await fetchCrestById(id);

  if (!crest) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Crests', href: '/dashboard/crests' },
          {
            label: 'Edit Crest',
            href: `/dashboard/crests/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form crest={crest} />
    </main>
  );
}
