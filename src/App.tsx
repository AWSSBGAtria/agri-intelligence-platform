import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import MapView from './components/MapView'
import LegendPanel from './components/LegendPanel'
import AdvisoryStrip from './components/AdvisoryStrip'
import { sites, type SiteId } from './data/sites'

export default function App(){
  const [siteId, setSiteId] = useState<SiteId>('chittoor')
  const site = sites[siteId]
  const [layers,setLayers]=useState({ satellite:true, ndvi:true, borewell:true, rainfall:false, grid:true })
  const [selected,setSelected]=useState<string | null>(site.blocks[0].id)
  const [online,setOnline]=useState(true)

  useEffect(()=>{ setSelected(site.blocks[0].id) },[siteId])

  const toggle=(k: keyof typeof layers)=> setLayers(s=>({...s,[k]:!s[k]}))
  const onExport=()=>{
    setOnline(false); setTimeout(()=>setOnline(true),1200)
    const blob = new Blob([JSON.stringify({site: siteId, bbox: site.bbox, layers, selected, time:new Date().toISOString()},null,2)],{type:'application/json'})
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${siteId}-map-export.json`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col">
      {/* direction contract - impeccable */}
      {/* THESIS: Live GIS is the product — map IS the interface, legend IS the proof. No hero, no cards-as-structure. */}
      {/* OWN-WORLD: Indigo #4F46E5 + Ink #111827 + paper #F9FAFB, Inter 400-800, Mono 7.8pt formulae, light-indigo #EEF2FF, dark-ink legend 400px, pulsing blips & drift pins */}
      {/* STORY: Analyst/farmer toggles Chittoor/GKVK, hovers any pin/polygon for instant explainer, taps 30ac block for advisory — zero learning curve */}
      {/* FIRST VIEWPORT: Spacious header with site pill (Chittoor/GKVK) + airy 16px paddings + full-bleed map with hover tooltips everywhere, right 400px legend */}
      {/* FORM: Operate — dashboard/control-room, seed impeccable-operate-dashboard */}
      {/* FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md */}

      <TopBar site={siteId} onSiteChange={setSiteId} layers={layers} toggle={toggle} online={online} onExport={onExport} />

      {/* site context bar — adds breathing room + clarity */}
      <div className="mx-4 sm:mx-6 mt-4 rounded-2xl bg-white border border-[#E5E7EB] px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="text-xs font-extrabold tracking-[0.08em] text-[#4F46E5]">{site.id==='gkvk' ? 'GKVK CAMPUS • UAS BANGALORE' : 'CHITTOOR • GUDUR MANDAL'}</div>
          <div className="text-sm font-bold text-[#111827] mt-0.5">{site.fullName} • {site.meta.area} • {site.meta.elevation} • {site.meta.zone}</div>
          <div className="text-xs text-[#6B7280] mt-1">{site.meta.soil} • {site.meta.rainfallNote}</div>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-3 py-1.5 rounded-full bg-[#111827] text-white font-bold">{site.blocks.length} blocks</span>
          <span className="px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold">{site.blocks.filter(b=>b.signal==='Green').length} sowing</span>
          <span className="px-3 py-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] font-bold">{site.blips.length} stress</span>
        </div>
      </div>

      <main className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-start gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8">
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          <AdvisoryStrip site={site} selected={selected} />

          <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-white">
            <MapView site={site} layers={layers} onBlockSelect={setSelected} selected={selected} />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur rounded-full border border-[#E5E7EB] px-4 py-2 shadow">
              <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-bold text-[#111827]">Workbox precache • z12–16 • &lt;200 MB • 3G &lt;3s</span>
              <span className="h-4 w-px bg-[#E5E7EB]" />
              <span className="text-[11px] text-[#6B7280]">Hover markers for explainers • Offline Sentinel-2 + SRTM hillshade</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-2">
            {[
              {k:'Sowing timing vs recall', v:'+18%', sub:'Green windows flagged', color:'text-[#16A34A]'},
              {k:'Water stress lead time', v:'5–7 days', sub:'before visual wilt', color:'text-[#DC2626]'},
              {k:'Borewell success', v:'88%', sub:'was 60% • Rs 30k saved/failure', color:'text-[#4F46E5]'},
              {k:'Latency', v:'<6 h', sub:'after Sentinel-2 4 AM UTC', color:'text-[#111827]'},
            ].map(m=>(
              <div key={m.k} className="rounded-2xl bg-white border border-[#E5E7EB] p-4 sm:p-5 flex flex-col shadow-sm">
                <div className="text-[11px] font-semibold text-[#6B7280] tracking-wide leading-none">{m.k}</div>
                <div className={`text-xl font-extrabold leading-none mt-2 ${m.color}`}>{m.v}</div>
                <div className="text-[11px] text-[#6B7280] mt-1.5 leading-snug">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <details className="rounded-3xl overflow-hidden border border-[#1F2937] bg-[#111827] text-white shadow-sm">
            <summary className="list-none px-5 py-4 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-extrabold tracking-[0.08em]">LEGEND & INSIGHTS</span>
              <span className="text-xs bg-white text-[#111827] rounded-full px-3 py-1 font-bold">Open</span>
            </summary>
            <div className="max-h-[70vh] overflow-y-auto">
              <LegendPanel site={site} selected={selected} onSelect={setSelected} />
            </div>
          </details>
        </div>
        <div className="hidden lg:flex lg:w-[380px] lg:h-[min(720px,calc(100vh-220px))] rounded-3xl overflow-hidden border border-[#1F2937] shadow-sm">
          <LegendPanel site={site} selected={selected} onSelect={setSelected} />
        </div>
      </main>

      <footer className="mt-4 border-t border-[#E5E7EB] bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6B7280]">
        <span>© 2026 Agri-Intelligence • Atria Community Day 3 • AWS Student Builder Group • Free Tier-first • Offline-resilient • Hover tooltips on every marker</span>
        <span className="font-mono">EPSG:4326 • {site.id==='gkvk' ? 'GKVK 13.082°N 77.576°E' : 'Gudur 13.217°N 79.100°E'} • &lt;$15/mo post Free Tier</span>
      </footer>
    </div>
  )
}
