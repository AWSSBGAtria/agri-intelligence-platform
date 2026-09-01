import type { SuitabilityClass } from '../lib/agriEngine'

// Chittoor bbox 78.9,13.0,79.3,13.4 — Gudur Mandal focused 79.05-79.15, 13.18-13.26
export interface Block {
  id: string
  village: string
  mandal: string
  acres: number
  soil: string
  ndvi: number
  ndmi: number
  rainfall24h: number
  signal: 'Green' | 'Amber' | 'Red' | 'Blue' | 'Gray'
  type: string
  polygon: [number, number][] // [lat, lng]
  center: [number, number]
}

export const blocks: Block[] = [
  { id:'CHT-01', village:'Gudur', mandal:'Gudur', acres:30, soil:'Red Sandy Loam', ndvi:0.62, ndmi:0.34, rainfall24h:12.4, signal:'Green', type:'Sowing Window', polygon:[[13.235,79.07],[13.235,79.09],[13.22,79.09],[13.22,79.07]], center:[13.227,79.08] },
  { id:'CHT-02', village:'Gudur', mandal:'Gudur', acres:30, soil:'Red Loam', ndvi:0.28, ndmi:0.08, rainfall24h:4.2, signal:'Red', type:'Water Stress', polygon:[[13.235,79.09],[13.235,79.11],[13.22,79.11],[13.22,79.09]], center:[13.227,79.10] },
  { id:'CHT-03', village:'Gudur', mandal:'Gudur', acres:30, soil:'Black Clay', ndvi:0.58, ndmi:0.31, rainfall24h:10.1, signal:'Green', type:'Sowing Window', polygon:[[13.235,79.11],[13.235,79.13],[13.22,79.13],[13.22,79.11]], center:[13.227,79.12] },
  { id:'CHT-04', village:'Gudur', mandal:'Gudur', acres:30, soil:'Sandy Loam', ndvi:0.34, ndmi:0.09, rainfall24h:2.8, signal:'Red', type:'Water Stress', polygon:[[13.22,79.07],[13.22,79.09],[13.205,79.09],[13.205,79.07]], center:[13.212,79.08] },
  { id:'CHT-05', village:'Gudur', mandal:'Gudur', acres:30, soil:'Red Sandy Loam', ndvi:0.71, ndmi:0.42, rainfall24h:14.2, signal:'Blue', type:'Harvest Ready', polygon:[[13.22,79.09],[13.22,79.11],[13.205,79.11],[13.205,79.09]], center:[13.212,79.10] },
  { id:'CHT-06', village:'Gudur', mandal:'Gudur', acres:30, soil:'Alluvial', ndvi:0.41, ndmi:0.18, rainfall24h:6.0, signal:'Amber', type:'Watch', polygon:[[13.22,79.11],[13.22,79.13],[13.205,79.13],[13.205,79.11]], center:[13.212,79.12] },
  { id:'CHT-07', village:'Gudur', mandal:'Gudur', acres:30, soil:'Red Loam', ndvi:0.26, ndmi:0.07, rainfall24h:1.9, signal:'Red', type:'Water Stress', polygon:[[13.205,79.07],[13.205,79.09],[13.19,79.09],[13.19,79.07]], center:[13.197,79.08] },
  { id:'CHT-08', village:'Gudur', mandal:'Gudur', acres:30, soil:'Laterite', ndvi:0.63, ndmi:0.36, rainfall24h:11.8, signal:'Green', type:'Sowing Window', polygon:[[13.205,79.09],[13.205,79.11],[13.19,79.11],[13.19,79.09]], center:[13.197,79.10] },
  // additional to reach 15 pilots
  { id:'CHT-09', village:'Pileru', mandal:'Pileru', acres:30, soil:'Red Sandy', ndvi:0.55, ndmi:0.29, rainfall24h:9.2, signal:'Green', type:'Sowing Window', polygon:[[13.19,79.07],[13.19,79.085],[13.175,79.085],[13.175,79.07]], center:[13.182,79.077] },
  { id:'CHT-10', village:'Pileru', mandal:'Pileru', acres:30, soil:'Black Cotton', ndvi:0.38, ndmi:0.14, rainfall24h:5.1, signal:'Gray', type:'Normal', polygon:[[13.19,79.085],[13.19,79.10],[13.175,79.10],[13.175,79.085]], center:[13.182,79.092] },
  { id:'CHT-11', village:'Tirupati', mandal:'Tirupati', acres:30, soil:'Red Loam', ndvi:0.46, ndmi:0.22, rainfall24h:7.4, signal:'Green', type:'Sowing Window', polygon:[[13.175,79.09],[13.175,79.105],[13.16,79.105],[13.16,79.09]], center:[13.167,79.097] },
  { id:'CHT-12', village:'Tirupati', mandal:'Tirupati', acres:30, soil:'Sandy Loam', ndvi:0.61, ndmi:0.33, rainfall24h:11.0, signal:'Green', type:'Sowing Window', polygon:[[13.175,79.105],[13.175,79.12],[13.16,79.12],[13.16,79.105]], center:[13.167,79.112] },
  { id:'CHT-13', village:'Chittoor', mandal:'Chittoor', acres:30, soil:'Alluvial', ndvi:0.52, ndmi:0.27, rainfall24h:8.6, signal:'Green', type:'Sowing Window', polygon:[[13.255,79.12],[13.255,79.135],[13.24,79.135],[13.24,79.12]], center:[13.247,79.127] },
  { id:'CHT-14', village:'Chittoor', mandal:'Chittoor', acres:30, soil:'Red Loam', ndvi:0.31, ndmi:0.11, rainfall24h:3.3, signal:'Amber', type:'Watch', polygon:[[13.24,79.12],[13.24,79.135],[13.225,79.135],[13.225,79.12]], center:[13.232,79.127] },
  { id:'CHT-15', village:'Gudur', mandal:'Gudur', acres:30, soil:'Red Sandy Loam', ndvi:0.59, ndmi:0.30, rainfall24h:9.8, signal:'Green', type:'Sowing Window', polygon:[[13.255,79.08],[13.255,79.095],[13.24,79.095],[13.24,79.08]], center:[13.247,79.087] },
]

