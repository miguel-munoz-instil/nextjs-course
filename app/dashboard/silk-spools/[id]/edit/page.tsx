import Form from '@/app/ui/silk-spools/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSilkSpoolById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Silk Spool',
};

export const dynamic = 'force-dynamic';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const spool = await fetchSilkSpoolById(id);

  if (!spool) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Silk Spools', href: '/dashboard/silk-spools' },
          {
            label: 'Edit Silk Spool',
            href: `/dashboard/silk-spools/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form spool={spool} />
    </main>
  );
}
