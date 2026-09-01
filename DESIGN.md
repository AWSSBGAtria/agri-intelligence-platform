# DESIGN.md — Chittoor Agri-Intelligence Platform
## Indigo + Ink Corporate System • Built 2026-09-01

### Thesis
Live GIS *is* the interface. No marketing hero, no card grid as structure — the map carries the product truth (Sentinel-2 NDVI, MCDA borewell, threshold advisories) and the dark legend carries proof. Implements PLAN.md + DESIGN_reference.md at full fidelity with Pec impeccable Operate mode.

### Tokens
- **Primary:** Indigo #4F46E5, Dark #3730A3, Light #EEF2FF (formula/callout bg)
- **Ink:** #111827 (header/dark panel/text), Soft #1F2937, Muted #6B7280, Border #E5E7EB/#D1D5DB, Surface #F9FAFB
- **Semantic:** Excellent #22C55E, Good #86EFAC, Moderate #FCD34D, Poor #EF4444, Water stress #3B82F6, Existing borewell #3B82F6
- **Type:** Inter 400/500/600/700/800 • JetBrains Mono for formulae/coords • 9.5pt body justified, 14.5pt leading • Mono 7.8pt for NDVI/NDMI/NDWI boxes
- **Radius:** 12–16px cards, 999px pills • Shadow: 0 8px 20px rgba(0,0,0,0.12) • Borders 1px #E5E7EB

### Layout
- **Header:** 32px corporate bar (AGRI-INTELLIGENCE 11px 800 tracking 0.12em + AWS badge) + main controls row (Satellite/NDVI/Borewell/Rainfall toggles + Grid pill + search + Export + bell 3 + settings + AK Analyst). Indigo 1px hairline under header. Footer 1px divider, Page 1/1 right.
- **Pipeline bar (lg only):** #EEF2FF background, 11px, shows S3→STAC→Lambda→Timestream→DynamoDB→SNS→Leaflet, RF AUC 0.87 badge.
- **Main:** flex row • left: advisory strip (gradient tone per Green/Red/Blue/Amber) + map card (rounded-2xl border #E5E7EB) + 4 metrics grid • right: 360px dark legend (#111827) with scroll-thin, border #1F2937. Mobile: legend collapses to <details> drawer.
- **Map overlays:** zoom +/- + north arrow top-left; scale 500m + coords pill bottom-left; minimap 190×110 bottom-left (red extent box, 1km label); pulsing blue blip tooltip + green pin drift top-right; Workbox badge center-top.

### Components
- **Map layers:** ESRI Satellite vs OSM toggle • NDVI heat via CircleMarker 36px #FEF3C7→#16A34A ramp • borewell suitability hatched polygons 0.22–0.32 opacity, dashed Poor • rainfall isohyets #60A5FA 8 8 dash • 30-ac polygons green stroke #22C55E 1.4px, selected indigo 2.5px, fill by signal (Green #DCFCE7, Red #FEE2E2, Blue #DBEAFE) • existing blue dots #3B82F6 18px • water blips pulsing ripple 1.6s • recommended pins 28×34 drift animation.
- **AdvisoryStrip:** left icon 40px (Sprout/Droplets/Wheat/Eye) • signal pill (Green/Red/Blue/Amber) • Telugu line • coords mono pill on right (md+).
- **Legend sections:** Borewell Recommendation 4 rows (color square 12px + count + desc) • Map Layers Key (Blue Blip 3 Active, Green Polygon 8 Fields) • Indicators 3 white cards (Rainfall 12.4mm, NDVI 0.62, Borewell 4 sites) • Summary Metrics 2×2 grid + alert callout • Blocks Quick Select 8 • Formulae #EEF2FF callout with 3 mono boxes.
- **Controls:** primary Export #4F46E5→#4338CA hover, 12px bold • secondary toggles: active Satellite #111827, NDVI #16A34A, Borewell #4F46E5, Rainfall #0EA5E9, inactive #6B7280.

### Motion
- ripple 1.6s ease-out (blips), pulse-dot 0.92 scale, drift 2s translateY(-2px) for pins. No page-load orchestration (Operate: 150–250ms state transitions only).

### A11y & Perf
- Contrast ≥4.5:1 body (#111827 on white, white on #111827), ≥3:1 large. Focus via native outline. Initial load <3s 3G target, <200MB tile cache, 60fps pan, leaflet 388k gz 117k.

### Offline
- manifest.json + sw.js (Workbox-style cache-first for OSM/ESRI, LRU, precache / + index.html). Simulated badge + SQLite sql.js noted in footer. AppSync offline mutations queued (future).

### What was not invented
- Prices, benchmarks, and borewell depths are from DESIGN_reference: Excellent >0.75 Green, Good 0.60–0.75 Light Green, Moderate 0.40–0.60 Yellow, Poor <0.40 Red; depth 45–60m (alluvium 45–50m, granite 60–62m); NDVI/NDMI/NDWI formulae verbatim; bbox 78.9,13.0,79.3,13.4.
