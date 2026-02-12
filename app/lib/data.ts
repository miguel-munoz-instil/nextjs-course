import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ToolForm,
  ToolsTable,
  WeaverSkillForm,
  WeaverSkillsTable,
  NeedleUpgradeForm,
  NeedleUpgradesTable,
  MaskShardForm,
  MaskShardsTable,
  SilkSpoolForm,
  SilkSpoolsTable,
  SilkHeartForm,
  SilkHeartsTable,
  CraftingKitToolPouchForm,
  CraftingKitToolPouchTable,
  CrestForm,
  CrestsTable,
  AbilityForm,
  AbilitiesTable,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching revenue data...');
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    if (process.env.NODE_ENV === 'development') {
      console.log('Data fetch completed after 3 seconds.');
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// Tools queries
const TOOLS_PER_PAGE = 6;

export async function fetchFilteredTools(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * TOOLS_PER_PAGE;

  try {
    const tools = await sql<ToolsTable[]>`
      SELECT
        tools.id,
        tools.name,
        tools.status,
        tools.notes,
        tools.percentage
      FROM tools
      WHERE
        tools.name ILIKE ${`%${query}%`} OR
        tools.notes ILIKE ${`%${query}%`} OR
        tools.status ILIKE ${`%${query}%`}
      ORDER BY tools.name ASC
      LIMIT ${TOOLS_PER_PAGE} OFFSET ${offset}
    `;

    return tools;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tools.');
  }
}

export async function fetchToolsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM tools
    WHERE
      tools.name ILIKE ${`%${query}%`} OR
      tools.notes ILIKE ${`%${query}%`} OR
      tools.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / TOOLS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tools.');
  }
}

export async function fetchToolById(id: string) {
  try {
    const data = await sql<ToolForm[]>`
      SELECT
        tools.id,
        tools.name,
        tools.status,
        tools.notes,
        tools.percentage
      FROM tools
      WHERE tools.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tool.');
  }
}

export async function fetchCollectedToolsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM tools
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected tools percentage.');
  }
}

export async function fetchToolsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM tools;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tools count.');
  }
}

// Weaver Skills functions
const WEAVER_SKILLS_PER_PAGE = 6;

export async function fetchFilteredWeaverSkills(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * WEAVER_SKILLS_PER_PAGE;

  try {
    const skills = await sql<WeaverSkillsTable[]>`
      SELECT
        weaver_skills.id,
        weaver_skills.name,
        weaver_skills.status,
        weaver_skills.notes,
        weaver_skills.percentage
      FROM weaver_skills
      WHERE
        weaver_skills.name ILIKE ${`%${query}%`} OR
        weaver_skills.notes ILIKE ${`%${query}%`} OR
        weaver_skills.status ILIKE ${`%${query}%`}
      ORDER BY weaver_skills.name ASC
      LIMIT ${WEAVER_SKILLS_PER_PAGE} OFFSET ${offset}
    `;

    return skills;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weaver skills.');
  }
}

export async function fetchWeaverSkillsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM weaver_skills
    WHERE
      weaver_skills.name ILIKE ${`%${query}%`} OR
      weaver_skills.notes ILIKE ${`%${query}%`} OR
      weaver_skills.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / WEAVER_SKILLS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of weaver skills.');
  }
}

export async function fetchWeaverSkillById(id: string) {
  try {
    const data = await sql<WeaverSkillForm[]>`
      SELECT
        weaver_skills.id,
        weaver_skills.name,
        weaver_skills.status,
        weaver_skills.notes,
        weaver_skills.percentage
      FROM weaver_skills
      WHERE weaver_skills.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weaver skill.');
  }
}

export async function fetchCollectedWeaverSkillsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM weaver_skills
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected weaver skills percentage.');
  }
}

export async function fetchWeaverSkillsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM weaver_skills;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weaver skills count.');
  }
}

// Needle Upgrades functions
const NEEDLE_UPGRADES_PER_PAGE = 6;

