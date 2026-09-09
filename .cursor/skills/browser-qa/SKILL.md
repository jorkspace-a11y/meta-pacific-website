---
name: browser-qa
description: Verify Meta Pacific in Cursor Browser on the laptop. Use after UI or frontend changes, or when the user asks to test, debug, or check a page.
icon: bug
color: green
---

# Browser QA

Use Cursor's Browser pane on the local machine. This is the debug browser. Do not ask for Cloud desktop.

## Serve the site

Prefer a local static server from the repo root so nested routes like `/work/` and `/services/` resolve:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`. If you only changed a single HTML file and links are relative, opening the file can be enough, but nested work/services pages need the server.

## Exercise the change

A screenshot is not verification.

1. Click the real flow a user would: nav, dropdowns, mobile drawer, the new page, forms.
2. Open every route that shares the nav, CSS, or JS you touched.
3. Check empty/error/off-path states if they exist.
4. Desktop (~1280) and mobile (~390). Drawer must cover the viewport.
5. Read console. Fix errors you introduced.
6. If something failed, fix it and re-run the same clicks.

## Meta Pacific specifics

- Brand lockup on heroes, logo in nav, cream/black/white only.
- Mobile menu: hamburger, full-viewport drawer, close, no page scroll leak if that is current behavior.
- Work archive and nested `work/*` pages if those files changed.
- Contact form: submitting should not dump the user on a dead page. If it is still unwired, say so.

Report what you clicked, what broke, and what you could not verify.
