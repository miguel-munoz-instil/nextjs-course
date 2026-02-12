import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data;
}

export async function GET() {
  // Authentication check - only authenticated users can query the database
  const session = await auth();
  
  if (!session?.user) {
    return Response.json(
      { error: 'Unauthorized. You must be logged in to access this endpoint.' },
      { status: 401 }
    );
  }

  // Additional protection: only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return Response.json(
      { error: 'Forbidden. This query endpoint is not available in production.' },
      { status: 403 }
    );
  }

  try {
  	return Response.json(await listInvoices());
  } catch (error) {
    // Log detailed error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Query error:', error);
    }
  	return Response.json({ error: 'Failed to execute query.' }, { status: 500 });
  }
}