export async function fetchFilteredNeedleUpgrades(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * NEEDLE_UPGRADES_PER_PAGE;

  try {
    const upgrades = await sql<NeedleUpgradesTable[]>`
      SELECT
        needle_upgrades.id,
        needle_upgrades.name,
        needle_upgrades.status,
        needle_upgrades.notes,
        needle_upgrades.percentage
      FROM needle_upgrades
      WHERE
        needle_upgrades.name ILIKE ${`%${query}%`} OR
        needle_upgrades.notes ILIKE ${`%${query}%`} OR
        needle_upgrades.status ILIKE ${`%${query}%`}
      ORDER BY needle_upgrades.name ASC
      LIMIT ${NEEDLE_UPGRADES_PER_PAGE} OFFSET ${offset}
    `;

    return upgrades;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch needle upgrades.');
  }
}

export async function fetchNeedleUpgradesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM needle_upgrades
    WHERE
      needle_upgrades.name ILIKE ${`%${query}%`} OR
      needle_upgrades.notes ILIKE ${`%${query}%`} OR
      needle_upgrades.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / NEEDLE_UPGRADES_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of needle upgrades.');
  }
}

export async function fetchNeedleUpgradeById(id: string) {
  try {
    const data = await sql<NeedleUpgradeForm[]>`
      SELECT
        needle_upgrades.id,
        needle_upgrades.name,
        needle_upgrades.status,
        needle_upgrades.notes,
        needle_upgrades.percentage
      FROM needle_upgrades
      WHERE needle_upgrades.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch needle upgrade.');
  }
}

export async function fetchCollectedNeedleUpgradesPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM needle_upgrades
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected needle upgrades percentage.');
  }
}

export async function fetchNeedleUpgradesCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM needle_upgrades;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch needle upgrades count.');
  }
}

// Mask Shards functions
const MASK_SHARDS_PER_PAGE = 20;

export async function fetchFilteredMaskShards(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * MASK_SHARDS_PER_PAGE;

  try {
    const shards = await sql<MaskShardsTable[]>`
      SELECT
        mask_shards.id,
        mask_shards.name,
        mask_shards.status,
        mask_shards.notes,
        mask_shards.percentage
      FROM mask_shards
      WHERE
        mask_shards.name ILIKE ${`%${query}%`} OR
        mask_shards.notes ILIKE ${`%${query}%`} OR
        mask_shards.status ILIKE ${`%${query}%`}
      ORDER BY mask_shards.name ASC
      LIMIT ${MASK_SHARDS_PER_PAGE} OFFSET ${offset}
    `;

    return shards;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mask shards.');
  }
}

export async function fetchMaskShardsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM mask_shards
    WHERE
      mask_shards.name ILIKE ${`%${query}%`} OR
      mask_shards.notes ILIKE ${`%${query}%`} OR
      mask_shards.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / MASK_SHARDS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of mask shards.');
  }
}

export async function fetchMaskShardById(id: string) {
  try {
    const data = await sql<MaskShardForm[]>`
      SELECT
        mask_shards.id,
        mask_shards.name,
        mask_shards.status,
        mask_shards.notes,
        mask_shards.percentage
      FROM mask_shards
      WHERE mask_shards.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mask shard.');
  }
}

export async function fetchCollectedMaskShardsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM mask_shards
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected mask shards percentage.');
  }
}

export async function fetchMaskShardsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM mask_shards;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch mask shards count.');
  }
}

// Silk Spools functions
const SILK_SPOOLS_PER_PAGE = 20;

export async function fetchFilteredSilkSpools(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * SILK_SPOOLS_PER_PAGE;

  try {
    const spools = await sql<SilkSpoolsTable[]>`
      SELECT
        silk_spools.id,
        silk_spools.name,
        silk_spools.status,
        silk_spools.notes,
        silk_spools.percentage
      FROM silk_spools
      WHERE
        silk_spools.name ILIKE ${`%${query}%`} OR
        silk_spools.notes ILIKE ${`%${query}%`} OR
        silk_spools.status ILIKE ${`%${query}%`}
      ORDER BY silk_spools.name ASC
      LIMIT ${SILK_SPOOLS_PER_PAGE} OFFSET ${offset}
    `;

    return spools;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk spools.');
  }
}

