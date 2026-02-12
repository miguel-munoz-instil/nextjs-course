import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <p>Customers Page</p>;
}