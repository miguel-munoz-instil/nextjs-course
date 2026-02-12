import Form from '@/app/ui/weaver-skills/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchWeaverSkillById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Weaver Skill',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const skill = await fetchWeaverSkillById(id);

  if (!skill) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Weaver Skills', href: '/dashboard/weaver-skills' },
          {
            label: 'Edit Weaver Skill',
            href: `/dashboard/weaver-skills/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form skill={skill} />
    </main>
  );
}
