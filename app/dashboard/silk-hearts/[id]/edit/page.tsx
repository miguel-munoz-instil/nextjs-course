import Form from '@/app/ui/silk-hearts/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSilkHeartById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Silk Heart',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const heart = await fetchSilkHeartById(id);

  if (!heart) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Silk Hearts', href: '/dashboard/silk-hearts' },
          {
            label: 'Edit Silk Heart',
            href: `/dashboard/silk-hearts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form heart={heart} />
    </main>
  );
}
