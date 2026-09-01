import type { SuitabilityClass } from '../lib/agriEngine'

// GKVK Campus — 13.082°N 77.576°E, EL 930m, Red loamy / lateritic sandy clay loam, Eastern Dry Zone 5
// bbox ~ 77.56-77.60, 13.06-13.10 — UAS Bangalore research farm, ZARS dryland plots, IFS demo
export const gkvkBlocks = [
  { id:'GKVK-01', village:'Yelahanka', mandal:'Bangalore North', acres:30, soil:'Red Sandy Loam', ndvi:0.48, ndmi:0.22, rainfall24h:6.8, signal:'Green' as const, type:'Sowing Window', polygon:[[13.095,77.565],[13.095,77.578],[13.085,77.578],[13.085,77.565]] as [number,number][], center:[13.090,77.571] as [number,number] },
  { id:'GKVK-02', village:'Yelahanka', mandal:'Bangalore North', acres:30, soil:'Lateritic Red Sandy Clay Loam', ndvi:0.32, ndmi:0.09, rainfall24h:2.1, signal:'Red' as const, type:'Water Stress', polygon:[[13.095,77.578],[13.095,77.591],[13.085,77.591],[13.085,77.578]] as [number,number][], center:[13.090,77.584] as [number,number] },
  { id:'GKVK-03', village:'GKVK Campus', mandal:'Bangalore North', acres:30, soil:'Red Loamy (Vijayapura series)', ndvi:0.66, ndmi:0.38, rainfall24h:11.2, signal:'Green' as const, type:'Sowing Window', polygon:[[13.085,77.565],[13.085,77.578],[13.075,77.578],[13.075,77.565]] as [number,number][], center:[13.080,77.571] as [number,number] },
  { id:'GKVK-04', village:'GKVK Campus', mandal:'Bangalore North', acres:30, soil:'Red Sandy Loam (IFS Block L)', ndvi:0.29, ndmi:0.07, rainfall24h:1.4, signal:'Red' as const, type:'Water Stress', polygon:[[13.085,77.578],[13.085,77.591],[13.075,77.591],[13.075,77.578]] as [number,number][], center:[13.080,77.584] as [number,number] },
  { id:'GKVK-05', village:'Hebbal', mandal:'Bangalore North', acres:30, soil:'Red Loam', ndvi:0.41, ndmi:0.18, rainfall24h:5.4, signal:'Amber' as const, type:'Watch', polygon:[[13.075,77.565],[13.075,77.578],[13.065,77.578],[13.065,77.565]] as [number,number][], center:[13.070,77.571] as [number,number] },
  { id:'GKVK-06', village:'Hebbal', mandal:'Bangalore North', acres:30, soil:'Alluvial (tankfed)', ndvi:0.59, ndmi:0.31, rainfall24h:9.6, signal:'Green' as const, type:'Sowing Window', polygon:[[13.075,77.578],[13.075,77.591],[13.065,77.591],[13.065,77.578]] as [number,number][], center:[13.070,77.584] as [number,number] },
  { id:'GKVK-07', village:'Sahakara Nagar', mandal:'Bangalore North', acres:30, soil:'Laterite', ndvi:0.53, ndmi:0.27, rainfall24h:8.1, signal:'Green' as const, type:'Sowing Window', polygon:[[13.095,77.591],[13.095,77.604],[13.085,77.604],[13.085,77.591]] as [number,number][], center:[13.090,77.597] as [number,number] },
  { id:'GKVK-08', village:'Sahakara Nagar', mandal:'Bangalore North', acres:30, soil:'Red Sandy Loam', ndvi:0.36, ndmi:0.12, rainfall24h:3.2, signal:'Amber' as const, type:'Watch', polygon:[[13.085,77.591],[13.085,77.604],[13.075,77.604],[13.075,77.591]] as [number,number][], center:[13.080,77.597] as [number,number] },
  { id:'GKVK-09', village:'Yelahanka', mandal:'Bangalore North', acres:28, soil:'Compartment bund trial', ndvi:0.61, ndmi:0.34, rainfall24h:10.4, signal:'Blue' as const, type:'Harvest Ready', polygon:[[13.065,77.565],[13.065,77.578],[13.055,77.578],[13.055,77.565]] as [number,number][], center:[13.060,77.571] as [number,number] },
  { id:'GKVK-10', village:'GKVK Campus', mandal:'Bangalore North', acres:30, soil:'Red Loam (Dryland AICRP)', ndvi:0.44, ndmi:0.19, rainfall24h:6.1, signal:'Green' as const, type:'Sowing Window', polygon:[[13.065,77.578],[13.065,77.591],[13.055,77.591],[13.055,77.578]] as [number,number][], center:[13.060,77.584] as [number,number] },
]

