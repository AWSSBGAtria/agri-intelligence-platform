import { useState } from 'react'
import TopBar from './components/TopBar'
import MapView from './components/MapView'
import LegendPanel from './components/LegendPanel'
import AdvisoryStrip from './components/AdvisoryStrip'


export default function App(){
  const [layers,setLayers]=useState({ satellite:true, ndvi:true, borewell:true, rainfall:false, grid:true })
  const [selected,setSelected]=useState<string | null>('CHT-01')
  const [online,setOnline]=useState(true)
  const toggle=(k: keyof typeof layers)=> setLayers(s=>({...s,[k]:!s[k]}))
  const onExport=()=>{
    setOnline(false); setTimeout(()=>setOnline(true),1200)
    // simple export mock
    const blob = new Blob([JSON.stringify({bbox:[78.9,13.0,79.3,13.4], layers, selected, time:new Date().toISOString()},null,2)],{type:'application/json'})
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='chittoor-map-export.json'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col">
      {/* direction contract - impeccable */}
      {/* THESIS: Live GIS is the product — map IS the interface, legend IS the proof. No hero, no cards-as-structure. */}
      {/* OWN-WORLD: Indigo #4F46E5 + Ink #111827 + paper #F9FAFB, Inter, 9.5pt justified body, light-indigo #EEF2FF formula boxes, dark-ink legend, pulsing blue blips & green pins */}
      {/* STORY: Analyst/farmer opens to live 450-acre dashboard, toggles satellite/NDVI/borewell, taps 30-ac blocks for sowing/harvest/stress advisories */}
      {/* FIRST VIEWPORT: Top indigo hairline + layer toggles, full-bleed ESRI satellite with green polygons & NDVI heat & blips, right dark legend with 4-class borewell + indicators */}
      {/* FORM: Operate — dashboard/control-room, seed impeccable-operate-dashboard */}
      {/* FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md */}

      <TopBar layers={layers} toggle={toggle} online={online} onExport={onExport} activeBlips={3} />

      {/* secondary meta bar */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[#EEF2FF] border-b border-[#C7D2FE] text-[11px]">
        <span className="font-bold text-[#3730A3]">DATA PIPELINE</span>
        <span className="text-[#6B7280]">S3 Open Data (Sentinel-2 L2A COGs) → STAC Element84 (cloud&lt;20%) → Lambda rasterio/SCL → Timestream → DynamoDB → SNS/AppSync → Leaflet PWA</span>
        <span className="ml-auto inline-flex items-center gap-2">
          <span className="px-2 py-1 rounded-full bg-white border border-[#C7D2FE] font-bold text-[#4F46E5]">ROC AUC 0.87 • RF 100 trees</span>
          <span className="px-2 py-1 rounded-full bg-[#4F46E5] text-white font-bold">8-factor MCDA</span>
        </span>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* map column */}
        <div className="flex-1 flex flex-col min-h-[520px] lg:min-h-0">
          <div className="px-3 sm:px-4 pt-3">
            <AdvisoryStrip selected={selected} />
          </div>

          <div className="flex-1 relative mt-3 mx-3 sm:mx-4 mb-3 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-white">
            <MapView layers={layers} onBlockSelect={setSelected} selected={selected} />

            {/* offline simulation badge */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur rounded-full border border-[#E5E7EB] px-3 py-1.5 shadow">
              <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-bold text-[#111827]">Workbox precache • tiles z12–16 • &lt;200 MB • 3G &lt;3s</span>
              <span className="h-4 w-px bg-[#E5E7EB]" />
              <span className="text-[11px] text-[#6B7280]">Offline simulation: Sentinel-2 true color + SRTM hillshade</span>
            </div>
          </div>

          {/* bottom metrics strip */}
          <div className="mx-3 sm:mx-4 mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              {k:'Sowing timing vs recall', v:'+18%', sub:'Green windows flagged', color:'text-[#16A34A]'},
              {k:'Water stress lead time', v:'5–7 days', sub:'before visual wilt', color:'text-[#DC2626]'},
              {k:'Borewell success', v:'88%', sub:'was 60% • Rs 30k saved/failure', color:'text-[#4F46E5]'},
              {k:'Latency', v:'<6 h', sub:'after Sentinel-2 overpass 4 AM UTC', color:'text-[#111827]'},
            ].map(m=>(
              <div key={m.k} className="rounded-2xl bg-white border border-[#E5E7EB] p-3 flex flex-col">
                <div className="text-[11px] font-semibold text-[#6B7280] leading-none">{m.k}</div>
                <div className={`text-lg font-extrabold leading-none mt-1 ${m.color}`}>{m.v}</div>
                <div className="text-[11px] text-[#6B7280] mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* legend — drawer on mobile, side panel on desktop */}
        <div className="lg:hidden px-3 pb-4">
          <details className="rounded-2xl overflow-hidden border border-[#1F2937] bg-[#111827] text-white">
            <summary className="list-none px-4 py-3 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-extrabold tracking-[0.08em]">LEGEND & INSIGHTS</span>
              <span className="text-xs bg-white text-[#111827] rounded-full px-2 py-1 font-bold">Open</span>
            </summary>
            <div className="max-h-[70vh] overflow-y-auto">
              <LegendPanel selected={selected} onSelect={setSelected} />
            </div>
          </details>
        </div>
        <div className="hidden lg:flex">
          <LegendPanel selected={selected} onSelect={setSelected} />
        </div>
      </main>

      {/* footer */}
      <footer className="border-t border-[#E5E7EB] bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6B7280]">
        <span>© 2026 Agri-Intelligence • Atria Community Day 3 • AWS Student Builder Group • Free Tier-first • Offline-resilient • PWA + SQLite + Workbox</span>
        <span className="font-mono">EPSG:4326 • 450 acres pilot → 500+ blocks same cost • &lt;$15/mo post Free Tier</span>
      </footer>
    </div>
  )
}