export async function fetchSilkSpoolsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM silk_spools
    WHERE
      silk_spools.name ILIKE ${`%${query}%`} OR
      silk_spools.notes ILIKE ${`%${query}%`} OR
      silk_spools.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / SILK_SPOOLS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of silk spools.');
  }
}

export async function fetchSilkSpoolById(id: string) {
  try {
    const data = await sql<SilkSpoolForm[]>`
      SELECT
        silk_spools.id,
        silk_spools.name,
        silk_spools.status,
        silk_spools.notes,
        silk_spools.percentage
      FROM silk_spools
      WHERE silk_spools.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk spool.');
  }
}

export async function fetchCollectedSilkSpoolsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM silk_spools
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected silk spools percentage.');
  }
}

export async function fetchSilkSpoolsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM silk_spools;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk spools count.');
  }
}

const SILK_HEARTS_PER_PAGE = 6;

export async function fetchFilteredSilkHearts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * SILK_HEARTS_PER_PAGE;

  try {
    const hearts = await sql<SilkHeartsTable[]>`
      SELECT
        silk_hearts.id,
        silk_hearts.name,
        silk_hearts.status,
        silk_hearts.notes,
        silk_hearts.percentage
      FROM silk_hearts
      WHERE
        silk_hearts.name ILIKE ${`%${query}%`} OR
        silk_hearts.notes ILIKE ${`%${query}%`} OR
        silk_hearts.status ILIKE ${`%${query}%`}
      ORDER BY silk_hearts.name ASC
      LIMIT ${SILK_HEARTS_PER_PAGE} OFFSET ${offset}
    `;

    return hearts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk hearts.');
  }
}

export async function fetchSilkHeartsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM silk_hearts
    WHERE
      silk_hearts.name ILIKE ${`%${query}%`} OR
      silk_hearts.notes ILIKE ${`%${query}%`} OR
      silk_hearts.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / SILK_HEARTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of silk hearts.');
  }
}

export async function fetchSilkHeartById(id: string) {
  try {
    const data = await sql<SilkHeartForm[]>`
      SELECT
        silk_hearts.id,
        silk_hearts.name,
        silk_hearts.status,
        silk_hearts.notes,
        silk_hearts.percentage
      FROM silk_hearts
      WHERE silk_hearts.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk heart.');
  }
}

export async function fetchCollectedSilkHeartsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM silk_hearts
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected silk hearts percentage.');
  }
}

export async function fetchSilkHeartsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM silk_hearts;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch silk hearts count.');
  }
}

const CRAFTING_KIT_TOOL_POUCH_PER_PAGE = 10;

export async function fetchFilteredCraftingKitToolPouch(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * CRAFTING_KIT_TOOL_POUCH_PER_PAGE;

  try {
    const items = await sql<CraftingKitToolPouchTable[]>`
      SELECT
        crafting_kit_tool_pouch.id,
        crafting_kit_tool_pouch.name,
        crafting_kit_tool_pouch.status,
        crafting_kit_tool_pouch.notes,
        crafting_kit_tool_pouch.percentage
      FROM crafting_kit_tool_pouch
      WHERE
        crafting_kit_tool_pouch.name ILIKE ${`%${query}%`} OR
        crafting_kit_tool_pouch.notes ILIKE ${`%${query}%`} OR
        crafting_kit_tool_pouch.status ILIKE ${`%${query}%`}
      ORDER BY crafting_kit_tool_pouch.name ASC
      LIMIT ${CRAFTING_KIT_TOOL_POUCH_PER_PAGE} OFFSET ${offset}
    `;

    return items;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crafting kit + tool pouch items.');
  }
}

export async function fetchCraftingKitToolPouchPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM crafting_kit_tool_pouch
    WHERE
      crafting_kit_tool_pouch.name ILIKE ${`%${query}%`} OR
      crafting_kit_tool_pouch.notes ILIKE ${`%${query}%`} OR
      crafting_kit_tool_pouch.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / CRAFTING_KIT_TOOL_POUCH_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of crafting kit + tool pouch items.');
  }
}

