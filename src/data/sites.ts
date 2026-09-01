import { blocks as chBlocks, existingBorewells as chExisting, recommended as chRec, waterStressBlips as chBlips, rainfallIsohyets as chIso } from './mockData'
import { gkvkBlocks, gkvkExistingBorewells, gkvkRecommended, gkvkWaterBlips, gkvkIsohyets, gkvkSiteMeta } from './gkvkMock'

export type SiteId = 'chittoor' | 'gkvk'

export interface SiteConfig {
  id: SiteId
  name: string
  fullName: string
  bbox: [number,number,number,number]
  center: [number,number]
  zoom: number
  blocks: typeof chBlocks
  existing: typeof chExisting
  recommended: typeof chRec
  blips: typeof chBlips
  isohyets: typeof chIso
  meta: { elevation: string; zone: string; soil: string; area: string; rainfallNote: string; latLon: string }
}

export const sites: Record<SiteId, SiteConfig> = {
  chittoor: {
    id: 'chittoor',
    name: 'Chittoor • Gudur',
    fullName: 'Gudur Mandal • Chittoor • AP',
    bbox: [78.9, 13.0, 79.3, 13.4],
    center: [13.217, 79.100],
    zoom: 13,
    blocks: chBlocks,
    existing: chExisting,
    recommended: chRec,
    blips: chBlips,
    isohyets: chIso,
    meta: { elevation: '350–420 m AMSL', zone: 'Rayalaseema semi-arid', soil: 'Red Sandy Loam • Black Clay • Alluvial', area: '450 acres • 15 blocks × 30 ac', rainfallNote: 'CHIRPS 0.05° + Open-Meteo 7-day', latLon: '13.217°N 79.100°E' },
  },
  gkvk: {
    id: 'gkvk',
    name: gkvkSiteMeta.name,
    fullName: gkvkSiteMeta.fullName,
    bbox: gkvkSiteMeta.bbox,
    center: gkvkSiteMeta.center as [number,number],
    zoom: gkvkSiteMeta.zoom,
    blocks: gkvkBlocks as any,
    existing: gkvkExistingBorewells as any,
    recommended: gkvkRecommended as any,
    blips: gkvkWaterBlips as any,
    isohyets: gkvkIsohyets as any,
    meta: { elevation: gkvkSiteMeta.elevation, zone: gkvkSiteMeta.zone, soil: gkvkSiteMeta.soil, area: gkvkSiteMeta.areaHa + ' • 10 blocks', rainfallNote: gkvkSiteMeta.rainfallNote, latLon: '13.082°N 77.576°E' },
  },
}
