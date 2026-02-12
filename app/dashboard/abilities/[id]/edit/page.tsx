import Form from '@/app/ui/abilities/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchAbilityById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Ability',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const ability = await fetchAbilityById(id);

  if (!ability) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abilities', href: '/dashboard/abilities' },
          {
            label: 'Edit Ability',
            href: `/dashboard/abilities/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form ability={ability} />
    </main>
  );
}
