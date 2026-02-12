import Form from '@/app/ui/weaver-skills/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Weaver Skill',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Weaver Skills', href: '/dashboard/weaver-skills' },
          {
            label: 'Create Weaver Skill',
            href: '/dashboard/weaver-skills/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
