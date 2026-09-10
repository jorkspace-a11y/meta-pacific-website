# Meta Pacific production acceptance test

Tested 10 September 2026 against `https://metapacific.co/` and the local production files.

## Verified production path

- HTTP apex and `www` permanently redirect to `https://metapacific.co/`.
- `robots.txt` returns 200, allows all intended pages, and references the production sitemap.
- `sitemap.xml` contains 37 canonical URLs. All 37 return 200 and none carries a `noindex` or blocking `X-Robots-Tag` directive.
- All 37 pages contain one H1, one self-referencing canonical, an Open Graph description, and `og:type` (`article` on field notes, `website` elsewhere).
- The complete 37-page 360px check found no content element outside the viewport after the CSS fix. Form fields, process cards, buttons, and navigation remain usable.
- A real production form submission stayed on Meta Pacific and returned 200 from both Formspree and HubSpot. The page showed: “Thanks. Your project inquiry has been received.”
- The successful request queued `lead_form_submit` and `generate_lead` in the GA4 collection payload. `generate_lead` is sent only after both destinations accept the inquiry.
- UTM values `e2e_test / qa / challenge_acceptance` were included in the HubSpot submission.
- HubSpot sent a new acknowledgement for each controlled submission to `jerio.workspace@gmail.com`. Multiple submissions used the same email, exercising HubSpot's email-based contact deduplication path.
- An earlier controlled reply reached `jerio@metapacific.co`, confirming that the acknowledgement can be replied to.

Controlled production markers: `MP-E2E-20260910-C-AJAX`, `MP-E2E-20260910-D-GA4`, `MP-E2E-20260910-E-GA4WIRE`, `MP-E2E-20260910-F-SCREENSHOT`, `MP-E2E-20260910-G-PROOF`, and final rerun `MP-E2E-20260910-H-FINAL`. These are QA records and must not be counted as prospects.

## Failure-path results

The browser harness in `form_failure_test.js` covers each client-side branch without damaging the live workflow.

| Case | Result | Recovery |
|---|---|---|
| Missing or invalid required fields | Browser blocks submission, focuses the first invalid field, and sends no request. | Correct the highlighted values and submit again. |
| Double click / duplicate attempt | The button is disabled while sending; one Formspree request and one HubSpot request are made. | If a person later resubmits, HubSpot updates the contact matched by email and the timeline records another submission. |
| Formspree failure | No success event is recorded. The form retains the values and displays a retry message with the direct WhatsApp fallback. | Retry once. If it still fails, copy the inquiry to HubSpot from the notification/reply and record the source as `website_form_manual_recovery`. |
| HubSpot failure | No success event is recorded. The form retains the values and displays the same recovery message. | Locate the Formspree notification, create or update the contact by email in HubSpot, copy the source/UTM fields, and log a note stating that it was recovered from a failed website handoff. |
| HubSpot workflow or acknowledgement failure | The contact/form submission remains the source record even if the workflow action fails. | Open workflow `4883531481`, review action history for the contact, retry the failed action if HubSpot offers it, or reply manually from `jerio@metapacific.co`; log the reply on the contact. Do not resubmit the public form because that distorts conversion counts. |
| Internal notification missing | Formspree and HubSpot are independent destinations. | Search HubSpot by the lead email and check Formspree submissions. If one contains the lead, use that record and document which notification channel failed. |
| Missing next activity | The submission is accepted but no owner task exists. | Assign an owner and add the next dated task on the contact/deal before moving it beyond New Lead. |

## Lead handling rule

Use the pipeline stages already approved in the handover: New Lead, Qualified, Contacted, Meeting, Proposal, Won, and Lost. A reply changes the contact to Contacted and cancels any pending generic follow-up. A booked meeting moves it to Meeting. A clear decline or disqualification moves it to Lost and stops outreach. A conversion moves it to Won and stops prospecting messages.

The current HubSpot plan must enforce these actions before automated outreach is called fully accepted. Until a sequence or workflow is visibly configured, apply the rule manually and record the next activity on the contact.

## Remaining acceptance blockers

- `generate_lead` is live on the wire, but it still needs to be marked as a GA4 key event in the signed-in GA4 admin UI.
- The connected Google Drive and local workspace searches did not locate the Meta Pacific property developer database. No real prospect was selected or emailed because qualification, consent/source, and contact accuracy cannot be assumed.
- Delivery and acknowledgement are verified. Bounce, click, real reply, conversion stop logic, automated pipeline transitions, and a unified live management dashboard require a real qualified sample plus available HubSpot features.
- The signed-in browser automation surface failed to initialize during this run, so account-only UI changes and Trello attachment upload could not be performed through that surface. Public screenshot evidence is stored with this report and linked from the Trello card description.

## Evidence

- `seo-audit-2026-09-10/AUDIT.md`
- `seo-audit-2026-09-10/pages.csv`
- `seo-audit-2026-09-10/crawl.json`
- `seo-audit-2026-09-10/form_failure_test.js`
- `seo-audit-2026-09-10/live_form_test.js`
- `seo-audit-2026-09-10/evidence/live-form-success-proof.png`
- `seo-audit-2026-09-10/evidence/live-home-mobile.png`
