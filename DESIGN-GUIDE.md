# Design Guide — set these in the Studio Design/Theme panel (no-code)

Rationale: your three logos (Super Umzug, Super Entrümpelung, BayReno) are bold, black,
stencil/industrial display caps with a stacked-arrow mark. The site design should read as
classy and restrained so the logos stay the loudest graphic element on the page — not a busy
background, not a competing display font.

## Color palette (Site Design → Colors)

| Role | Color | Hex |
|---|---|---|
| Primary background (dark) | Deep Navy | `#0E1F3C` |
| Secondary dark / cards on dark | Anthracite | `#20242B` |
| Base background (light) | Off-white | `#FAF9F6` |
| Text on light | Near-black | `#191B1F` |
| Text on dark | White | `#FFFFFF` |
| Accent (CTAs, dividers, badges) | Muted Gold | `#C9A24B` |
| Accent hover/darker | Deep Gold | `#A9832F` |
| Success (form) | `#2E7D32` |
| Error (form) | `#B3261E` |
| Border/hairline on light | `#E3DFD6` |

Usage rules: gold is an *accent only* — CTA buttons, small badges ("Unbeschädigt-Garantie"),
underlines/dividers, icons. Never use gold as a large fill or body text color. Navy and
anthracite carry the weight; off-white sections give the eye rest between dark sections.

## Typography (Site Design → Fonts)

- **Headlines (H1–H3)**: *Fraunces* (serif, premium, slightly editorial — available in Wix's
  Google Fonts list). Alternative if you want something closer to the stencil-industrial logo
  feel: *Big Shoulders Display* (bold condensed grotesque).
- **Body / UI text**: *Inter* — clean, highly legible at small sizes, wide weight range.
- **Scale**: H1 44–56px / H2 32–36px / H3 22–26px / Body 16–18px / Small print 13–14px. Use
  generous line-height on body copy (1.5–1.6) to reinforce the "classy, reliable" tone.

## Layout & spacing

- Section vertical padding: 80–120px desktop, 48–64px mobile.
- Max content width: ~1200px, centered, with 24–40px side gutters on smaller viewports.
- Card system: white/off-white cards on navy sections (or navy cards on off-white sections),
  1 consistent corner radius (8–12px) across all cards site-wide, subtle shadow (`0 4px 20px
  rgba(0,0,0,0.08)`), 1px hairline border `#E3DFD6` on light cards.
- Buttons: primary = solid gold fill, navy text, 8px radius; secondary = outline (1.5px, navy or
  white depending on background), transparent fill; both same corner radius as cards.
- Icons: thin-line/monoline icon set (not filled/cartoon), matches the restrained stencil-logo
  aesthetic. Avoid moving-truck/box clip-art — use abstract icons (shield/check = guarantee,
  route/pin = service area, clock = scheduling, document = documentation/claims).

## Imagery

- Use real or professional stock photography only: clean interiors, packed boxes in a tidy
  stack, a tidy empty room after clearance, a renovated room — no cartoon illustrations.
- Image treatment: subtle navy duotone/overlay (10–20% opacity) on hero images so headline text
  stays legible without hurting brand consistency.
- Logo placeholders: reserve a fixed-height image slot per brand block (recommend 40–56px tall,
  auto width) in header/footer/brand cards so all three logos — which have different aspect
  ratios — sit visually level. Use "Fit" (not "Fill" or "Crop") for logo image settings.

## Motion

- Keep interactions minimal and confident: fade/slide-up on section scroll-in (Studio's built-in
  scroll effects), no bouncy/playful easing. Buttons: simple hover darken/lighten, no scale
  bounce.
