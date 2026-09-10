# Meta Pacific SEO audit

## Remediation update — 10 September 2026

The implementation pass after this baseline audit completed the following production fixes:

- Enabled permanent HTTP-to-HTTPS redirects for apex and `www`.
- Revalidated `robots.txt`, its sitemap reference, and crawl permission for all 37 production URLs.
- Added the 11 missing Open Graph descriptions and `og:type` to all 37 pages.
- Fixed the 12 reported mobile overflow cases. The 37-page 360px browser sweep now finds no element outside the viewport.
- Added accessible logo naming, corrected footer heading order, and improved low-contrast offer text.
- Removed unused animation libraries and moved fonts and analytics out of the initial rendering path. The final live Lighthouse rerun scored 83 mobile and 93 desktop, up from the 65 mobile baseline while preserving desktop. These are single lab runs, not field Core Web Vitals.
- Changed form handling so Formspree and HubSpot must both return 2xx before the confirmation appears or `generate_lead` is sent. Invalid input, double click, Formspree failure, and HubSpot failure are covered by the browser harness. Real production requests returned 200 from both services and queued `generate_lead` in the GA4 payload.

The detailed baseline below is retained as the before state. See `../ACCEPTANCE-TEST-2026-09-10.md` for the after-state evidence, recovery steps, and remaining account/outreach blockers.

Audited 10 September 2026, approximately 09:54–10:08 WITA. Live site: https://metapacific.co/. Read-only audit; no production fixes, tracking changes, indexing requests, or purchases made.

## Outcome

The technical foundations are present, but the site is not ready to call fully SEO-complete. The homepage is not yet indexed, HTTP is not redirected to HTTPS, 12 pages overflow a 360px mobile viewport, mobile performance needs improvement, and successful inquiries are not measured as GA4 key events.

Google's live smartphone inspection passed: fetch successful, crawling allowed, indexing allowed, and the correct HTTPS canonical detected. This is eligibility, not proof of indexing or rankings.

## Scope and evidence

- Crawled all 37 sitemap URLs plus 12 auxiliary/legacy URLs (49 HTML URLs total).
- Checked 76 unique linked page/image/OG destinations, including seven external destinations. All returned 200 after any HTTP redirects. External 200 responses do not guarantee the expected content or an accessible social account.
- Tested HTTP, HTTPS, www, a nonexistent URL, and a slashless service URL.
- Measured all 37 sitemap pages at a 360×844 CSS viewport. Five representative pages were also measured at 390×844. Desktop/mobile Lighthouse runs cover the homepage only.
- Inspected Search Console, GA4, and GTM through the signed-in jerio@metapacific.co account.
- Read the local repository and handover to understand templates and tracking; findings are based on live checks where stated. Existing email documentation edits were preserved.
- Evidence: `pages.csv` (page inventory), `crawl.json` (HTTP/HTML evidence), `lighthouse-mobile.json`, `lighthouse-desktop.json`, and screenshots under `../../output/playwright/`. Raw fragment checks in crawl.json flag 109 instances that are handled correctly by JavaScript; these are not broken-link findings.

## Coverage summary

| Area | Result | Evidence / action |
|---|---|---|
| Titles | Present and unique on 37/37 | Homepage title is only “Meta Pacific”; improve service/location specificity on important landing pages. |
| Meta descriptions | Present and unique on 37/37 | Many are brief or abstract; improve relevance and proof rather than padding to a character target. |
| H1 | Exactly one, unique on 37/37 | Some commercial H1s are slogans; supporting copy must clearly identify the service. Footer skips to H4 in Lighthouse. |
| Canonicals | Correct self-canonical on 37/37 | HTTP still serves 200; homepage links often use index.html instead of the canonical root. |
| Sitemap | Valid XML, 37 canonical 200 URLs | Search Console Success, last read 9 September, 37 discovered pages. |
| robots.txt | 200, allows crawl, declares sitemap | No sitemap page has a noindex directive or X-Robots-Tag block. |
| Indexability | Technical checks pass | Homepage stored status: Discovered – currently not indexed; live test passes. |
| Schema | JSON parses on 29/37 pages | Organization/WebSite now present on homepage. Article enrichment and breadcrumbs remain opportunities. |
| Open Graph | Incomplete | og:type missing on 37/37; og:description missing on 11/37. |
| Search Console | Accessible and sitemap processed | Coverage report still processing; no experience data yet. Do not report all 37 as indexed. |
| GA4 | Active direct Google tag | G-DJQ0V48YK2 on 37/37; stream receiving traffic; inquiry events are not key events. |
| GTM | Not installed | No GTM container ID in crawled pages; no accounts visible in the inspected Google account. GTM is optional, not an SEO ranking requirement. |
| Internal links | All canonical pages reachable | 31 pages one click from home, five two clicks away; no canonical orphan pages. |
| Broken links | No HTTP failures among checked targets | Category hash links apply working JS filters. Nonexistent path correctly returns 404. |
| Mobile | Needs fixes | 12/37 pages overflow at 360px; menu opens and Villas filter works. |
| Performance | Mobile needs improvement | Homepage performance 65 mobile / 93 desktop in fresh local Lighthouse runs. |