export interface BorewellRec {
  id: string
  lat: number
  lon: number
  cls: SuitabilityClass
  score: number
  depth: string
  lithology: string
  slope: number
  village: string
}

export const existingBorewells: {lat:number, lon:number, depth:string, status:'Success'|'Failure'}[] = [
  { lat:13.224, lon:79.082, depth:'52 m', status:'Success' },
  { lat:13.218, lon:79.105, depth:'48 m', status:'Success' },
  { lat:13.200, lon:79.088, depth:'61 m', status:'Failure' },
  { lat:13.232, lon:79.118, depth:'44 m', status:'Success' },
  { lat:13.185, lon:79.095, depth:'55 m', status:'Success' },
]

export const recommended: BorewellRec[] = [
  { id:'BW-REC-01', lat:13.228, lon:79.086, cls:'Excellent', score:0.82, depth:'45–50 m', lithology:'Alluvium', slope:3.2, village:'Gudur' },
  { id:'BW-REC-02', lat:13.214, lon:79.111, cls:'Excellent', score:0.81, depth:'45–50 m', lithology:'Alluvium', slope:4.1, village:'Gudur' },
  { id:'BW-REC-03', lat:13.198, lon:79.103, cls:'Good', score:0.68, depth:'58–62 m', lithology:'Granite Gneiss', slope:5.4, village:'Gudur' },
  { id:'BW-REC-04', lat:13.184, lon:79.082, cls:'Moderate', score:0.52, depth:'55–60 m', lithology:'Granite', slope:7.8, village:'Pileru' },
  { id:'BW-REC-05', lat:13.248, lon:79.09, cls:'Moderate', score:0.48, depth:'52–58 m', lithology:'Pediplain', slope:6.2, village:'Chittoor' },
  { id:'BW-REC-06', lat:13.232, lon:79.13, cls:'Moderate', score:0.45, depth:'50–55 m', lithology:'Granite', slope:9.1, village:'Chittoor' },
  { id:'BW-REC-07', lat:13.168, lon:79.115, cls:'Poor', score:0.32, depth:'60–70 m', lithology:'Hill / Quartzite', slope:12.4, village:'Tirupati' },
  { id:'BW-REC-08', lat:13.176, lon:79.092, cls:'Poor', score:0.28, depth:'60–70 m', lithology:'Hill', slope:14.2, village:'Pileru' },
]

export const waterStressBlips: {lat:number, lon:number, label:string, block:string}[] = [
  { lat:13.227, lon:79.102, label:'Soil Moisture Low', block:'CHT-02' },
  { lat:13.212, lon:79.082, label:'Soil Moisture Low', block:'CHT-04' },
  { lat:13.197, lon:79.082, label:'Soil Moisture Low', block:'CHT-07' },
]

export const ndviHeatmapCells: {lat:number, lon:number, ndvi:number}[] = Array.from({length: 36}, (_,i)=>{
  const r = Math.floor(i/6), c = i%6
  const lat = 13.255 - r*0.016, lon = 79.07 + c*0.011
  const ndvi = 0.22 + Math.random()*0.5
  return {lat, lon, ndvi}
})

export const timeSeries = (() => {
  const base = 0.25
  return Array.from({length:14}, (_,i)=>{
    const d = new Date('2026-07-02'); d.setDate(d.getDate()+i)
    const ndvi = base + i*0.028 + Math.sin(i*0.6)*0.04 + (i===13? -0.02:0)
    const ndmi = 0.05 + ndvi*0.45 + (i>10? -0.08:0)
    const rainfall = i===2? 18 : i===3? 9 : i===9? 14 : Math.random()*4
    return { date: d.toISOString().slice(0,10), ndvi: Number(ndvi.toFixed(2)), ndmi: Number(ndmi.toFixed(2)), rainfall: Number(rainfall.toFixed(1)) }
  })
})()

export const rainfallIsohyets: [number,number][][] = [
  [[13.26,79.07],[13.24,79.09],[13.22,79.10],[13.20,79.095],[13.18,79.08]],
  [[13.26,79.11],[13.24,79.12],[13.22,79.125],[13.20,79.12],[13.18,79.11]],
]
