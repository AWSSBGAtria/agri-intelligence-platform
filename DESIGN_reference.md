# DESIGN.md - Remote Geographical / Agri-Intelligence Platform
## Project Chittoor | Atria Community Day 3 | AWS Student Builder Group
### Corporate Design Document - Indigo + Black Theme

---

### 1. Design Philosophy
- **Minimal & Corporate:** Sans-serif (Inter/Liberation Sans), 9.5pt body, justified, indigo #4F46E5 accent + black #111827, light indigo #EEF2FF for formula/callout backgrounds.
- **Header:** Top left `Agri-Intelligence` 8.5pt Bold Black, top right brandmark `● AWS Student Builder Group` 8pt Bold Black, thin indigo line 0.8px under header.
- **Footer:** Thin light gray line #E5E7EB above footer, `Page x / n` bottom right 7.5pt Gray.
- **Offline-First:** Every feature must work with zero bars. PWA + Service Worker + SQLite.
- **Free Tier First:** $0 imagery, <$15/mo after Free Tier for 100+ blocks. No paid APIs.

### 2. High-Level Architecture

```
[Data Sources]
  Sentinel-2 L2A (S3 Open Data) | Sentinel-1 SAR | Landsat 8/9 | CHIRPS/GPM | Open-Meteo | SRTM DEM 30m | Bhuvan Lithology/Geomorphology | OSM Drainage | CGWB Borewell Points
      |
      v
[STAC API - Element84 Earth Search] -- bbox + cloud<20% --> S3 COG Range Requests
      |
      v
[Compute Layer - Lambda Python 3.11]
  - stac-query (catalog)
  - process-scene (rasterio, SCL cloud mask 3,8,9, NDVI/NDMI/NDWI, zonal mean rasterstats)
  - rainfall-ingest (Open-Meteo + CHIRPS)
  - threshold-engine (sowing/harvest/water stress rules)
  - borewell-predict (MCDA + Random Forest)
      |
      v
[Storage Layer]
  - Timestream: time, block_id, ndvi, ndmi, ndwi, rainfall, slope, drainage_density
  - DynamoDB: blocks GeoJSON, advisory logs, borewell suitability raster metadata, recommended points
  - S3: agri-raw, agri-processed (COGs), dem-cache, borewell-suitability
      |
      v
[Delivery Layer]
  - API Gateway + AppSync GraphQL (subscriptions for live updates)
  - SNS + Amplify Push (PWA push, SMS, WhatsApp)
  - QuickSight Embedded + React + Leaflet/MapLibre PWA
```

### 3. Component Design

#### 3.1 Data Acquisition
- **STAC Query:** Element84 `https://earth-search.aws.element84.com/v1/search` with `bbox: [78.9,13.0,79.3,13.4]` Chittoor, `datetime: last 5 days`, `cloud_cover<20`, collections `sentinel-2-l2a`.
- **COG Range Requests:** Use `rio-tiler` + HTTP Range to fetch only B04 (Red 665nm), B08 (NIR 842nm), B11 (SWIR 1610nm), B03 (Green 560nm), SCL (Scene Classification) for 30-acre polygon bbox. Reduces egress 90%.

#### 3.2 Preprocessing
- **Cloud Mask:** SCL classes 3 (cloud shadow), 8 (cloud medium prob), 9 (cloud high prob), 11 (snow). Mask out, interpolate via previous clear observation.
- **Resampling:** All bands to 10m using bilinear.

#### 3.3 Spectral Indices
```
NDVI = (NIR - Red) / (NIR + Red) # -1 to +1, <0.2 bare, 0.2-0.4 sparse, >0.6 dense
NDMI = (NIR - SWIR) / (NIR + SWIR) # Soil moisture proxy, <0.1 stress
NDWI = (Green - NIR) / (Green + NIR) # Water body detection
```
- Formula boxes in UI with light indigo background #EEF2FF, Mono 7.8pt.

#### 3.4 Zonal Statistics
- `rasterstats.zonal_stats(polygon, raster, stats=['mean'])` per 30-acre block.
- Output: `{block_id: 'CHT-01', date: '2026-07-15', ndvi_mean: 0.62, ndmi_mean: 0.34,...}`

