# PRODUCT.md — Chittoor Agri-Intelligence

**Mechanism:** Offline-resilient, Free Tier-first geospatial pipeline that turns free Sentinel-2 L2A COGs + Bhuvan + OSM into daily 6 AM block-level advisories (30-acre polygons) with borewell suitability prediction.

**Audience:** Atria AWS Student Builder Group → GKVK pilot (5 blocks) → Chittoor Gudur Mandal farmers (15 blocks, 450 acres, scales to 500+). Used at 6 AM in field, often zero bars.

**Job:** Answer within seconds: *should I sow / harvest / irrigate today, and where should I drill?* with live map proof (NDVI heat, blips, pins, minimap).

**Proof:** NDVI/NDMI/NDWI from B04/B08/B11/B03 + SCL mask 3,8,9,11 • Timestream time series • threshold engine (Sowing: 5-day rain>20mm + slope>0.02/day x3 + 0.2→0.3 7–10d; Harvest: peak>0.6→<0.35 after 30d; Water Stress: NDMI<0.1 + drop>0.15 7d) • MCDA 8-factor AHP (Slope 18%, Drainage 20%, Lineament 16%, Lithology 14%, Geomorph 10%, NDVI 8%, Rainfall 8%, Elevation 6%) + Random Forest 523 CGWB points (ROC AUC 0.87, 82%) → 4-class raster (Excellent >0.75 Green, Good 0.6–0.75 Light Green, Moderate 0.4–0.6 Yellow, Poor <0.4 Red).

**Constraints:** $0 imagery (S3 Open Data + Element84 STAC cloud<20% + range requests 90% egress saved), <$15/mo post Free Tier 100+ blocks, Workbox tile cache z12–16 <200MB WebP LRU, PWA + SQLite offline, Cognito 7-day JWT, Telugu advisories, 500m scale + EPSG:4326.

**Commitment:** Corporate Indigo #4F46E5 + Ink #111827 minimal, not cream/serif luxury nor neon night. Operate mode: scanability over expression.
