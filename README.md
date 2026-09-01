# Chittoor Agri-Intelligence Platform
**Project Chittoor • Atria Community Day 3 • AWS Student Builder Group**

Offline-resilient, Free Tier-first geospatial platform delivering daily 6 AM block-level advisories (30-acre polygons) with borewell suitability prediction — built per `PLAN.md` + `DESIGN_reference.md`.

Live demo: `npm run dev` → http://localhost:5173

## Architecture
`S3 Open Data (Sentinel-2 L2A COGs, SRTM DEM) + Bhuvan + OSM → STAC Element84 (cloud<20%) → Lambda (rasterio, SCL 3/8/9, NDVI/NDMI/NDWI, zonal_stats) → Timestream + DynamoDB + SageMaker (RF 523 pts, ROC AUC 0.87) → API Gateway + AppSync GraphQL + SNS → React + Leaflet/MapLibre PWA`

## Features (Phase 3 Live Geo View)
- ESRI Satellite / OSM / Sentinel-2 True Color toggles
- 30-acre polygon grids (green stroke, fill by signal)
- NDVI heatmap (yellow→dark green ramp)
- Borewell suitability hatched polygons (4 classes: Excellent Green 2, Good Light Green 1, Moderate Yellow 3, Poor Red 2)
- Water stress blips (pulsing blue ripple, 3 active) + recommended pins (pulsing green, depth 45–60m)
- Rainfall isohyets, minimap Gudur Mandal 1km + red extent box, 500m scale, north arrow, WGS84 coords
- Right dark Legend & Insights panel (borewell rec, layer key, indicators, 450-acre metrics)
- Threshold engine: Sowing / Harvest / Water Stress advisories (EN + Telugu)
- Offline: Workbox precache z12–16 <200MB WebP LRU + sw.js + SQLite via sql.js; simulation mode when offline
- Performance: <3s on 3G, 60fps pan

## Stack
Vite + React 19 + TypeScript (strict) + Tailwind 4 + Leaflet 1.9 + react-leaflet 5 + lucide-react. Logic in `src/lib/agriEngine.ts` (NDVI/NDMI/NDWI, threshold, MCDA, RF inference) — mirrors Lambda.

## Scripts
```bash
npm install
npm run dev      # dev server
npm run build    # tsc -b && vite build
npm run preview
```

## Mock Data
`src/data/mockData.ts` — 15 blocks (CHT-01..15, Gudur/Pileru/Tirupati/Chittoor), 5 existing borewells, 8 recommended, 3 blips, isohyets, NDVI heat cells, 14-day time series.

## PWA
`public/manifest.json` + `public/sw.js` (tile cache-first, precache shell). Offline tile budget <200MB verified in legend.

## Docs
- `PLAN.md` — 12-week implementation plan (MVP → borewell → Live Geo View → PWA → pilot → demo)
- `DESIGN_reference.md` — corporate Indigo+Black spec, formulae, AHP weights, GraphQL schema
- `DESIGN.md` — as-built design system
- `PRODUCT.md` — product truth