export const gkvkExistingBorewells: {lat:number, lon:number, depth:string, status:'Success'|'Failure', lps?: string}[] = [
  // from GKVK study: 9 borewells BW1-9 with recharge, ~930m AMSL, ZARS
  { lat:13.088, lon:77.571, depth:'48 m', status:'Success', lps:'2.8 lps' },
  { lat:13.082, lon:77.579, depth:'52 m', status:'Success', lps:'2.4 lps' },
  { lat:13.076, lon:77.574, depth:'61 m', status:'Failure', lps:'0.3 lps' },
  { lat:13.084, lon:77.588, depth:'46 m', status:'Success', lps:'3.2 lps' },
  { lat:13.069, lon:77.586, depth:'55 m', status:'Success', lps:'2.6 lps' },
]

export const gkvkRecommended: {id:string, lat:number, lon:number, cls:SuitabilityClass, score:number, depth:string, lithology:string, slope:number, village:string}[] = [
  { id:'GKVK-BW-01', lat:13.091, lon:77.572, cls:'Excellent', score:0.84, depth:'42–48 m', lithology:'Alluvium / Tank recharge', slope:1.8, village:'Yelahanka' },
  { id:'GKVK-BW-02', lat:13.079, lon:77.576, cls:'Excellent', score:0.81, depth:'44–48 m', lithology:'Red loamy — compartment bund', slope:2.1, village:'GKVK Campus' },
  { id:'GKVK-BW-03', lat:13.071, lon:77.584, cls:'Good', score:0.67, depth:'52–58 m', lithology:'Lateritic sandy clay loam', slope:3.4, village:'Hebbal' },
  { id:'GKVK-BW-04', lat:13.086, lon:77.595, cls:'Moderate', score:0.49, depth:'55–60 m', lithology:'Granite gneiss', slope:6.2, village:'Sahakara Nagar' },
  { id:'GKVK-BW-05', lat:13.061, lon:77.572, cls:'Moderate', score:0.46, depth:'50–55 m', lithology:'Vijayapura series', slope:5.8, village:'Yelahanka' },
  { id:'GKVK-BW-06', lat:13.059, lon:77.586, cls:'Poor', score:0.31, depth:'60–70 m', lithology:'Hard rock / quartzite ridge', slope:11.5, village:'Yelahanka' },
]

export const gkvkWaterBlips = [
  { lat:13.090, lon:77.584, label:'Soil Moisture Low — WSN 26% FC', block:'GKVK-02' },
  { lat:13.080, lon:77.584, label:'Soil Moisture Low — Drip trial', block:'GKVK-04' },
]

export const gkvkIsohyets: [number,number][][] = [
  [[13.098,77.565],[13.090,77.578],[13.082,77.585],[13.070,77.582]],
  [[13.098,77.585],[13.090,77.595],[13.080,77.598],[13.068,77.595]],
]

export const gkvkSiteMeta = {
  id: 'gkvk' as const,
  name: 'GKVK • Bangalore',
  fullName: 'Gandhi Krishi Vigyan Kendra • UAS Bangalore',
  bbox: [77.56, 13.055, 77.605, 13.098] as [number,number,number,number],
  center: [13.082, 77.576] as [number,number],
  zoom: 14,
  elevation: '930 m AMSL',
  zone: 'Eastern Dry Zone 5',
  soil: 'Red loamy • Vijayapura series • lateritic sandy clay loam',
  areaHa: '559 ha research farm',
  rainfallNote: 'CHIRPS 0.05° + Open-Meteo • compartment bunding trial',
}
