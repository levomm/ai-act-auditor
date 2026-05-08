import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  email: z.string().trim().email().max(255),
  source: z.enum(["dfy_booking", "waitlist", "contact"]),
  company: z.string().trim().max(200).optional(),
  employees: z.string().trim().max(50).optional(),
  ai_use_case: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("leads").insert({
      email: data.email,
      source: data.source,
      company: data.company ?? null,
      employees: data.employees ?? null,
      ai_use_case: data.ai_use_case ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
