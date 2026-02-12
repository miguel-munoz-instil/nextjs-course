import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedTools() {
  // Drop and recreate the tools table to ensure clean state
  await sql`DROP TABLE IF EXISTS tools`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS tools (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const sampleTools = [
    { name: 'Broche de magnetita', status: 'collected', notes: '', percentage: 1 },
    { name: 'Colgante fragmentador', status: 'collected', notes: '', percentage: 1 },
    { name: 'Brújula', status: 'collected', notes: '', percentage: 1 },
    { name: 'Ojo del druida', status: 'collected', notes: '', percentage: 1 },
    { name: 'Alfiler recto', status: 'collected', notes: '', percentage: 1 },
    { name: 'Campana protectora', status: 'collected', notes: '', percentage: 1 },
    { name: 'Aguijón cortante', status: 'collected', notes: '', percentage: 1 },
    { name: 'Campana magmática', status: 'collected', notes: '', percentage: 1 },
    { name: 'Cinturón lastrado', status: 'collected', notes: '', percentage: 1 },
    { name: 'Garracurva', status: 'collected', notes: '', percentage: 1 },
    { name: 'Máscara fracturada', status: 'collected', notes: '', percentage: 1 },
    { name: 'Alfiler triple', status: 'collected', notes: '', percentage: 1 },
    { name: 'Brebaje pulgoso', status: 'collected', notes: '', percentage: 1 },
    { name: 'Alfiler largo', status: 'collected', notes: '', percentage: 1 },
    { name: 'Bolsa pólipo', status: 'collected', notes: '', percentage: 1 },
    { name: 'Alfimohada', status: 'collected', notes: '', percentage: 1 },
    { name: 'Multiuso', status: 'collected', notes: '', percentage: 1 },
    { name: 'Tejeluz', status: 'collected', notes: '', percentage: 1 },
    { name: 'Tobilleras rapisedeñas', status: 'collected', notes: '', percentage: 1 },
    { name: 'Bolsa de bicho muerto / Saquito de coraza', status: 'collected', notes: '', percentage: 1 },
    { name: 'Ampolla con aguja / Ampolla de plasmio', status: 'collected', notes: '', percentage: 1 },
    { name: 'Dados de magnetita', status: 'collected', notes: '', percentage: 1 },
    { name: 'Taladro de excavador', status: 'collected', notes: '', percentage: 1 },
    { name: 'Agarre del ascendente', status: 'collected', notes: '', percentage: 1 },
    { name: 'Extensor de carrete', status: 'collected', notes: '', percentage: 1 },
    { name: 'Cilicio', status: 'collected', notes: '', percentage: 1 },
    { name: 'Tachuelas', status: 'collected', notes: '', percentage: 1 },
    { name: 'Garra espejo / Espejo oscuro', status: 'collected', notes: '', percentage: 1 },
    { name: 'Rueda mecánica', status: 'collected', notes: '', percentage: 1 },
    { name: 'Anillo de dientes de sierra', status: 'collected', notes: '', percentage: 1 },
    { name: 'Brazada de desliz', status: 'collected', notes: '', percentage: 1 },
    { name: 'Piedra de pedernal', status: 'collected', notes: '', percentage: 1 },
    { name: 'Banda inyectora', status: 'collected', notes: '', percentage: 1 },
    { name: 'Cristal de memoria', status: 'collected', notes: '', percentage: 1 },
    { name: 'Herramienta estropeada (Honda sedeña)', status: 'collected', notes: '', percentage: 1 },
    { name: 'Honda veloz', status: 'collected', notes: '', percentage: 1 },
    { name: 'Mosca mecánica', status: 'collected', notes: '', percentage: 1 },
    { name: 'Marca de ladrón', status: 'collected', notes: '', percentage: 1 },
    { name: 'Pico hurgón', status: 'collected', notes: '', percentage: 1 },
    { name: 'Cortaconcha', status: 'pending', notes: 'Moscarola Furiosa (Arenas de Karak)', percentage: 1 },
    { name: 'Cañón de rosarios', status: 'collected', notes: '', percentage: 1 },
    { name: 'Recipientes voltaicos', status: 'collected', notes: '', percentage: 1 },
    { name: 'Cuerdas arácnidas', status: 'collected', notes: '', percentage: 1 },
    { name: 'Corona de pureza', status: 'collected', notes: '', percentage: 1 },
    { name: 'Anillo arrojadizo', status: 'collected', notes: '', percentage: 1 },
    { name: 'Garralarga', status: 'collected', notes: '', percentage: 1 },
    { name: 'Huevo de Pulgalia', status: 'collected', notes: '', percentage: 1 },
    { name: 'Reserva sedeña', status: 'pending', notes: 'Segundo Centinela (Altos Salones)', percentage: 1 },
    { name: 'Filamento voltaico', status: 'pending', notes: 'Voltvyrm (Arenas de Karak)', percentage: 1 },
    { name: 'Farol de fuego fatuo', status: 'pending', notes: 'Padre de la Llama (Espesura Fatua)', percentage: 1 },
    { name: 'Placa de alfiler', status: 'pending', notes: 'Alfilera (Monte Fay - Acto 3)', percentage: 1 },
  ];

  const insertedTools = await Promise.all(
    sampleTools.map(
      (tool) => sql`
        INSERT INTO tools (name, status, notes, percentage)
        VALUES (${tool.name}, ${tool.status}, ${tool.notes}, ${tool.percentage})
      `,
    ),
  );

  return insertedTools;
}

async function seedWeaverSkills() {
  // Drop and recreate the weaver_skills table to ensure clean state
  await sql`DROP TABLE IF EXISTS weaver_skills`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS weaver_skills (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const weaverSkills = [
    { name: 'Lanza sedeña', status: 'collected', notes: '', percentage: 1 },
    { name: 'Tormenta de Hilos', status: 'collected', notes: '', percentage: 1 },
    { name: 'Punto de Cruz', status: 'collected', notes: '', percentage: 1 },
    { name: 'Dardo Veloz', status: 'collected', notes: '', percentage: 1 },
    { name: 'Furia rúnica', status: 'pending', notes: '', percentage: 1 },
    { name: 'Uñas pálidas', status: 'pending', notes: '', percentage: 1 },
  ];

  const insertedSkills = await Promise.all(
    weaverSkills.map(
      (skill) => sql`
        INSERT INTO weaver_skills (name, status, notes, percentage)
        VALUES (${skill.name}, ${skill.status}, ${skill.notes}, ${skill.percentage})
      `,
    ),
  );

  return insertedSkills;
}

async function seedNeedleUpgrades() {
  // Drop and recreate the needle_upgrades table to ensure clean state
  await sql`DROP TABLE IF EXISTS needle_upgrades`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS needle_upgrades (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const needleUpgrades = [
    { name: 'Eliminar Maldicion', status: 'collected', notes: '', percentage: 1 },
    { name: 'Aceite Palido 1', status: 'collected', notes: '', percentage: 1 },
    { name: 'Aceite Palido 2', status: 'collected', notes: '', percentage: 1 },
    { name: 'Aceite Palido 3', status: 'pending', notes: '', percentage: 1 },
  ];

  const insertedUpgrades = await Promise.all(
    needleUpgrades.map(
      (upgrade) => sql`
        INSERT INTO needle_upgrades (name, status, notes, percentage)
        VALUES (${upgrade.name}, ${upgrade.status}, ${upgrade.notes}, ${upgrade.percentage})
      `,
    ),
  );

  return insertedUpgrades;
}

async function seedMaskShards() {
  // Drop and recreate the mask_shards table to ensure clean state
  await sql`DROP TABLE IF EXISTS mask_shards`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS mask_shards (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage DECIMAL(5,2) NOT NULL DEFAULT 0.25
    );
  `;

  const maskShards = [];
  for (let i = 1; i <= 20; i++) {
    maskShards.push({
      name: `Fragmento de Mascara ${i}`,
      status: i >= 17 ? 'pending' : 'collected',
      notes: '',
      percentage: 0.25
    });
  }

  const insertedShards = await Promise.all(
    maskShards.map(
      (shard) => sql`
        INSERT INTO mask_shards (name, status, notes, percentage)
        VALUES (${shard.name}, ${shard.status}, ${shard.notes}, ${shard.percentage})
      `,
    ),
  );

  return insertedShards;
}

async function seedSilkSpools() {
  // Drop and recreate the silk_spools table to ensure clean state
  await sql`DROP TABLE IF EXISTS silk_spools`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS silk_spools (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage DECIMAL(5,2) NOT NULL DEFAULT 0.5
    );
  `;

  const silkSpools = [];
  for (let i = 1; i <= 18; i++) {
    silkSpools.push({
      name: `Fragmento de Carrete ${i}`,
      status: 'collected',
      notes: '',
      percentage: 0.5
    });
  }

  const insertedSpools = await Promise.all(
    silkSpools.map(
      (spool) => sql`
        INSERT INTO silk_spools (name, status, notes, percentage)
        VALUES (${spool.name}, ${spool.status}, ${spool.notes}, ${spool.percentage})
      `,
    ),
  );

  return insertedSpools;
}

async function seedSilkHearts() {
  // Drop and recreate the silk_hearts table to ensure clean state
  await sql`DROP TABLE IF EXISTS silk_hearts`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS silk_hearts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const silkHearts = [];
  for (let i = 1; i <= 3; i++) {
    silkHearts.push({
      name: `Corazon de Seda ${i}`,
      status: 'collected',
      notes: '',
      percentage: 1
    });
  }

  const insertedHearts = await Promise.all(
    silkHearts.map(
      (heart) => sql`
        INSERT INTO silk_hearts (name, status, notes, percentage)
        VALUES (${heart.name}, ${heart.status}, ${heart.notes}, ${heart.percentage})
      `,
    ),
  );

  return insertedHearts;
}

async function seedCraftingKitToolPouch() {
  // Drop and recreate the crafting_kit_tool_pouch table to ensure clean state
  await sql`DROP TABLE IF EXISTS crafting_kit_tool_pouch`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS crafting_kit_tool_pouch (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const items = [];
  // Mejora de Kit de Fabricacion 1-4
  for (let i = 1; i <= 4; i++) {
    items.push({
      name: `Mejora de Kit de Fabricacion ${i}`,
      status: 'collected',
      notes: '',
      percentage: 1
    });
  }
  // Mejora de Bolsa de Herramientas 1-4
  for (let i = 1; i <= 4; i++) {
    items.push({
      name: `Mejora de Bolsa de Herramientas ${i}`,
      status: 'collected',
      notes: '',
      percentage: 1
    });
  }

  const insertedItems = await Promise.all(
    items.map(
      (item) => sql`
        INSERT INTO crafting_kit_tool_pouch (name, status, notes, percentage)
        VALUES (${item.name}, ${item.status}, ${item.notes}, ${item.percentage})
      `,
    ),
  );

  return insertedItems;
}

async function seedCrests() {
  // Drop and recreate the crests table to ensure clean state
  await sql`DROP TABLE IF EXISTS crests`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS crests (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const crests = [
    { name: 'Blason de Parca', status: 'collected', notes: '', percentage: 1 },
    { name: 'Blason de Bestia', status: 'collected', notes: '', percentage: 1 },
    { name: 'Blason del Errante', status: 'collected', notes: '', percentage: 1 },
    { name: 'Blason de Arquitecta', status: 'collected', notes: '', percentage: 1 },
    { name: 'Blason de la Bruja', status: 'collected', notes: '', percentage: 1 },
    { name: 'Blason de la Chamana', status: 'pending', notes: '', percentage: 1 },
  ];

  const insertedCrests = await Promise.all(
    crests.map(
      (crest) => sql`
        INSERT INTO crests (name, status, notes, percentage)
        VALUES (${crest.name}, ${crest.status}, ${crest.notes}, ${crest.percentage})
      `,
    ),
  );

  return insertedCrests;
}

async function seedAbilities() {
  // Drop and recreate the abilities table to ensure clean state
  await sql`DROP TABLE IF EXISTS abilities`;
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS abilities (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      notes TEXT,
      percentage INT NOT NULL DEFAULT 1
    );
  `;

  const abilities = [
    { name: 'Paso Agil', status: 'collected', notes: '', percentage: 1 },
    { name: 'Agarre de Pinza', status: 'collected', notes: '', percentage: 1 },
    { name: 'Agujolin', status: 'collected', notes: '', percentage: 1 },
    { name: 'Golpe Concentrado', status: 'collected', notes: '', percentage: 1 },
    { name: 'Garra elongada', status: 'collected', notes: '', percentage: 1 },
    { name: 'Vuelo sedeño', status: 'pending', notes: '', percentage: 1 },
    { name: 'Silfonia', status: 'pending', notes: '', percentage: 1 },
    { name: 'Siempreviva', status: 'pending', notes: '', percentage: 1 },
  ];

  const insertedAbilities = await Promise.all(
    abilities.map(
      (ability) => sql`
        INSERT INTO abilities (name, status, notes, percentage)
        VALUES (${ability.name}, ${ability.status}, ${ability.notes}, ${ability.percentage})
      `,
    ),
  );

  return insertedAbilities;
}

export async function GET() {
  // Authentication check - only authenticated users can seed the database
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
      { error: 'Forbidden. Seeding is not allowed in production.' },
      { status: 403 }
    );
  }

  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
      seedTools(),
      seedWeaverSkills(),
      seedNeedleUpgrades(),
      seedMaskShards(),
      seedSilkSpools(),
      seedSilkHearts(),
      seedCraftingKitToolPouch(),
      seedCrests(),
      seedAbilities(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    // Log detailed error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Seed error:', error);
    }
    return Response.json({ error: 'Failed to seed database.' }, { status: 500 });
  }
}
