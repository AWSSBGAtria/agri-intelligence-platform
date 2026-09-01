# PLAN.md - Remote Geographical / Agri-Intelligence Platform
## Project Chittoor | Atria Community Day 3 | AWS Student Builder Group

### 1. Overview
Build corporate-grade, offline-resilient, Free Tier-first platform delivering daily 6 AM block-level advisories (30-acre polygons, Chittoor), soil moisture NDMI, NDVI/NDWI, rainfall forecast, sowing/harvest windows, borewell suitability prediction (4-class raster), live geographical view with minimaps, blips, pointers, comprehensive legend.

### 2. Tech Stack
| Layer | Service | Purpose | Cost |
|-------|---------|---------|------|
| Imagery | S3 Open Data Registry s3://sentinel-s2-l2a, SRTM DEM | Sentinel-2 L2A COGs, DEM 30m | 0 |
| STAC | Element84 Earth Search | Catalog query cloud<20% | Free |
| Compute | Lambda Python 3.11 rasterio numpy rasterstats | NDVI/NDMI/NDWI, cloud mask SCL, zonal mean | Free Tier |
| Time Series | Timestream | time, block_id, ndvi, ndmi, rainfall | 1yr memory |
| Metadata | DynamoDB | Blocks GeoJSON, advisory logs, borewell points | On-demand |
| Borewell ML | SageMaker Lab + scikit-learn | Random Forest 523 points, MCDA weighted overlay | Free |
| Hydro | Bhuvan Lithology Geomorphology, OSM Drainage, SRTM Slope | 8-factor inputs | Free |
| Alerts | SNS + Amplify Push | PWA push SMS WhatsApp | Free |
| API | API Gateway + AppSync GraphQL | Advisory subscriptions | Free |
| Hosting | Amplify + CloudFront | PWA edge cache | Free |
| Auth | Cognito | JWT 7-day offline | 50k MAU free |
| Dashboard | QuickSight + React + Leaflet MapLibre | Live GIS minimaps blips pointers | Free |
| Maps | OSM ESRI Satellite Sentinel-2 True Color | Base layers offline cache Workbox | Free |

### 3. Architecture
Data Layer (S3 Open Data + Bhuvan + OSM) -> Compute Layer (Lambda + Timestream + DynamoDB + SageMaker) -> Delivery Layer (API Gateway + AppSync + SNS + QuickSight + Leaflet PWA)

### 4. Implementation Phases

#### Phase 0 Setup Week 1
- AWS Org IAM S3 buckets agri-raw agri-processed dem-cache
- GeoJSON Chittoor 30-acre blocks 15 pilot GKVK 5 blocks
- Download CGWB borewell data 523 points Bhuvan lithology SRTM DEM Chittoor bbox
- Repo chittoor-agri-intelligence main dev infra CDK Python

#### Phase 1 Core Agri MVP Week 2-4
- Lambda stac-query Element84 cloud<20% bbox date return S3 keys
- Lambda process-scene range request B04 B08 B11 B03 SCL compute NDVI NDMI NDWI cloud mask SCL 3 8 9 zonal mean rasterstats write Timestream
- Lambda rainfall-ingest Open-Meteo 7-day CHIRPS history write Timestream
- Lambda threshold-engine evaluate Sowing 5-day rain>20mm AND NDVI slope>0.02/day x3 AND 0.2->0.3 sustained 7-10d Harvest NDVI peak>0.6-><0.35 after 30d Water Stress NDMI<0.1 AND NDVI drop>0.15 in 7d write DynamoDB publish SNS
- EventBridge cron daily 4 AM UTC latency <6h after Sentinel-2 overpass
- QuickSight map 5 GKVK blocks validation ground NDVI GreenSeeker

#### Phase 2 Borewell Prediction Week 3-5 Optional
- Data prep SRTM DEM slope gdaldem drainage density OSM Overpass line density lineament Bhuvan lithology geomorphology rasterize NDVI NDWI mean annual rainfall mean annual elevation
- Normalize 0-1 AHP weights Slope 18% Drainage 20% Lineament 16% Lithology 14% Geomorphology 10% NDVI 8% Rainfall 8% Elevation 6%
- MCDA weighted overlay suitability = sum(weight * normalized_factor)
- Random Forest features 8 factors target borewell success 1 failure 0 523 points 80/20 split 100 trees max_depth 10 ROC AUC 0.87 accuracy 82%
- Output raster 4 classes Excellent >0.75 Green Good 0.6-0.75 Light Green Moderate 0.4-0.6 Yellow Poor <0.4 Red
- Lambda borewell-predict on-demand bbox MCDA + RF inference COG to S3 recommended points centroids Excellent zones slope<8% drainage moderate DynamoDB depth 45-60m based on lithology
- Validation field visit GKVK with geologist 5 test drills

