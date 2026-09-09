---
name: fullstack
description: End-to-end frontend and backend engineering for Meta Pacific. Use when implementing pages, forms, APIs, data, auth, email, or Hostinger deploy.
icon: code
color: cyan
---

# Full-stack

Ship the smallest working slice. Frontend in this repo is static HTML. Backend does not exist yet.

## Frontend

- Copy a sibling HTML page. Keep the head, nav, footer, and relative URLs.
- Tokens and components live in `assets/site.css`. Add a class there instead of inline one-offs, unless it is truly a one-page exception.
- JS stays vanilla. New behavior gets its own small file only if `nav.js` / `live.js` / `work-archive.js` would get messy.
- Accessibility: real labels, buttons that are buttons, `aria-expanded` on the drawer, alt text that is not filename junk.
- If you add a page, update `sitemap.xml` and any nav that should point at it.

## Backend (when the user asks)

Default stack if they want Hostinger:

1. Static files as they are.
2. Contact form POST to a PHP mailer or Form-like endpoint in `public_html`.
3. Only add a database if they need to store leads, auth, or CMS content.

Do not introduce Next.js, Vite, Docker, or an admin SPA unless they ask. This site is already live as files.

Hard rules:

- Never commit secrets, SMTP passwords, or API keys.
- Validate and cap every field. Escape output.
- Confirm a test submit actually arrives (mailbox, log, or Hostinger file).
- CORS and cookies only as needed. Prefer same-origin.

## Hostinger

You cannot log into hPanel. You can prepare files and, if the user gives SFTP or Git deploy, upload to `public_html`. GitHub Pages is the current public host (`/meta-pacific-website/` base path). Relative URLs must keep working in both places.

## Quality

- Match existing naming.
- No unused CSS or JS.
- If you touch shared CSS, click Home, Work, Services, Contact, and one nested work page.