#### 3.5 Time Series & Rainfall Overlay
- **Timestream:** Database `agri-intel`, Table `block-timeseries`, retention 1yr memory, 2yr magnetic.
- **Rainfall:** Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=13.2&longitude=79.1&daily=precipitation_sum&forecast_days=7` + CHIRPS historical `0.05°` daily.

#### 3.6 Threshold Engine (Decision Logic)
```
Sowing Rule: 5-day cumulative rain >20mm AND NDVI slope >0.02/day for 3 consecutive obs AND NDVI 0.2->0.3 sustained 7-10 days => Green (Sowing Window)
Watch Rule: Slope condition met but rain 10-20mm => Amber (Watch)
Harvest Rule: NDVI peak >0.6 then drop to <0.35 after 30 days => Blue (Harvest Ready)
Water Stress: NDMI <0.1 AND NDVI drop >0.15 in 7 days => Red Blip + SNS alert
Borewell Rule: Suitability Excellent/Good + Slope<8% + Drainage density moderate => Green Pin Recommended Depth 45-60m
```
- Diagram: Diamond flowchart with Yes/No branches to Green/Amber/Red/Gray.

#### 3.7 Borewell Suitability Prediction (Optional Addition)
**Input Factors (8):**
| Factor | Source | Weight (AHP) | Normalization |
|--------|--------|--------------|---------------|
| Slope | SRTM DEM 30m -> gdaldem slope | 18% | 0-1, low slope = high score |
| Drainage Density | OSM Overpass + line density | 20% | 0-1, moderate = high score |
| Lineament Density | Bhuvan + manual digitization | 16% | 0-1, high density = high score |
| Lithology | Bhuvan | 14% | Rank: alluvium=1, granite=0.3 |
| Geomorphology | Bhuvan | 10% | Rank: pediplain=1, hill=0.2 |
| NDVI/NDWI | Sentinel-2 mean annual | 8% | 0-1, moderate veg = high |
| Rainfall | CHIRPS mean annual | 8% | 0-1, high rain = high |
| Elevation | SRTM DEM | 6% | 0-1, low elevation = high |

**MCDA:** `suitability = Σ(weight_i * normalized_factor_i)`

**Random Forest:**
- Features: 8 factors, Target: borewell success 1 / failure 0
- Dataset: 523 points CGWB + field survey GKVK/Chittoor
- Split: 80/20, 100 trees, max_depth 10, min_samples_split 5
- Metrics: ROC AUC 0.87, Accuracy 82%, Precision 0.84
- Output raster: 4 classes via natural breaks
  - Excellent >0.75 #22C55E Green - 2 sites
  - Good 0.6-0.75 #86EFAC Light Green - 1 site
  - Moderate 0.4-0.6 #FCD34D Yellow - 3 sites
  - Poor <0.4 #EF4444 Red - 2 sites
- Lambda `borewell-predict`: Takes bbox, runs MCDA + RF inference, writes COG to S3 `s3://agri-processed/borewell-suitability/{bbox}.tif`, recommended points centroids of Excellent zones slope<8% drainage moderate, writes to DynamoDB `borewell-recommendations` with depth 45-60m based on lithology (alluvium 45m, granite 60m).

**Diagram:** 8 input boxes left -> central indigo box MCDA + Random Forest -> right box 4-class suitability map.

#### 3.8 Live Geographical View - Map Dashboard Design
**Goal:** Provide live GIS with all features over map, with minimaps, blips, pointers, comprehensive legend.

**Base Layers (Free):**
- OSM Standard `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- ESRI Satellite `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- Sentinel-2 True Color Mosaic `s3://sentinel-s2-l2a-mosaic` via titiler

**Offline Strategy:**
- Workbox Service Worker precaches tiles for Chittoor bbox z12-16, <200MB, LRU cache, WebP compression
- If no internet, simulation mode: pre-downloaded Sentinel-2 true color + SRTM hillshade

**Map Features (Overlays):**
- 30-acre polygon grids: GeoJSON, green stroke #22C55E 1px, fill transparent, label `PLOT-0X • 30ac` 6pt green
- NDVI heatmap: raster tiles from Lambda, color ramp Yellow #FEF3C7 -> Light Green #86EFAC -> Dark Green #16A34A
- Borewell suitability zones: hatched polygons, colors per class, opacity 0.4
- Existing borewells: blue icons #3B82F6
- Recommended borewell sites: green pins #22C55E with pulsing animation, label `Recommended Borewell Depth 45-60m` black tooltip
- Water stress blips: pulsing blue dots #3B82F6 with 3 ripple rings animation, tooltip `Water Stress • Soil Moisture Low`, 3 active
- Rainfall isohyet lines: from CHIRPS, dashed blue #60A5FA
- Minimaps: bottom left `Zoomed Inset • Gudur Mandal` 1km scale bar, red box showing main map extent
- Scale bar: 500m bottom, north arrow top right
- Coordinates: bottom Lat 13.217°N, Lon 79.100°E • CRS: WGS 84 / EPSG:4326

