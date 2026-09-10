# Meta Pacific — System Handover

Status as of 2026-09-09. Written against the two governing briefs in this
repo's history: `Meta_Pacific_Codex_Master_Prompt_Hostinger.md` (website
rebuild) and `Meta_Pacific_7_Day_Marketing_System_Challenge.pdf` (full
marketing system).

## Live production

- **URL:** https://metapacific.co (HTTPS working, valid Let's Encrypt cert)
- **Host:** GitHub Pages, repo `jorkspace-a11y/meta-pacific-website`, branch `main`
- **DNS:** stays on Hostinger (domain registrar). 4 A records point `@` at
  GitHub Pages IPs (185.199.108-111.153), CNAME `www` → `jorkspace-a11y.github.io`.
  No hosting purchased — GitHub Pages is free, DNS-only change on the
  existing domain.
- **Deploy:** push to `main` on GitHub → auto-builds → live in ~1 minute.

## Site structure

Clean folder URLs throughout (`/pricing/`, `/tools/`, `/resources/`, etc.),
no `.html` visible anywhere. Old `.html` paths that were previously live
(about, contact, disclosure, privacy, solutions, terms, values) redirect
instantly to their new folder form — no broken bookmarks or links.

New pages added this pass: `/pricing/` (One-Time / Monthly / Annual tabs,
only the approved IDR 25,000,000 offer is a real number, everything else
is honestly "custom scope"), `/tools/` (Property Launch Scope Estimator —
a real deterministic calculator, not a fake AI), `/resources/` (hub linking
Insights, Customer Stories, and Tools instead of duplicating content).

## Lead capture

Three forms, all POST to the same two destinations in parallel:

1. **Formspree** (`https://formspree.io/f/mqpkgvzw`) — reliable email
   notification, human-readable, this is the "you'll definitely see it"
   channel.
2. **HubSpot CRM** (see below) — structured record for pipeline work.

Forms: homepage (name/email/message only, low-friction), `/contact/`
(full qualification), `/for-whom/enterprise/` developer-brief form (full
qualification, pre-filtered to the Immersive Property Launch context).

Qualification fields collected on the two full forms: name, email,
company, location, number of units, construction stage, timeline, budget
range, website/Instagram, message.

## Tracking

- **GA4** property "MetaPacific", Measurement ID `G-DJQ0V48YK2`, installed
  on all pages.
- **UTM capture:** `assets/nav.js` reads `utm_source/medium/campaign/term/content`
  plus `gclid`/`fbclid` off the landing URL, stores them in
  `localStorage` (key `mp_attribution`), and injects them as hidden fields
  into every form — so a lead who lands via a campaign link, browses
  around, then converts later still carries that attribution into both
  Formspree and HubSpot.
- **Custom GA4 events:** `lead_form_start` (first field focus) and
  `lead_form_submit` (on submit), tagged with `form_name`
  (homepage/contact/developer-brief). GA4's own automatic Enhanced
  Measurement also fires generic `form_start`/`form_submit` independently.
- **Google Search Console:** verified (Domain property), sitemap
  submitted and confirmed fetched successfully (37 URLs discovered).
- Privacy Policy updated to disclose Google Analytics — it previously
  stated no analytics ran; that's now accurate.

## HubSpot CRM integration

- **Portal ID:** `247334337` (account name "Meta Pacific")
- **Form:** "Meta Pacific Website Lead", GUID
  `64468752-2695-49de-97fb-0a4c14fc2dbf`
- **How it works:** `assets/nav.js` fires a `fetch(..., {keepalive: true})`
  to HubSpot's public Forms Submission API
  (`api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`)
  on every form submit. No secret token is exposed client-side — portal ID
  and form GUID are meant to be public, same as any embeddable form.
- **Field mapping** (our form field → HubSpot property):
  - `name` → `firstname`
  - `email` → `email`
  - `company` → `company`
  - `location` → `city`
  - `website-instagram` → `website`
  - `project-type` → `meta_project_type` (enumeration, mapped from label to slug in `nav.js`)
  - `units` → `meta_units`
  - `construction-stage` → `meta_construction_stage` (enumeration)
  - `timeline` → `meta_timeline` (enumeration)
  - `budget-range` → `meta_budget_range` (enumeration)
  - `message` → `message` (HubSpot's own built-in property)
  - form identity → `meta_lead_source_page`
  - attribution → `meta_utm_source` / `meta_utm_medium` / `meta_utm_campaign`
- **Dedup:** HubSpot matches contacts by email automatically — resubmitting
  with the same email updates the existing record rather than duplicating.
- **Verified:** two full end-to-end tests (server-side API call, and real
  client-side browser submission) both confirmed correct contact creation
  with every field intact.
- **Access:** a Private App named "Meta Pacific Website" holds the API
  token used to set this up (properties + form creation). The token itself
  was never committed to this repo. If it needs rotating or extending,
  it lives in HubSpot under Settings → Integrations → Private Apps.

## Not done yet

- **Email automation** (confirmation to the lead, internal new-lead
  notification): HubSpot's own form-level notification config isn't
  cleanly exposed via this account's API. The likely path is a native
  HubSpot Workflow (Automation → Workflows), which needs a look at what
  the current plan actually offers before building it — free-tier
  Workflow scope varies. Blocked on checking that, not abandoned.
- **Deal pipeline:** the brief's stages (New Lead → Qualified → Contacted
  → Meeting → Proposal → Won/Lost) aren't set up in HubSpot Deals yet.
  Contacts are landing correctly; they're just not yet moving through a
  visible pipeline.
- **Outreach infrastructure:** email outreach tool, sequences,
  personalization. This explicitly needs a prospect database and a
  dedicated email account from Meta Pacific — can't be built without
  those being provided.
- **Dashboard:** a compact "is it working, where's it leaking" view.
  Makes more sense once there's real lead volume to show; the underlying
  data (GA4 events, HubSpot contacts, UTM attribution) is already in
  place to build one from.
- **SEO structured data:** homepage has no `Organization`/`WebSite` JSON-LD
  yet (every other page type does — work pages have `CreativeWork`,
  services have `Service`+`FAQPage`, field notes have `Article`).
- **Footer sitemap, full responsive/accessibility QA sweep:** footer now
  has real category columns (Services/Solutions/Resources/Company) on
  every page; a full manual QA pass across viewports hasn't been run,
  though PageSpeed Insights already scores 92/94/100/100
  (Performance/Accessibility/Best Practices/SEO) on mobile.

## What to check next

### Email update, 10 September 2026

The earlier email-automation blocker is superseded: HubSpot form simple
workflow 4883531481 is ON and published, sending acknowledgement email
393634377429. Temporary inbox and Reply-To are jerio@metapacific.co, as
approved by the user. Formspree notifications are enabled for that address.
A real website submission and a reply were tested successfully for routing.
The acknowledgement and reply landed in Spam, so inbox placement remains
unresolved. HubSpot free rewrites the From address to its shared sending
domain; custom domain authentication requires a paid subscription and was
not activated. Newsletter remains draft only. See EMAIL-CONTENT-DRAFTS.md
for exact test markers, configuration, and remaining limitations.

1. Google Search Console → Pages report, a day or so after this was
   written, to see actual indexing status.
2. HubSpot → Automation → Workflows, to see what's available and unblock
   the email automation.
3. HubSpot → Deals, to decide whether to build the pipeline now or after
   real leads start arriving.
