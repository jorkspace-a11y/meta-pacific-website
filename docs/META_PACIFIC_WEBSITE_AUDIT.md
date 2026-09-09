# Meta Pacific website audit

Audit date: 9 September 2026. Baseline: origin/main at 0bad6e1. Working branch: codex/metapacific-production-rebuild. Existing untracked PRODUCT.md preserved.

## Existing codebase

Static HTML, relative-path routing, ten service details, eight work details, three field notes, audience pages and company/legal pages. No package manager or server runtime dependency. There are 36 HTML files: 34 content pages and two redirect stubs. The current main branch was fetched before creating the working branch.

Shared assets: assets/site.css (approximately 37 KB), assets/live.css, assets/nav.js, assets/live.js and assets/work-archive.js. Navigation and footer HTML are copied independently into each page. Official light/dark logo lockups, hero logo and favicon package exist. Nine JPEG portfolio thumbnails range from approximately 35 to 155 KB. Google Fonts supplies DM Sans and IBM Plex Serif. Source snapshot: baseline-pages.json.

Forms on Contact and Developers and Operators have no backend, action or submit handler. Default submission reloads the page and can put personal information in the query string. No configured HubSpot, GA4 or lead endpoint was found in the current source. The seven-day challenge is an integration direction; its prospect outreach is not part of this website deployment brief.

Metadata, sitemap and schema use the previous GitHub Pages origin. Organization/ProfessionalService, breadcrumbs and collection schemas already exist. Work pages link to external portfolio media; media remains owned by its current hosts. No production server configuration or documented Hostinger deployment exists.

## Initial browser audit

All 34 content routes loaded locally at http://127.0.0.1:4173. Each had one H1. No completed-but-broken images or horizontal overflow were detected at the desktop test width. This is an initial structural check, not final visual or interaction acceptance. The original home uses an abstract flight-path panel instead of immediately showing production work. Automatic dark mode changes the intended cream-first art direction. Low-opacity secondary text and over-tight heading tracking warrant correction.

## Gaps and risks

- Pricing and recurring engagement models are absent. Preserve IDR 25,000,000 as a reference for Immersive Property Launch; quantities, timing and optional web/growth scope need a written brief.
- Resources have only three articles; no guides, scope calculator or brief builder.
- Home reproduces the full archive, capability explanations, solution descriptions and offer scope. These need clear owners and short linked previews.
- Work details are short but contain real projects. Expand only using established role, context and deliverables. Do not infer sales results.
- Most service details are 200-270 words with similar repeated calls to action. Strengthen buyer-specific process, related work and resource links.
- Menus support click and Escape but lack deliberate focus return and a mobile focus boundary. No global skip link or active-page indicator.
- live.js starts an animation frame loop on pointer movement without stopping after settling. Reveal CSS can hide content if the script fails.
- No custom 404, reproducible build, route checks, deployment backup procedure or analytics map.
- Two index/legacy redirect pages and overlapping For whom/Solutions content need canonical ownership.

## Evidence boundaries

The source PDFs describe some adjacent capabilities. New engagements must be presented as custom scope rather than guaranteed capacity, turnaround, unlimited revisions or pause rights. No new commercial prices, testimonials or performance statistics will be introduced. Hosting capabilities remain unverified pending access to the existing Hostinger session. No purchases or infrastructure changes have been made.

## Benchmark direction

Motion's live navigation connects services, audience, pricing and resource tools. Its pricing page distinguishes engagement cadence and supports each with scope/process/proof. Adapt that continuity, not its language, client marks, purple surfaces or commercial policies.

KKBC computed desktop typography was inspected: DM Sans; main H1 120px/144px at weight 700, navigation 14px/21px at 500, service navigation 16px/24px at 400, headings spanning 32-65px. Meta Pacific already uses DM Sans. Preserve the family; use a restrained fluid heading scale, readable line length and stronger paragraph contrast. Further responsive and page-type research is recorded separately as completed.

## Existing page matrix

