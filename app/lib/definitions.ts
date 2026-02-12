// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Tool = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type ToolsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type ToolForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type WeaverSkill = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type WeaverSkillsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type WeaverSkillForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type NeedleUpgrade = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type NeedleUpgradesTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type NeedleUpgradeForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type MaskShard = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type MaskShardsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type MaskShardForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkSpool = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkSpoolsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkSpoolForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkHeart = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkHeartsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type SilkHeartForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type CraftingKitToolPouch = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type CraftingKitToolPouchTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type CraftingKitToolPouchForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type Crest = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type CrestsTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type CrestForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type Ability = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type AbilitiesTable = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};

export type AbilityForm = {
  id: string;
  name: string;
  status: 'pending' | 'collected';
  notes: string;
  percentage: number;
};
