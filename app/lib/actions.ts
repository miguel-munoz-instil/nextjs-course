'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData): Promise<void> {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    throw new Error('Database Error: Failed to Update Invoice.');
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to delete invoice.');
  }
  revalidatePath('/dashboard/invoices');
}

// Tool actions
const ToolFormSchema = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Please enter a tool name.' }).min(1, 'Please enter a tool name.'),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a tool status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1, 'Percentage must be at least 1.').default(1),
  date: z.string(),
});

const CreateTool = ToolFormSchema.omit({ id: true, date: true });
const UpdateTool = ToolFormSchema.omit({ id: true, date: true });

export type ToolState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export async function createTool(prevState: ToolState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateTool.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage') || 1,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Tool.',
    };
  }

  // Prepare data for insertion into the database
  const { name, status, notes, percentage } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO tools (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Tool.',
    };
  }

  // Revalidate the cache for the tools page and redirect the user.
  revalidatePath('/dashboard/tools');
  redirect('/dashboard/tools');
}

export async function updateTool(id: string, prevState: ToolState, formData: FormData) {
  const validatedFields = UpdateTool.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage') || 1,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Tool.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE tools
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Update Tool.' };
  }

  revalidatePath('/dashboard/tools');
  redirect('/dashboard/tools');
}

export async function deleteTool(id: string): Promise<void> {
  try {
    await sql`DELETE FROM tools WHERE id = ${id}`;
    revalidatePath('/dashboard/tools');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Tool.');
  }
}

// Weaver Skills actions
const WeaverSkillFormSchema = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Please enter a weaver skill name.' }).min(1, 'Please enter a weaver skill name.'),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a weaver skill status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1, 'Percentage must be at least 1.').default(1),
  date: z.string(),
});

const CreateWeaverSkill = WeaverSkillFormSchema.omit({ id: true, date: true });
const UpdateWeaverSkill = WeaverSkillFormSchema.omit({ id: true, date: true });

export type WeaverSkillState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export async function createWeaverSkill(prevState: WeaverSkillState, formData: FormData) {
  const validatedFields = CreateWeaverSkill.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage') || 1,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Weaver Skill.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO weaver_skills (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Weaver Skill.',
    };
  }

  revalidatePath('/dashboard/weaver-skills');
  redirect('/dashboard/weaver-skills');
}

export async function updateWeaverSkill(id: string, prevState: WeaverSkillState, formData: FormData) {
  const validatedFields = UpdateWeaverSkill.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage') || 1,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Weaver Skill.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE weaver_skills
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Update Weaver Skill.' };
  }

  revalidatePath('/dashboard/weaver-skills');
  redirect('/dashboard/weaver-skills');
}

export async function deleteWeaverSkill(id: string): Promise<void> {
  try {
    await sql`DELETE FROM weaver_skills WHERE id = ${id}`;
    revalidatePath('/dashboard/weaver-skills');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Weaver Skill.');
  }
}

// Needle Upgrades Actions
const NeedleUpgradeFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1).default(1),
  date: z.string(),
});

const CreateNeedleUpgrade = NeedleUpgradeFormSchema.omit({ id: true, date: true });
const UpdateNeedleUpgrade = NeedleUpgradeFormSchema.omit({ id: true, date: true });

export type NeedleUpgradeState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createNeedleUpgrade(prevState: NeedleUpgradeState, formData: FormData) {
  const validatedFields = CreateNeedleUpgrade.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Needle Upgrade.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO needle_upgrades (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Needle Upgrade.',
    };
  }

  revalidatePath('/dashboard/needle-upgrades');
  redirect('/dashboard/needle-upgrades');
}

export async function updateNeedleUpgrade(
  id: string,
  prevState: NeedleUpgradeState,
  formData: FormData,
) {
  const validatedFields = UpdateNeedleUpgrade.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Needle Upgrade.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE needle_upgrades
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Needle Upgrade.' };
  }

  revalidatePath('/dashboard/needle-upgrades');
  redirect('/dashboard/needle-upgrades');
}

