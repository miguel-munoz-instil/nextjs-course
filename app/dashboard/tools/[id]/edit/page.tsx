import Form from '@/app/ui/tools/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchToolById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Tool',
};

export const dynamic = 'force-dynamic';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const tool = await fetchToolById(id);

  if (!tool) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tools', href: '/dashboard/tools' },
          {
            label: 'Edit Tool',
            href: `/dashboard/tools/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form tool={tool} />
    </main>
  );
}
