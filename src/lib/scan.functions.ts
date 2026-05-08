import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { fetchRepoContext, runAssessment, type RepoContext } from "./scan.server";

const inputSchema = z
  .object({
    email: z.string().trim().email().max(255),
    repoUrl: z.string().trim().url().max(500).optional(),
    pastedText: z.string().trim().max(20_000).optional(),
  })
  .refine((d) => !!d.repoUrl || (d.pastedText && d.pastedText.length > 50), {
    message: "Provide a GitHub URL or paste at least 50 characters of documentation.",
  });

export const runScan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Create pending row first so we have a stable id
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("scans")
      .insert({
        email: data.email,
        repo_url: data.repoUrl ?? null,
        status: "running",
      })
      .select("id")
      .single();
    if (insertErr || !inserted) throw new Error(insertErr?.message ?? "Failed to create scan.");

    const scanId = inserted.id;

    // 2. Capture lead
    await supabaseAdmin.from("leads").insert({
      email: data.email,
      source: "scan",
      scan_id: scanId,
    });

    // 3. Run analysis (do it inline; cheap + fast enough for v1)
    try {
      let ctx: RepoContext;
      if (data.repoUrl) {
        ctx = await fetchRepoContext(data.repoUrl);
      } else {
        ctx = { source: "upload", uploadedText: data.pastedText! };
      }

      const assessment = await runAssessment(ctx);

      await supabaseAdmin
        .from("scans")
        .update({
          status: "complete",
          score: assessment.readiness_score,
          classification: assessment.classification,
          top_risks: assessment.top_risks as unknown as never,
          full_report: assessment as unknown as never,
        })
        .eq("id", scanId);

      return { scanId };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Scan failed.";
      await supabaseAdmin
        .from("scans")
        .update({ status: "error", error: msg })
        .eq("id", scanId);
      throw new Error(msg);
    }
  });
