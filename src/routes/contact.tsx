import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { submitLead } from "@/lib/leads.functions";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Book an EU AI Act audit intake" },
      {
        name: "description",
        content:
          "Tell us about your AI system and we'll come back with a scoped DFY audit proposal within one business day.",
      },
      { property: "og:title", content: "Talk to ActReady" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(200).optional(),
  employees: z.string().trim().max(50).optional(),
  ai_use_case: z.string().trim().max(2000).optional(),
});

function ContactPage() {
  const submit = useServerFn(submitLead);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Contact
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Tell us about your system.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            We reply within one business day with a scoped audit proposal or, if SaaS fits better,
            an early-access link.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {state === "done" ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-6">
            <h2 className="text-lg font-semibold">Got it.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll be in touch within one business day.
            </p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setState("loading");
              setError(null);
              const fd = new FormData(e.currentTarget);
              const parsed = schema.safeParse({
                email: fd.get("email"),
                company: fd.get("company") || undefined,
                employees: fd.get("employees") || undefined,
                ai_use_case: fd.get("ai_use_case") || undefined,
              });
              if (!parsed.success) {
                setState("error");
                setError(parsed.error.issues[0]?.message ?? "Invalid input");
                return;
              }
              try {
                await submit({ data: { ...parsed.data, source: "contact" } });
                setState("done");
              } catch (err) {
                setState("error");
                setError(err instanceof Error ? err.message : "Something went wrong");
              }
            }}
          >
            <Field label="Work email" name="email" required type="email" />
            <Field label="Company" name="company" />
            <Field label="Engineering team size" name="employees" placeholder="e.g. 80" />
            <Field
              label="What does your AI system do?"
              name="ai_use_case"
              textarea
              placeholder="Use case, where it touches users, any high-risk concerns you already know about."
            />
            {error && <div className="text-sm text-destructive">{error}</div>}
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {state === "loading" ? "Sending…" : "Send"}
            </button>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  textarea,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          className="mt-1.5 w-full rounded-md border border-input bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-md border border-input bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      )}
    </label>
  );
}