export async function deleteNeedleUpgrade(id: string): Promise<void> {
  try {
    await sql`DELETE FROM needle_upgrades WHERE id = ${id}`;
    revalidatePath('/dashboard/needle-upgrades');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Needle Upgrade.');
  }
}

// Mask Shards Actions
const MaskShardFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(0.01).default(0.25),
  date: z.string(),
});

const CreateMaskShard = MaskShardFormSchema.omit({ id: true, date: true });
const UpdateMaskShard = MaskShardFormSchema.omit({ id: true, date: true });

export type MaskShardState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createMaskShard(prevState: MaskShardState, formData: FormData) {
  const validatedFields = CreateMaskShard.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Mask Shard.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO mask_shards (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Mask Shard.',
    };
  }

  revalidatePath('/dashboard/mask-shards');
  redirect('/dashboard/mask-shards');
}

export async function updateMaskShard(
  id: string,
  prevState: MaskShardState,
  formData: FormData,
) {
  const validatedFields = UpdateMaskShard.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Mask Shard.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE mask_shards
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Mask Shard.' };
  }

  revalidatePath('/dashboard/mask-shards');
  redirect('/dashboard/mask-shards');
}

export async function deleteMaskShard(id: string): Promise<void> {
  try {
    await sql`DELETE FROM mask_shards WHERE id = ${id}`;
    revalidatePath('/dashboard/mask-shards');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Mask Shard.');
  }
}

// Silk Spools Actions
const SilkSpoolFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(0.01).default(0.5),
  date: z.string(),
});

const CreateSilkSpool = SilkSpoolFormSchema.omit({ id: true, date: true });
const UpdateSilkSpool = SilkSpoolFormSchema.omit({ id: true, date: true });

export type SilkSpoolState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createSilkSpool(prevState: SilkSpoolState, formData: FormData) {
  const validatedFields = CreateSilkSpool.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Silk Spool.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO silk_spools (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Silk Spool.',
    };
  }

  revalidatePath('/dashboard/silk-spools');
  redirect('/dashboard/silk-spools');
}

export async function updateSilkSpool(
  id: string,
  prevState: SilkSpoolState,
  formData: FormData,
) {
  const validatedFields = UpdateSilkSpool.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Silk Spool.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE silk_spools
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Silk Spool.' };
  }

  revalidatePath('/dashboard/silk-spools');
  redirect('/dashboard/silk-spools');
}

export async function deleteSilkSpool(id: string): Promise<void> {
  try {
    await sql`DELETE FROM silk_spools WHERE id = ${id}`;
    revalidatePath('/dashboard/silk-spools');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Silk Spool.');
  }
}

const SilkHeartFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1).default(1),
  date: z.string(),
});

const CreateSilkHeart = SilkHeartFormSchema.omit({ id: true, date: true });
const UpdateSilkHeart = SilkHeartFormSchema.omit({ id: true, date: true });

export type SilkHeartState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createSilkHeart(prevState: SilkHeartState, formData: FormData) {
  const validatedFields = CreateSilkHeart.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Silk Heart.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO silk_hearts (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Silk Heart.',
    };
  }

  revalidatePath('/dashboard/silk-hearts');
  redirect('/dashboard/silk-hearts');
}

export async function updateSilkHeart(
  id: string,
  prevState: SilkHeartState,
  formData: FormData,
) {
  const validatedFields = UpdateSilkHeart.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Silk Heart.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE silk_hearts
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Silk Heart.' };
  }

  revalidatePath('/dashboard/silk-hearts');
  redirect('/dashboard/silk-hearts');
}

export async function deleteSilkHeart(id: string): Promise<void> {
  try {
    await sql`DELETE FROM silk_hearts WHERE id = ${id}`;
    revalidatePath('/dashboard/silk-hearts');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Silk Heart.');
  }
}

const CraftingKitToolPouchFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1).default(1),
  date: z.string(),
});

const CreateCraftingKitToolPouch = CraftingKitToolPouchFormSchema.omit({ id: true, date: true });
const UpdateCraftingKitToolPouch = CraftingKitToolPouchFormSchema.omit({ id: true, date: true });

