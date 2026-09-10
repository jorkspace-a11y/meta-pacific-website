---
name: product-design
description: Product and visual design playbook for Meta Pacific. Use when shaping UX, IA, copy, layout, brand, or before writing frontend code.
icon: pencil
color: orange
---

# Product design

Load this when the work is a page, flow, or brand decision. Design before you generate a pile of markup.

## First questions

Answer these in chat, short, then build:

- Who is this for, in this moment?
- What must they understand in five seconds?
- What is the one action?
- What would make this feel cheap or generic? Kill that.

## System

Canonical: `DESIGN.md`. Live tokens: `assets/site.css`.

- Palette: cream, black, white only.
- Type in CSS: DM Sans for UI/titles, IBM Plex Serif for body. Sizes Title 42 / Subtitle 36 / Subheading 36 / Body 16 / Caption 14.
- Brand lockup (`assets/logo-hero.png`) is the hero mark. Headlines sit under it. Nav uses `assets/logo.png`.
- Structure: Tembo-like tokens and hairlines. Oura/Tembo nav with chevron flyouts and mobile drawer.
- Motion: the flight path is the signature. Work arrives as a formation. No fade-up on every section.

## Anti-references

Purple SaaS gradients. Terracotta-on-cream. Broadsheet density. Identical card kits with soft grey shadows. Tracked ALL-CAPS eyebrows on every heading. Scattered section reveals. Em dashes.

## Copy

Write like a person on a job site, not a pitch deck. Prefer "flight path, walkthrough, lead" over "commercially effective operating system."

## Checks before handoff to code

- Hierarchy is obvious without color tricks.
- Nav labels match destinations. Deep links still work.
- Empty, loading, and error states exist if the page can have them.
- Contrast holds in light and dark (`prefers-color-scheme` and `data-theme`).
- You have a mobile composition, not a squashed desktop.