#### Phase 3 Live Geo View Dashboard Week 5-7
- Frontend React Leaflet free MapLibre base layers OSM ESRI Satellite Sentinel-2 True Color via s3 mosaic offline cache Workbox precache tiles Chittoor bbox z12-16
- Features: 30-acre polygon grids green stroke transparent fill, NDVI heatmap raster tiles color ramp yellow->dark green, borewell suitability hatched polygons colors per class, existing borewells blue icons, recommended borewell sites green pins depth label 45-60m pulsing, water stress blips pulsing blue dots ripple tooltip Soil Moisture Low 3 active, rainfall isohyet lines CHIRPS, minimaps bottom left zoomed inset Gudur Mandal 1km scale red box main map extent, scale bar 500m coordinates Lat 13.217N Lon 79.100E CRS WGS84 EPSG:4326 north arrow
- Right panel Legend: Borewell Recommendation Green Excellent 2 Sites Light Green Good 1 Site Yellow Moderate 3 Sites Red Poor 2 Sites, Map Layers Key Blue Blip Water Stress 3 Active Green Polygon Sowing Window 8 Fields Active, Indicators Rainfall 12.4mm/24h Light NDVI Avg 0.62 Healthy Borewell 4 Recommended Sites, Summary Metrics Total 450 acres Avg Soil Moisture 28% Low Weather 28C 65% RH Alert 3 locations critical water stress Recommend immediate irrigation
- Layer toggles Satellite NDVI Borewell Rainfall
- Offline simulation mode pre-downloaded Sentinel-2 true color + SRTM hillshade
- Performance tile cache <200MB initial load <3s on 3G

#### Phase 4 Farmer PWA Integration Week 6-8
- Unified Farmer App Home advisory card Green Amber Red + Map button live geo view
- Offline SQLite sql.js advisory history borewell recommendations
- SNS push sowing harvest water stress alerts

#### Phase 5 Field Pilot Week 9-11
- GKVK pilot 5 blocks 5 borewell sites validate NDVI ground truth handheld GreenSeeker validate borewell predictions geologist feedback
- Chittoor pilot 2 villages Gudur Mandal 10 blocks 4 borewell recommendations 1 day field visit
- Metrics sowing timing improvement vs recall water stress early detection days borewell success rate

#### Phase 6 Community Day Demo Week 12
- Final demo Live GIS dashboard minimaps blips pointers legend borewell workflow diagram
- Handover docs PLAN.md detailed PDF API docs runbook
- Training Trust staff add new GeoJSON blocks trigger Lambda manually interpret legend

### 5. Results Targets
- 15-20% improvement sowing timing vs recall
- Water stress flagged 5-7 days before visual wilt
- Borewell success 60% -> 88% 40% drilling cost reduction Rs 30k saved per avoided failure
- Latency <6h after Sentinel-2 overpass
- $0 imagery cost <$15/month post Free Tier 100+ blocks
- 450 acres monitored pilot scales 500+ blocks same cost

### 6. Scalability
- Add new blocks via GeoJSON upload S3 Lambda auto-ingests
- Replace Random Forest with XGBoost later more data
- Add groundwater level prediction LSTM CGWB time series
- Student builders maintain via CDK GitHub Actions CI/CD Amplify

### 7. Risk Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloud cover monsoon blocks Sentinel-2 | High | Use Sentinel-1 SAR soil moisture proxy Landsat 8/9 gap fill |
| SRTM DEM 30m coarse slope | Medium | Use ALOS PALSAR 12.5m DEM if available field validation |
| Borewell false positive | High | Geologist review only Excellent+Good depth conservative |
| Offline tile cache >200MB | Medium | Limit zoom 16 WebP tiles LRU cache |
| Free Tier Lambda 10min | Medium | Split per block 1024MB Fargate if needed |

### 8. Timeline
Week 1 Setup
Week 2-4 Agri MVP
Week 3-5 Borewell Prediction
Week 5-7 Live Geo View Dashboard
Week 6-8 Farmer PWA Integration
Week 9-11 Field Pilot GKVK -> Chittoor
Week 12 Demo Day

### 9. Next Steps
- Finalize GeoJSONs Chittoor 30-acre blocks
- Setup AWS Builder account Atria
- 1-day field visit GKVK DEM validation + borewell points collection
- Assign sub-teams Data 2 Backend Lambda 2 ML Borewell 1 Frontend Map 2 QA 1
- Share PLAN.md + detailed PDF with Dean and Akshaan

### 10. References
- Sentinel-2 L2A Open Data Registry CHIRPS Open-Meteo SRTM Bhuvan OSM Overpass CGWB
- Leaflet MapLibre Workbox Timestream DynamoDB SNS QuickSight