export type CraftingKitToolPouchState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createCraftingKitToolPouch(prevState: CraftingKitToolPouchState, formData: FormData) {
  const validatedFields = CreateCraftingKitToolPouch.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Crafting Kit + Tool Pouch Item.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO crafting_kit_tool_pouch (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Crafting Kit + Tool Pouch Item.',
    };
  }

  revalidatePath('/dashboard/crafting-kit-tool-pouch');
  redirect('/dashboard/crafting-kit-tool-pouch');
}

export async function updateCraftingKitToolPouch(
  id: string,
  prevState: CraftingKitToolPouchState,
  formData: FormData,
) {
  const validatedFields = UpdateCraftingKitToolPouch.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Crafting Kit + Tool Pouch Item.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE crafting_kit_tool_pouch
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Crafting Kit + Tool Pouch Item.' };
  }

  revalidatePath('/dashboard/crafting-kit-tool-pouch');
  redirect('/dashboard/crafting-kit-tool-pouch');
}

export async function deleteCraftingKitToolPouch(id: string) {
  try {
    await sql`DELETE FROM crafting_kit_tool_pouch WHERE id = ${id}`;
    revalidatePath('/dashboard/crafting-kit-tool-pouch');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Crafting Kit + Tool Pouch Item.');
  }
}

const CrestFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1).default(1),
  date: z.string(),
});

const CreateCrest = CrestFormSchema.omit({ id: true, date: true });
const UpdateCrest = CrestFormSchema.omit({ id: true, date: true });

export type CrestState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createCrest(prevState: CrestState, formData: FormData) {
  const validatedFields = CreateCrest.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Crest.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO crests (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Crest.',
    };
  }

  revalidatePath('/dashboard/crests');
  redirect('/dashboard/crests');
}

export async function updateCrest(
  id: string,
  prevState: CrestState,
  formData: FormData,
) {
  const validatedFields = UpdateCrest.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Crest.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE crests
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Crest.' };
  }

  revalidatePath('/dashboard/crests');
  redirect('/dashboard/crests');
}

export async function deleteCrest(id: string): Promise<void> {
  try {
    await sql`DELETE FROM crests WHERE id = ${id}`;
    revalidatePath('/dashboard/crests');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Crest.');
  }
}

const AbilityFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  status: z.enum(['pending', 'collected'], {
    invalid_type_error: 'Please select a status.',
  }),
  notes: z.string().optional(),
  percentage: z.coerce.number().min(1).default(1),
  date: z.string(),
});

const CreateAbility = AbilityFormSchema.omit({ id: true, date: true });
const UpdateAbility = AbilityFormSchema.omit({ id: true, date: true });

export type AbilityState = {
  errors?: {
    name?: string[];
    status?: string[];
    notes?: string[];
    percentage?: string[];
  };
  message?: string | null;
};

export async function createAbility(prevState: AbilityState, formData: FormData) {
  const validatedFields = CreateAbility.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Ability.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      INSERT INTO abilities (name, status, notes, percentage)
      VALUES (${name}, ${status}, ${notes || ''}, ${percentage})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Ability.',
    };
  }

  revalidatePath('/dashboard/abilities');
  redirect('/dashboard/abilities');
}

export async function updateAbility(
  id: string,
  prevState: AbilityState,
  formData: FormData,
) {
  const validatedFields = UpdateAbility.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    percentage: formData.get('percentage'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Ability.',
    };
  }

  const { name, status, notes, percentage } = validatedFields.data;

  try {
    await sql`
      UPDATE abilities
      SET name = ${name}, status = ${status}, notes = ${notes || ''}, percentage = ${percentage}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Ability.' };
  }

  revalidatePath('/dashboard/abilities');
  redirect('/dashboard/abilities');
}

export async function deleteAbility(id: string): Promise<void> {
  try {
    await sql`DELETE FROM abilities WHERE id = ${id}`;
    revalidatePath('/dashboard/abilities');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
    throw new Error('Failed to Delete Ability.');
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: true,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}