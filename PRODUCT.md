# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Static HTML, CSS and JavaScript (ES modules), with no build step. The user chose this over Astro and Flask. Data lives in `data/*.json`, and Leaflet 1.9.4 is vendored. The pages are served with `python -m http.server`, and GitHub Pages is the likely host. The user wants to learn Astro later, so the data must stay portable to Astro content collections.

## Users
The primary users are tourists, Mexican and foreign, who want to learn about the indigenous peoples of the State of Mexico (Estado de México) and pick places to visit. They read in Spanish (primary) or English. A second audience is the school jury evaluating the project at its presentation.

## Product Purpose
An informational tourist guide to the five original peoples of the Estado de México: Otomí (Hñähñu), Mazahua (Jñatjo), Nahua, Matlatzinca and Tlahuica (Pjiekakjo). It covers their food, customs, festivals, crafts and short phrases in their languages. An extra section covers the state's archaeological sites, "the heart of civilization in its beginnings". It is not a travel agency: there is no booking, pricing, payment or accounts. Success means a convincing school presentation, with a chance of continued development afterwards.

## Positioning
A physical companion device, an animated axolotl voice assistant (ESP32-S3 with a round screen), will answer visitors' questions using the same data that powers this site. The axolotl is the mascot of both the site and the device.

## Operating Context
- Presented at school on a laptop, with internet from a phone hotspot.
- Visitors browse on phones and desktops.
- Content is researched by Claude from cited sources (INPI, CEDIPIEM, INAH, INALI, INEGI), and the team reviews it.

## Capabilities and Constraints
- Spanish (default) and English, with a toggle that is remembered.
- Mini map and a full map of communities and archaeological sites (Leaflet + OpenStreetMap).
- Client-side search.
- "Mi Ruta": a personal list of favourites, saved only in the browser.
- Each people has its own page, with short verified phrases in its language.
- Data that has not been verified is stored but never shown. Proper names are never translated.
- No hours or prices are stated for the sites; the site links to INAH instead.

## Brand Commitments
- Name: "EdoMéx · Guía Turística". Tagline: "Viaja, conoce y cuida nuestras raíces". Hashtag: #EdoMéxTurístico.
- The user's reference composition (`docs/diseno/referencia.webp`) is binding: papel picado, Mexican festive palette (rosa mexicano, verde nopal, cempasúchil yellow, purple, cream), and the axolotl mascot greeting with a backpack and embroidered blouse.
- Illustrations are drawn in SVG. The user will choose the axolotl style from 3 proposals.
- No official government shields or logos. Social links stay unlinked until real accounts exist.

## Evidence on Hand
- Research drafts: `docs/investigacion/`.
- Photos come only from Wikimedia Commons, with credits.
- There are no testimonials, visitor numbers or partnerships, and none may be invented.

## Product Principles
1. Respect over spectacle: the peoples are presented as living communities, by their own names, and never as folklore.
2. Every fact has a source; anything unverified is hidden.
3. Inform, never sell.
4. One dataset serves both the site and the axolotl assistant.
5. Keep it simple enough for a hobbyist team to maintain.

## Accessibility & Inclusion
- WCAG AA contrast, keyboard navigation and visible focus.
- Usable at 375 px wide.
- Respects reduced motion.
