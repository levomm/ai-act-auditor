
# EU AI Act Compliance Auditor Agent — 24h GTM build

Eesmärk: developer-first, dark, Linear-stiilis marketing site + töötav tasuta "5-minute repo scan" lead magnet, mis konverteerib SaaS ($299/mo) või DFY auditi ($2k–5k) lead'iks.

## Scope (mida ehitame)

**Routed marketing site** (TanStack Start, eraldi route igale lehele — ei mingit hash-nav):
- `/` — Hero + probleem + agent demo preview + sotsiaalne tõestus + CTA
- `/product` — Kuidas agent töötab (repo scan → gap analysis → evidence package)
- `/pricing` — SaaS $299/mo vs DFY $2k–5k retainer
- `/audit` — DFY audit pakkumise leht (workshop, policy pack, audit prep)
- `/scan` — Tasuta lead magnet: ühenda GitHub või lae üles docs → readiness score + top 3 riski + CTA
- `/scan/result/$scanId` — Skaneerimise tulemus (score, riskid, upsell)
- `/timeline` — "Prepare now, not when legal panics" — 2 aug 2026 + 2027 Annex I selgitus
- `/contact` — Booking DFY auditile

**Funktsionaalsus esimeses iteratsioonis:**
- Tasuta scan: kasutaja kleebib avaliku GitHub repo URL-i VÕI laeb üles dokumendid (PDF/MD/TXT)
- Backend tõmbab repo metadata + README + märksõnad failidest, saadab AI-le (Lovable AI Gateway, gemini-3-flash) struktureeritud analüüsiks
- AI tagastab: high-risk classification likelihood (0–100), readiness score, top 3 puudust, soovitatud remediation, mapping AI Act artiklitele
- Tulemus salvestatakse DB-sse, jagatav `/scan/result/$id` link
- Lead capture: email enne tulemuse näitamist (või pärast — A/B-able hiljem; v1 = email gate enne)
- DFY booking: lihtne vorm (nimi, ettevõte, töötajate arv, AI use case, email) → salvestab leads tabelisse

**Mida v1-s EI tee** (selgelt välja kirjutatud, et scope ei paisuks):
- Ei tegelikku Stripe checkouti $299 SaaS'ile (CTA = "Join waitlist" + email)
- Ei OAuth GitHub integratsiooni (ainult avalik repo URL v1-s)
- Ei watermarking tooli (mainime lehel, aga build hiljem)
- Ei kasutajate dashboardi / accounti (scan'id on shareable link'iga, mitte logitavad)

## Lovable Cloud (backend)

Vaja, sest scan'id ja leadid peavad persisteerima + AI Gateway võti.

Tabelid:
- `scans` — id, email, repo_url, uploaded_files_meta, score, classification, top_risks (jsonb), full_report (jsonb), created_at
- `leads` — id, email, source ('scan' | 'dfy_booking' | 'waitlist'), company, employees, ai_use_case, notes, created_at

RLS: mõlemad tabelid — insert public (anon), select ainult oma scan_id järgi (avalikkusele jagatav link kasutab scan_id-d kui salajast tokenit; pole PII). Leads — ainult insert public, select keelatud anon'ile.

Edge / server functions:
- `runScan` — sisend: repo_url või uploaded text. Tõmbab GitHubi avaliku API-ga repo metadata + README + top-level failipuu, koondab konteksti, kutsub Lovable AI Gateway'd structured tool-calling'uga, salvestab `scans` tabelisse, tagastab scan_id.
- `submitLead` — sisend: email + form fields, insert leads tabelisse.

## Disain (Linear-style, workspace knowledge'i järgi)