| Page | Purpose | Primary CTA | Unique content | Duplicate content | SEO intent | Decision |
|---|---|---|---|---|---|---|
| about.html | Audience / company / legal | Start a Project / related links | Run from Bali. | Shared navigation and footer; recurring CTA | Run from Bali. | Preserve and refine; ownership pending |
| contact.html | Audience / company / legal | Start a Project / related links | Send the project. Tell us what is blocking the yes. | Shared navigation and footer; recurring CTA | Send the project. Tell us what is blocking the yes. | Preserve and refine; ownership pending |
| disclosure.html | Audience / company / legal | Start a Project / related links | How to read the work on this site. | Shared navigation and footer; recurring CTA | How to read the work on this site. | Preserve and refine; ownership pending |
| index.html | Audience / company / legal | Start a Project / related links | A place should sell before anyone has to fly in. | Shared navigation and footer; recurring CTA | A place should sell before anyone has to fly in. | Preserve and refine; ownership pending |
| insights.html | Audience / company / legal | Start a Project / related links | Legacy redirect | Shared navigation and footer; recurring CTA | Legacy redirect | Preserve and refine; ownership pending |
| privacy.html | Audience / company / legal | Start a Project / related links | What happens to your information here. | Shared navigation and footer; recurring CTA | What happens to your information here. | Preserve and refine; ownership pending |
| services.html | Audience / company / legal | Start a Project / related links | Legacy redirect | Shared navigation and footer; recurring CTA | Legacy redirect | Preserve and refine; ownership pending |
| solutions.html | Audience / company / legal | Start a Project / related links | Built around the problem, not the service list. | Shared navigation and footer; recurring CTA | Built around the problem, not the service list. | Preserve and refine; ownership pending |
| terms.html | Audience / company / legal | Start a Project / related links | Using this site. | Shared navigation and footer; recurring CTA | Using this site. | Preserve and refine; ownership pending |
| values.html | Audience / company / legal | Start a Project / related links | What we stand for. | Shared navigation and footer; recurring CTA | What we stand for. | Preserve and refine; ownership pending |
| field-notes/index.html | Educational resource | Start a Project / related links | Notes from the work, not around it. | Shared navigation and footer; recurring CTA | Notes from the work, not around it. | Preserve and refine; ownership pending |
| field-notes/ai-effects-vs-traditional-vfx/index.html | Educational resource | Start a Project / related links | AI effects vs. traditional VFX | Shared navigation and footer; recurring CTA | AI effects vs. traditional VFX | Preserve and refine; ownership pending |
| field-notes/fpv-vs-traditional-drone/index.html | Educational resource | Start a Project / related links | FPV vs. traditional drone for property marketing | Shared navigation and footer; recurring CTA | FPV vs. traditional drone for property marketing | Preserve and refine; ownership pending |
| field-notes/virtual-tours-before-a-visit/index.html | Educational resource | Start a Project / related links | How virtual tours help sell villas before a physical visit | Shared navigation and footer; recurring CTA | How virtual tours help sell villas before a physical visit | Preserve and refine; ownership pending |
| for-whom/index.html | Audience / company / legal | Start a Project / related links | Start from who has the problem. | Shared navigation and footer; recurring CTA | Start from who has the problem. | Preserve and refine; ownership pending |
| for-whom/enterprise/index.html | Audience / company / legal | Start a Project / related links | Keep every launch moving without losing the look. | Shared navigation and footer; recurring CTA | Keep every launch moving without losing the look. | Preserve and refine; ownership pending |
| services/index.html | Service detail | Start a Project / related links | Scoped work, not a generic retainer. | Shared navigation and footer; recurring CTA | Scoped work, not a generic retainer. | Preserve and refine; ownership pending |
| services/ai-media/index.html | Service detail | Start a Project / related links | AI video and generative media | Shared navigation and footer; recurring CTA | AI video and generative media | Preserve and refine; ownership pending |
| services/brand-design/index.html | Service detail | Start a Project / related links | Brand and design | Shared navigation and footer; recurring CTA | Brand and design | Preserve and refine; ownership pending |
| services/creative-tech/index.html | Service detail | Start a Project / related links | Bespoke creative-tech | Shared navigation and footer; recurring CTA | Bespoke creative-tech | Preserve and refine; ownership pending |
| services/drone-fpv/index.html | Service detail | Start a Project / related links | Drone and FPV | Shared navigation and footer; recurring CTA | Drone and FPV | Preserve and refine; ownership pending |
| services/growth/index.html | Service detail | Start a Project / related links | Marketing execution and growth experiments | Shared navigation and footer; recurring CTA | Marketing execution and growth experiments | Preserve and refine; ownership pending |
| services/social-content/index.html | Service detail | Start a Project / related links | Social media and content systems | Shared navigation and footer; recurring CTA | Social media and content systems | Preserve and refine; ownership pending |
| services/strategy/index.html | Service detail | Start a Project / related links | Strategy | Shared navigation and footer; recurring CTA | Strategy | Preserve and refine; ownership pending |
| services/virtual-tours/index.html | Service detail | Start a Project / related links | Virtual tours and spatial experiences | Shared navigation and footer; recurring CTA | Virtual tours and spatial experiences | Preserve and refine; ownership pending |
| services/visual-production/index.html | Service detail | Start a Project / related links | Premium visual production | Shared navigation and footer; recurring CTA | Premium visual production | Preserve and refine; ownership pending |
| services/web-landing-pages/index.html | Service detail | Start a Project / related links | Web and landing pages | Shared navigation and footer; recurring CTA | Web and landing pages | Preserve and refine; ownership pending |
| work/index.html | Project evidence | Start a Project / related links | Every project, one archive. | Shared navigation and footer; recurring CTA | Every project, one archive. | Preserve and refine; ownership pending |
| work/01-anjuna-bay/index.html | Project evidence | Start a Project / related links | Anjuna Bay | Shared navigation and footer; recurring CTA | Anjuna Bay | Preserve and refine; ownership pending |
| work/02-3d-renders/index.html | Project evidence | Start a Project / related links | 3D Renders | Shared navigation and footer; recurring CTA | 3D Renders | Preserve and refine; ownership pending |
| work/03-sakti/index.html | Project evidence | Start a Project / related links | Sakti Project | Shared navigation and footer; recurring CTA | Sakti Project | Preserve and refine; ownership pending |
| work/04-invest-island/index.html | Project evidence | Start a Project / related links | Invest Island | Shared navigation and footer; recurring CTA | Invest Island | Preserve and refine; ownership pending |
| work/05-mini-map/index.html | Project evidence | Start a Project / related links | Mini Map | Shared navigation and footer; recurring CTA | Mini Map | Preserve and refine; ownership pending |
| work/06-sardine-rote/index.html | Project evidence | Start a Project / related links | Sardine Rote | Shared navigation and footer; recurring CTA | Sardine Rote | Preserve and refine; ownership pending |
| work/07-k-club-ubud/index.html | Project evidence | Start a Project / related links | K-Club Ubud | Shared navigation and footer; recurring CTA | K-Club Ubud | Preserve and refine; ownership pending |
| work/08-villa-koh-samui/index.html | Project evidence | Start a Project / related links | Villa Koh Samui | Shared navigation and footer; recurring CTA | Villa Koh Samui | Preserve and refine; ownership pending |