**Legend & Insights Panel (Right Side, Dark Theme #111827):**
```
Legend & Insights
Borewell Recommendation
  [■ Green] Green = Excellent Borewell • 2 Sites
  [■ Light Green] Light Green = Good • 1 Site
  [■ Yellow] Yellow = Moderate • 3 Sites
  [■ Red] Red = Poor • 2 Sites
Map Layers Key
  [● Blue Blip] Blue Blip = Water Stress • 3 Active
  [⬡ Green Polygon] Green Polygon = Sowing Window • 8 Fields Active
Indicators
  [☁ Rainfall] Rainfall • 12.4mm / 24h • Light
  [🌿 NDVI] NDVI • Avg 0.62 • Healthy
  [📍 Borewell] Borewell • 4 Recommended Sites
Summary Metrics
  Total Monitored Area 450 acres
  Avg Soil Moisture 28% • Low
  Weather 28°C • 65% RH
  [⚠ Alert] 3 locations show critical water stress. Recommend immediate irrigation.
```

**UI Controls:**
- Top bar: Map Layers toggles Satellite (active green), NDVI (active green), Borewell (active green), Rainfall (gray), Grid: 30-acre Polygons • Basemap: ESRI Satellite, Export Map button
- Top right: ONLINE • Bell 3 notifications • Settings • AK Analyst • Corporate
- Zoom: + / - buttons bottom left

**Performance:**
- Initial load <3s on 3G, tile cache <200MB, 60fps pan/zoom, 450 acres monitored pilot

**Diagrams:**
- Figure 6: Live GIS Dashboard mockup with legend & insights
- Figure 7: Integrated overlay map with NDVI + borewell zones + pointers

### 4. Data Model

#### DynamoDB Tables
**blocks**
```
{
  block_id: "CHT-01",
  geojson: {...},
  area_acres: 30,
  village: "Gudur",
  mandal: "Gudur",
  soil_type: "Red Sandy Loam",
  created_at: "2026-07-01"
}
```

**advisory_logs**
```
{
  advisory_id: "ADV-2026-07-15-CHT-01",
  block_id: "CHT-01",
  date: "2026-07-15",
  ndvi: 0.62,
  ndmi: 0.34,
  rainfall_5d: 24.5,
  signal: "Green", // Green, Amber, Red, Blue
  type: "Sowing Window",
  message_en: "Sowing optimal for groundnut",
  message_te: "వేరుశనగ విత్తడానికి అనుకూలం",
  created_at: "2026-07-15T00:00:00Z"
}
```

**borewell-recommendations**
```
{
  recommendation_id: "BW-REC-01",
  lat: 13.217,
  lon: 79.100,
  suitability_class: "Excellent",
  suitability_score: 0.82,
  depth_estimated_m: "45-60",
  lithology: "Alluvium",
  slope_deg: 4.2,
  drainage_density: 1.8,
  created_at: "2026-07-15"
}
```

#### Timestream
```
Database: agri-intel
Table: block-timeseries
Dimensions: block_id
Measures: ndvi:double, ndmi:double, ndwi:double, rainfall:double, slope:double, soil_moisture:double
Time: daily
```

### 5. API Design (AppSync GraphQL)

```graphql
type Block @model {
  block_id: ID!
  geojson: AWSJSON!
  latest_advisory: Advisory
  timeseries(limit: Int): [TimeSeries]
  borewell_suitability: BorewellSuitability
}

type Advisory @model {
  advisory_id: ID!
  block_id: ID!
  signal: String! # Green, Amber, Red, Blue
  type: String! # Sowing, Harvest, Water Stress
  message_en: String!
  message_te: String!
  created_at: AWSDateTime!
}

type BorewellRecommendation @model {
  recommendation_id: ID!
  lat: Float!
  lon: Float!
  suitability_class: String! # Excellent, Good, Moderate, Poor
  suitability_score: Float!
  depth_estimated_m: String!
}

type Query {
  getBlock(block_id: ID!): Block
  listBlocks(village: String): [Block]
  getLiveMap(bbox: [Float]): LiveMap
}

type Subscription {
  onNewAdvisory(block_id: ID!): Advisory @aws_subscribe(mutations: ["createAdvisory"])
  onNewBorewellRecommendation: BorewellRecommendation @aws_subscribe(mutations: ["createBorewellRecommendation"])
}
```

### 6. UI/UX Design System

**Colors:**
- Indigo #4F46E5 Primary, Indigo Dark #3730A3 Header, Light Indigo #EEF2FF Background
- Black #111827 Text, Gray #6B7280 Secondary, Light Gray #F3F4F6 Borders, #E5E7EB Divider
- Green #22C55E Excellent Borewell / Sowing, Light Green #86EFAC Good, Yellow #FCD34D Moderate, Red #EF4444 Poor, Blue #3B82F6 Water Stress / Existing Borewell

**Typography:**
- Sans: Inter / Liberation Sans
- H1: 14pt Bold Black / Indigo number 01,02
- H2: 10.5pt Bold Black
- H3: 9pt Bold Indigo
- Body: 9.5pt Regular #1F2937 Leading 14.5pt Justified
- Caption: 7.5pt Italic Gray Center
- Formula: 7.8pt Mono #111827 Background #EEF2FF

**Components:**
- Tables: Header Black or Indigo, white text, grid #E5E7EB, row alt #F9FAFB / #F5F3FF
- Figures: Border 0.5px #E5E7EB, caption background #F9FAFB, max-width 90%, max-height 420px, centered
- Buttons: Indigo background white text rounded 6px, secondary white indigo border
- Map: Dark theme header #111827, green active toggles #16A34A, pulsing blips blue ripple animation

### 7. Security & Privacy
- Cognito User Pools, JWT 7-day offline cache via Amplify Auth
- IAM least privilege: Lambda only Timestream write, DynamoDB full, S3 read Open Data + write processed
- Farmer data owned by farmer, opt-in anonymized upload, GPS jitter 100m for borewell points
- No PII stored, block_id only

### 8. Offline-First Design
- Workbox Service Worker precaches app shell + class pack (if e-learning integrated) + map tiles z12-16
- SQLite via sql.js for advisory history, borewell recommendations, progress
- AppSync offline mutations queued, delta sync when online
- Amplify Auth offline support

### 9. Cost Optimization
- $0 imagery via S3 Open Data + STAC range requests (90% egress saved)
- Free Tier: Lambda 1M requests, Timestream 100GB ingested, DynamoDB 25GB, S3 5GB, CloudFront 1TB, Amplify 1000 build minutes
- VP9 480p if video, WebP tiles for maps, LRU cache
- Post Free Tier: <$15/mo for 100+ blocks (Lambda $5, Timestream $4, DynamoDB $2, S3 $1, CloudFront $2)

### 10. Scalability
- Add new blocks via GeoJSON upload S3 -> Lambda auto-ingests (S3 event trigger)
- Borewell model retrain via SageMaker Pipeline when new CGWB data arrives
- Replace Random Forest with XGBoost if >2000 points
- Add groundwater level prediction LSTM on CGWB time series

### 11. Visual Design References
- Figure 1: End-to-end pipeline (GeoJSON -> Sentinel-2 -> NDVI -> Timestream -> Threshold -> Farmer App)
- Figure 2: NDVI computation (B04 Red + B08 NIR -> NDVI formula -> Vegetation Health)
- Figure 3: Decision logic diamond flowchart (Rain, NDVI Slope, NDVI sustained -> Sowing Window)
- Figure 4: AWS architecture 3-layer (Data, Compute, Delivery)
- Figure 5: NDVI time series chart (Sowing Window green, Harvest Ready blue, Water Stress yellow)
- Figure 6: Borewell suitability workflow (8 inputs -> MCDA + Random Forest -> 4-class map)
- Figure 7: Live GIS Dashboard mockup with legend & insights, minimaps, blips, pointers
- Figure 8: Integrated overlay map with NDVI + borewell zones + pointers + legend

### 12. Future Enhancements
- Add groundwater level LSTM prediction
- Add crop disease detection (Project 2) as overlay on same map (disease heatmap)
- Add e-learning (Project 3) offline PWA for same villages
- Add WhatsApp bot for advisories in Telugu