export async function fetchCraftingKitToolPouchById(id: string) {
  try {
    const data = await sql<CraftingKitToolPouchForm[]>`
      SELECT
        crafting_kit_tool_pouch.id,
        crafting_kit_tool_pouch.name,
        crafting_kit_tool_pouch.status,
        crafting_kit_tool_pouch.notes,
        crafting_kit_tool_pouch.percentage
      FROM crafting_kit_tool_pouch
      WHERE crafting_kit_tool_pouch.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crafting kit + tool pouch item.');
  }
}

export async function fetchCollectedCraftingKitToolPouchPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM crafting_kit_tool_pouch
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected crafting kit + tool pouch percentage.');
  }
}

export async function fetchCraftingKitToolPouchCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM crafting_kit_tool_pouch;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crafting kit + tool pouch count.');
  }
}

const CRESTS_PER_PAGE = 6;

export async function fetchFilteredCrests(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * CRESTS_PER_PAGE;

  try {
    const crests = await sql<CrestsTable[]>`
      SELECT
        crests.id,
        crests.name,
        crests.status,
        crests.notes,
        crests.percentage
      FROM crests
      WHERE
        crests.name ILIKE ${`%${query}%`} OR
        crests.notes ILIKE ${`%${query}%`} OR
        crests.status ILIKE ${`%${query}%`}
      ORDER BY crests.name ASC
      LIMIT ${CRESTS_PER_PAGE} OFFSET ${offset}
    `;

    return crests;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crests.');
  }
}

export async function fetchCrestsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM crests
    WHERE
      crests.name ILIKE ${`%${query}%`} OR
      crests.notes ILIKE ${`%${query}%`} OR
      crests.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / CRESTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of crests.');
  }
}

export async function fetchCrestById(id: string) {
  try {
    const data = await sql<CrestForm[]>`
      SELECT
        crests.id,
        crests.name,
        crests.status,
        crests.notes,
        crests.percentage
      FROM crests
      WHERE crests.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crest.');
  }
}

export async function fetchCollectedCrestsPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM crests
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected crests percentage.');
  }
}

export async function fetchCrestsCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM crests;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch crests count.');
  }
}

const ABILITIES_PER_PAGE = 6;

export async function fetchFilteredAbilities(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ABILITIES_PER_PAGE;

  try {
    const abilities = await sql<AbilitiesTable[]>`
      SELECT
        abilities.id,
        abilities.name,
        abilities.status,
        abilities.notes,
        abilities.percentage
      FROM abilities
      WHERE
        abilities.name ILIKE ${`%${query}%`} OR
        abilities.notes ILIKE ${`%${query}%`} OR
        abilities.status ILIKE ${`%${query}%`}
      ORDER BY abilities.name ASC
      LIMIT ${ABILITIES_PER_PAGE} OFFSET ${offset}
    `;

    return abilities;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch abilities.');
  }
}

export async function fetchAbilitiesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM abilities
    WHERE
      abilities.name ILIKE ${`%${query}%`} OR
      abilities.notes ILIKE ${`%${query}%`} OR
      abilities.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ABILITIES_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of abilities.');
  }
}

export async function fetchAbilityById(id: string) {
  try {
    const data = await sql<AbilityForm[]>`
      SELECT
        abilities.id,
        abilities.name,
        abilities.status,
        abilities.notes,
        abilities.percentage
      FROM abilities
      WHERE abilities.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ability.');
  }
}

export async function fetchCollectedAbilitiesPercentage() {
  try {
    const data = await sql<[{ total: number }]>`
      SELECT COALESCE(SUM(percentage), 0) as total
      FROM abilities
      WHERE status = 'collected';
    `;

    return data[0].total;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected abilities percentage.');
  }
}

export async function fetchAbilitiesCount() {
  try {
    const data = await sql<[{ collected: number; total: number }]>`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'collected') as collected,
        COUNT(*) as total
      FROM abilities;
    `;

    return {
      collected: Number(data[0].collected),
      total: Number(data[0].total)
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch abilities count.');
  }
}