## Prioritized Trello tasks

### P1 — Enforce HTTPS

`http://metapacific.co/` returns 200 without upgrading to HTTPS. `http://www.metapacific.co/` redirects to the HTTP apex. The HTTPS www host redirects correctly to HTTPS apex. Canonical hints help consolidation but do not replace a redirect.

Check GitHub Pages “Enforce HTTPS” and enable it in a separate implementation pass if available. Acceptance: both HTTP variants end at https://metapacific.co/ through permanent redirects; preserve DNS/email records. No need to purchase Hostinger hosting for this.

### P1 — Fix mobile overflow in service grids and qualification forms

At a 360px viewport the following document widths exceed the viewport:

| Page | Document width |
|---|---:|
| /contact/ | 475px |
| /for-whom/enterprise/ | 437px |
| /services/drone-fpv/ | 445px |
| /services/visual-production/ | 441px |
| /services/creative-tech/ | 411px |
| /services/ai-media/ | 398px |
| /services/brand-design/ | 395px |
| /services/virtual-tours/ | 391px |
| /services/growth/ | 390px |
| /services/strategy/ | 389px |
| /services/web-landing-pages/ | 372px |
| /services/social-content/ | 365px |

Contact's `.contact-form-card` measures 455px wide, extending to x=475; the drone page's third `.process-step` extends to x=445. Inspect grid min-content sizing, `min-width:0`, select/input constraints, and mobile column rules. Do not merely hide overflow and clip controls. Acceptance: all 37 pages fit 360/390/768px; inputs, labels, process text and CTA buttons remain usable. Contact and drone also fail at 390px. No form was submitted during this audit.

### P1 — Measure confirmed website leads in GA4

Property 553380390, account 407385152, stream 15746729257, measurement ID G-DJQ0V48YK2. Stream collection is active. Recent events include `lead_form_start`, `lead_form_submit`, `form_start`, and `form_submit`. None is marked as a key event. Key-event list contains `close_convert_lead`, `qualify_lead`, and `purchase`, all with no stream data detected.

`assets/nav.js` fires `lead_form_submit` immediately on the submit event, before Formspree/HubSpot acceptance. Keep attempt and success events distinct. Implement one confirmed-success `generate_lead` per accepted inquiry and mark it as the lead key event. Do not count both generic and custom submit events as two leads. Test success, validation failure, network failure and duplicate prevention. Exclude internal QA traffic carefully: the current report includes `local_test / verification`; do not treat this launch-stage traffic as customer demand.

Last-seven-days home snapshot showed 10 active users, 177 events, and 0 key events. Those totals include testing and are not a conversion baseline. No GA4 configuration was changed.

### P1 — Improve mobile loading

| Homepage local Lighthouse | Mobile | Desktop |
|---|---:|---:|
| Performance | 65 | 93 |
| Accessibility | 90 | 90 |
| Best practices | 100 | 100 |
| SEO checklist | 100 | 100 |
| FCP | 3.4s | 0.9s |
| LCP | 5.3s | 1.6s |
| Total blocking time | 360ms | 0ms |
| CLS | 0.034 | 0.008 |

Single runs on this laptop with Lighthouse mobile/desktop presets; not field Core Web Vitals and not a whole-site performance score. Local load and network conditions affect results. The old handover's mobile 92 score is not the fresh result.

Mobile diagnostics identify render-blocking Google Fonts/CSS (estimated 1,660ms saving), unused JS (~71KiB), image delivery (~99KiB), short cache lifetimes (~177KiB), forced reflow and 3.3s main-thread work. Reduce font variants/critical-path requests, scope GSAP to elements that exist, resize/compress images, and add dimensions to the alternate logo. Retest after changes. Lighthouse SEO 100 does not imply indexing or keyword optimization.

### P2 — Improve search snippets and commercial headings

All 37 titles/descriptions/H1s are unique and populated. No titles exceed 60 characters or descriptions exceed 160 in this inventory; those are review heuristics, not Google limits.

Suggested title directions grounded in existing content:

| Page | Current title | Suggested direction |
|---|---|---|
| / | Meta Pacific | Bali Property Media & Virtual Tours \| Meta Pacific |
| /services/ | Services \| Meta Pacific | Property Media & Creative Services \| Meta Pacific |
| /services/drone-fpv/ | Drone and FPV \| Services \| Meta Pacific | Drone & FPV Property Films in Bali \| Meta Pacific |
| /services/virtual-tours/ | Virtual tours \| Services \| Meta Pacific | Virtual Tours for Bali Property \| Meta Pacific |
| /work/ | Work \| Meta Pacific | Property Film & Virtual Tour Portfolio \| Meta Pacific |

