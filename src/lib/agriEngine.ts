// Agri Engine — pure functions mirroring Lambda logic from PLAN/DESIGN
// No side effects, fully testable

export const ndvi = (nir: number, red: number) => (nir - red) / (nir + red)
export const ndmi = (nir: number, swir: number) => (nir - swir) / (nir + swir)
export const ndwi = (green: number, nir: number) => (green - nir) / (green + nir)

// Threshold engine types
export type Signal = 'Green' | 'Amber' | 'Red' | 'Blue' | 'Gray'
export type AdvisoryType = 'Sowing Window' | 'Harvest Ready' | 'Water Stress' | 'Watch' | 'Normal'

export interface TimePoint { date: string; ndvi: number; ndmi: number; rainfall: number }

export interface Advisory {
  signal: Signal
  type: AdvisoryType
  message_en: string
  message_te: string
}

// Sowing Rule: 5-day cum rain >20mm AND NDVI slope >0.02/day x3 AND 0.2 -> 0.3 sustained 7-10d
export function evaluateSowing(points: TimePoint[]): Advisory | null {
  if (points.length < 4) return null
  const last = points.slice(-5)
  const cumRain = last.reduce((s, p) => s + p.rainfall, 0)
  const slopes = []
  for (let i = 1; i < points.length; i++) slopes.push(points[i].ndvi - points[i-1].ndvi)
  const last3Slopes = slopes.slice(-3)
  const slopeOk = last3Slopes.every(v => v > 0.02)
  const sustained = points.slice(-3).every(p => p.ndvi >= 0.2 && p.ndvi <= 0.35) // simplified
  const startedLow = points[0].ndvi < 0.22

  if (cumRain > 20 && slopeOk && sustained && startedLow) {
    return { signal: 'Green', type: 'Sowing Window', message_en: 'Sowing optimal for groundnut', message_te: 'వేరుశనగ విత్తడానికి అనుకూలం' }
  }
  if (slopeOk && cumRain >= 10 && cumRain <= 20) {
    return { signal: 'Amber', type: 'Watch', message_en: 'Watch — pre-sowing conditions emerging', message_te: 'గమనించండి — విత్తనానికి ముందు పరిస్థితులు' }
  }
  return null
}

export function evaluateHarvest(points: TimePoint[]): Advisory | null {
  if (points.length < 6) return null
  const peak = Math.max(...points.map(p => p.ndvi))
  const last = points[points.length - 1].ndvi
  const peakIdx = points.findIndex(p => p.ndvi === peak)
  const daysAfterPeak = points.length - 1 - peakIdx
  if (peak > 0.6 && last < 0.35 && daysAfterPeak >= 4) {
    return { signal: 'Blue', type: 'Harvest Ready', message_en: 'Harvest ready — NDVI decay confirmed', message_te: 'కోతకు సిద్ధం — NDVI తగ్గింది' }
  }
  return null
}

export function evaluateWaterStress(points: TimePoint[]): Advisory | null {
  if (points.length < 2) return null
  const a = points[points.length - 2]
  const b = points[points.length - 1]
  const ndmiLow = b.ndmi < 0.1
  const drop = a.ndvi - b.ndvi > 0.15
  if (ndmiLow && drop) {
    return { signal: 'Red', type: 'Water Stress', message_en: 'Critical water stress — irrigate immediately', message_te: 'తీవ్ర నీటి ఒత్తిడి — వెంటనే నీరు పెట్టండి' }
  }
  return null
}

export function evaluateAll(points: TimePoint[]): Advisory {
  return evaluateWaterStress(points) ?? evaluateHarvest(points) ?? evaluateSowing(points) ?? { signal: 'Gray', type: 'Normal', message_en: 'Normal — no action', message_te: 'సాధారణం — చర్య అవసరం లేదు' }
}

// MCDA Borewell
export interface Factors {
  slope: number // 0-1 normalized (low slope =1)
  drainage: number
  lineament: number
  lithology: number
  geomorph: number
  ndvi: number
  rainfall: number
  elevation: number
}
export const AHP_WEIGHTS: Factors = {
  slope: 0.18, drainage: 0.20, lineament: 0.16, lithology: 0.14, geomorph: 0.10, ndvi: 0.08, rainfall: 0.08, elevation: 0.06
}
export function mcdaScore(f: Factors): number {
  return f.slope * AHP_WEIGHTS.slope + f.drainage * AHP_WEIGHTS.drainage + f.lineament * AHP_WEIGHTS.lineament + f.lithology * AHP_WEIGHTS.lithology + f.geomorph * AHP_WEIGHTS.geomorph + f.ndvi * AHP_WEIGHTS.ndvi + f.rainfall * AHP_WEIGHTS.rainfall + f.elevation * AHP_WEIGHTS.elevation
}
export type SuitabilityClass = 'Excellent' | 'Good' | 'Moderate' | 'Poor'
export function classifySuitability(score: number): SuitabilityClass {
  if (score > 0.75) return 'Excellent'
  if (score > 0.6) return 'Good'
  if (score > 0.4) return 'Moderate'
  return 'Poor'
}
export const CLASS_COLOR: Record<SuitabilityClass,string> = {
  Excellent: '#22C55E',
  Good: '#86EFAC',
  Moderate: '#FCD34D',
  Poor: '#EF4444',
}

// Mock RF inference — deterministic pseudo-RF: weighted sum + small non-linear
export function rfInference(f: Factors): number {
  const base = mcdaScore(f)
  const interaction = 0.08 * f.drainage * f.lineament + 0.05 * (1 - f.slope)
  const bounded = Math.min(0.98, Math.max(0.05, base * 0.9 + interaction + (f.lithology - 0.5) * 0.06))
  return Number(bounded.toFixed(3))
}

export function depthForLithology(lithology: string): string {
  if (lithology.toLowerCase().includes('alluv')) return '45–50 m'
  if (lithology.toLowerCase().includes('granite')) return '58–62 m'
  return '45–60 m'
}