- Canvas: near-black sinaka tooniga (`oklch` tokens src/styles.css'is)
- 4-step surface ladder: bg → surface-1 → surface-2 → surface-3 (cardid, lifted panels)
- Hairline 1px borders, no heavy shadows
- Üks aktsent: lavender-blue (primary CTA, focus, brändimärk). Success green ainult readiness score'i positive state'ile.
- Typography: tight display (large, negative tracking), calmer body. Mono ainult koodiplokkides (näiteks "näita seda Pythoni snippetit, mis loggib model inference'eid").
- Cards: 12px radius, compact
- Primary CTA: lavender-blue, 8px radius, EI pill-shape
- Hero element = "product screenshot" — me genereerime kvaliteetse mock UI screenshot pildi agent dashboardist (gap analysis view), mis dominantselt ekraani täidab. Mitte decorative blob.

Tone copy'is: terav, technical, anti-fluff. Näide hero h1: "Prove your AI Act compliance before procurement asks." Mitte "Empowering trust in AI." Copy kirjutame eesti keeles? **EI** — turg on EU mid-market tech + US firmad → kogu copy **inglise keeles**. (Kinnitame sellega allpool kui vaja.)

## Investor-style score block

Lisame `/`-le (või `/product`-le) väikese "Investor view" sektsiooni jalas — terav, sisemine vibe, mitte naljakas:

```
Speed to cash      9/10
Ease of execution  8/10
Margin             9/10
Scalability        9/10
Moat potential     8/10

Skeptic: "Regulation shifts, but demand for auditability,
evidence, and procurement-readiness is already here."

Verdict: Strong buy.
```

## Tehniline arhitektuur

- TanStack Start, file-based routing src/routes/, iga sektsioon eraldi route head() metaga (SEO + OG per page)
- Lovable Cloud: Postgres + edge functions
- Lovable AI Gateway: `google/gemini-3-flash-preview` default scan'idele (kiire + odav), structured output tool-calling'uga (`assess_repo` tool, mis tagastab klassifikatsiooni, score, riskid)
- GitHub avaliku repo fetch: REST API `https://api.github.com/repos/{owner}/{repo}` + `/contents` README'le, ilma auth'ita (60 req/h IP kohta, OK v1-le; rate limit handling edge function'is)
- File upload: bucket Lovable Cloud storage'is, ainult tekstifailid (md/txt/pdf — pdf'le lihtne text extract või v1-s ainult md/txt, pdf "coming soon")
- Forms: react-hook-form + zod
- Markdown renderdus scan tulemuses: react-markdown

## Failid mida loome / muudame

Uued route'id:
- src/routes/index.tsx (asendame placeholder'i)
- src/routes/product.tsx
- src/routes/pricing.tsx
- src/routes/audit.tsx
- src/routes/scan.tsx
- src/routes/scan.result.$scanId.tsx
- src/routes/timeline.tsx
- src/routes/contact.tsx

Komponendid:
- src/components/site/Header.tsx (nav linkidega)
- src/components/site/Footer.tsx
- src/components/site/Hero.tsx
- src/components/site/InvestorScore.tsx
- src/components/site/PricingCards.tsx
- src/components/site/ScanForm.tsx
- src/components/site/ScanResult.tsx
- src/components/site/CTA.tsx
- src/components/ui/* (shadcn — juba olemas)

Server functions:
- src/lib/scan.functions.ts (runScan)
- src/lib/leads.functions.ts (submitLead)
- src/lib/scan.server.ts (GitHub fetch + AI Gateway call helpers)

Styling:
- src/styles.css — uuendame token'id Linear dark paletile (bg, surface-1..3, border-hairline, primary lavender, success green), typography skaala

Assets:
- src/assets/hero-product.png — genereeritud "agent dashboard" mock screenshot (premium quality, kuna sisaldab teksti)
- src/assets/og-default.png — share image

## Avatud küsimused (palun vasta enne implement'i)

1. **Copy keel** — kogu sait inglise keeles (sihtturg = EU mid-market + US)? Eeldan jah.
2. **Brand-nimi headeris** — "EU AI Act Compliance Auditor Agent" on pikk. Soovitame lühivormi nagu "AuditorAgent" või "ActReady" pluss tagline "EU AI Act compliance, developer-first". Kas valid lühivormi või jääme pika juurde?
3. **Lead magneti email gate** — kas email küsime ENNE scan tulemuse näitamist (parem konversioon, kõrgem friction) või PÄRAST (madalam friction, näeb teaser'it esmalt)? Soovitan: enne (lead capture on ainus eesmärk 24h test'is).
4. **DFY hinnakirjas konkreetne arv** — paneme "$2,000–5,000" range'i või üks fix arv (nt "Starts at $2,000")? Range tundub paindlikum.

Vasta küsimustele (või kinnita defaultid: EN copy / soovita lühinime / email enne / range hind) ja vajutan implement'i.