Use these as editorial proposals, not completed changes. Homepage description should explain property media, virtual tours, location and next step. Work descriptions should say what was delivered and where, when documented. Preserve factual boundaries; do not invent results, testimonials, locations or publication dates. Review phrases such as “No fake discounts” and “not a fake quote” in snippets for relevance to the visitor. Contact's response-time promise should be confirmed operationally before repeating it elsewhere.

### P2 — Complete social metadata

Add `og:type` on every canonical page (article for field notes where appropriate, website elsewhere). Add `og:description` on `/`, `/about/`, `/contact/`, `/disclosure/`, `/pricing/`, `/privacy/`, `/resources/`, `/solutions/`, `/terms/`, `/tools/`, `/values/`.

All 37 already have og:title, og:url, og:image and twitter:card; images resolve successfully. Most share the same generic image. Create relevant project/article preview images when approved assets are available, and consider explicit image alt/dimensions. Verify previews separately; HTTP success does not prove how each social platform renders a card.

### P2 — Complete useful schema and accessibility details

Homepage Organization + WebSite schema is live and valid JSON; logo URL returns 200. This supersedes the old handover's missing-schema note. Service/FAQ, Article, CreativeWork, CollectionPage and other types appear across 29 pages. No JSON parse failures found. This audit checks markup structure, not Google rich-result eligibility for every page.

Three Article objects lack publication/modification dates, image and publisher information. Add genuine values that match visible content; never fabricate dates. Consider visible breadcrumbs plus matching BreadcrumbList for nested service/work/article pages. Eight pages have no schema (`disclosure`, field-notes hub, `privacy`, services hub, `solutions`, `terms`, `tools`, `values`); schema is optional, so absence alone is not a defect. FAQ markup does not promise FAQ rich results for this commercial site.

Lighthouse flags the logo link's accessible name, footer H4 heading order and low-contrast text in the black offer panel (example ratio 3.19:1 for small numbered text). Give the home link a reliable accessible name, correct the heading hierarchy, and increase contrast. Images all have alt attributes, but attribute presence alone does not establish suitable descriptions.

### P2 — Normalize internal URL variants

Nine legacy `.html` pages use immediate meta refresh + JavaScript redirects with target canonicals. These return HTTP 200 rather than server 301. `/index.html` also returns the homepage, with its root canonical and history replacement. The slashless `/services` route returns a 200 redirect document. Prefer canonical root/folder URLs in all internal links; use server permanent redirects if the hosting environment supports them without changing infrastructure solely for this.

There are no orphan canonical pages after resolving index.html aliases. Navigation/footer links provide broad discovery; add contextual service-to-project and article-to-service links where useful. The 109 raw fragment warnings for Work categories are expected JS filter links; Villas was verified selected in the rendered page. Do not create duplicate category pages merely to silence a static checker.

### Follow-up — Track actual indexing

Search Console domain property is accessible. Sitemap status is Success, last read 9 September, 37 discovered pages. Homepage index inspection says “Discovered – currently not indexed,” last crawl N/A. At 10:00:15 WITA the live Google Inspection Tool smartphone test fetched successfully with crawling/indexing allowed and canonical https://metapacific.co/.

Coverage report is still processing; experience data is unavailable. Manual actions and Security issues both show “No issues detected.” Recheck coverage after processing and inspect the primary service, portfolio and contact pages. A single homepage inspection does not establish the index status of the remaining URLs. No index request was submitted as part of this read-only audit.

## GTM decision

The live site uses direct `gtag.js`; a googletagmanager.com script URL is not proof of a GTM container. No `GTM-` ID was found, and the Meta Pacific account's GTM Accounts tab is empty. This does not rule out a container owned by another account. GTM is optional. If adopted later, migrate deliberately and remove duplicate direct configuration so page views are not counted twice.

## Sources and limits

- [Google title links](https://developers.google.com/search/docs/appearance/title-link): descriptive titles; Google can rewrite/truncate them.
- [Canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical hints and discovery do not guarantee indexing.
- [GA4 recommended events](https://support.google.com/analytics/answer/9267735): `generate_lead` for submitted inquiries.
- [FAQ rich-result restrictions](https://developers.google.com/search/blog/2023/08/howto-faq-changes): do not promise commercial FAQ rich results.

No backlink campaign, keyword-volume study, competitor ranking analysis or legal/privacy compliance certification is included. Mobile checks use desktop Chromium at mobile widths, not physical iOS/Android devices. Full-page screenshots captured before scroll-triggered animations finish can contain blank reveal areas; they are not proof of missing content. No account data or historical site content was changed.
