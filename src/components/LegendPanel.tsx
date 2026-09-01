import { AlertTriangle, Droplets, Leaf, MapPin, Layers, Activity, CloudRain, ThermometerSun } from 'lucide-react'
import { blocks, recommended, waterStressBlips } from '../data/mockData'

export default function LegendPanel({ selected, onSelect }: { selected:string|null, onSelect:(id:string)=>void }){
  const excellent = recommended.filter(r=>r.cls==='Excellent').length
  const good = recommended.filter(r=>r.cls==='Good').length
  const moderate = recommended.filter(r=>r.cls==='Moderate').length
  const poor = recommended.filter(r=>r.cls==='Poor').length
  const sowingActive = blocks.filter(b=>b.signal==='Green').length

  return (
    <aside className="w-full lg:w-[360px] shrink-0 bg-[#111827] text-white flex flex-col h-full overflow-hidden border-l border-[#1F2937]">
      {/* header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <div className="text-[11px] font-extrabold tracking-[0.14em] text-white/60">LEGEND & INSIGHTS</div>
        <div className="text-[11px] text-white/50 mt-1">Live • 6 AM IST • Sentinel-2 L2A + CHIRPS + SRTM</div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-6">
        {/* Borewell Recommendation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-[#4F46E5] grid place-items-center"><MapPin size={14} className="text-white" /></div>
            <h3 className="text-sm font-bold">Borewell Recommendation</h3>
            <span className="ml-auto text-[11px] font-bold bg-white/10 rounded-full px-2 py-0.5">{recommended.length} sites</span>
          </div>
          <div className="space-y-2">
            {[
              {color:'#22C55E', label:'Excellent Borewell', count: excellent, desc:'Alluvium • slope <5° • score >0.75'},
              {color:'#86EFAC', label:'Good', count: good, desc:'Score 0.60–0.75 • pediplain'},
              {color:'#FCD34D', label:'Moderate', count: moderate, desc:'Score 0.40–0.60 • granite'},
              {color:'#EF4444', label:'Poor', count: poor, desc:'Score <0.40 • hill / quartzite'},
            ].map(row=>(
              <div key={row.label} className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5">
                <span className="size-3 rounded-sm shrink-0" style={{background:row.color}} />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-none flex items-center gap-2">{row.label} <span className="text-[#9CA3AF] font-medium">• {row.count} {row.count===1?'Site':'Sites'}</span></div>
                  <div className="text-[11px] text-white/50 leading-tight mt-1">{row.desc}</div>
                </div>
                <span className="ml-auto size-1.5 rounded-full animate-pulse" style={{background:row.color}} />
              </div>
            ))}
          </div>
        </div>

        {/* Map Layers Key */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold tracking-[0.08em] text-white/60 flex items-center gap-2"><Layers size={14} /> MAP LAYERS KEY</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 rounded-xl bg-[#0B1220] border border-white/10 px-3 py-2.5">
              <span className="size-3 rounded-full bg-[#3B82F6] shadow-[0_0_0_6px_rgba(59,130,246,0.2)] animate-pulse" />
              <div className="text-xs font-semibold">Blue Blip = Water Stress</div>
              <span className="ml-auto text-[11px] font-bold bg-[#1E40AF] text-white rounded-full px-2 py-0.5">{waterStressBlips.length} Active</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#0B1220] border border-white/10 px-3 py-2.5">
              <span className="size-3 rounded-sm bg-[#22C55E] border border-white/20" />
              <div className="text-xs font-semibold">Green Polygon = Sowing Window</div>
              <span className="ml-auto text-[11px] font-bold bg-[#16A34A] text-white rounded-full px-2 py-0.5">{sowingActive} Fields Active</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#0B1220] border border-white/10 px-3 py-2.5">
              <span className="size-3 rounded-full bg-white border-2 border-[#3B82F6]" />
              <div className="text-xs font-semibold">Blue Ring = Existing Borewell</div>
              <span className="ml-auto text-[11px] text-white/60">5 sites</span>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold tracking-[0.08em] text-white/60 flex items-center gap-2"><Activity size={14} /> INDICATORS</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-xl bg-white text-[#111827] p-3 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#EEF2FF] grid place-items-center text-[#4F46E5]"><CloudRain size={16} /></div>
              <div className="flex-1">
                <div className="text-xs font-bold">Rainfall • 12.4 mm / 24h</div>
                <div className="text-[11px] text-[#6B7280]">Light • 5-day cum 28.6 mm</div>
              </div>
              <span className="text-[11px] font-bold bg-[#EEF2FF] text-[#4F46E5] rounded-full px-2 py-1">Light</span>
            </div>
            <div className="rounded-xl bg-white text-[#111827] p-3 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#ECFDF5] grid place-items-center text-[#16A34A]"><Leaf size={16} /></div>
              <div className="flex-1">
                <div className="text-xs font-bold">NDVI • Avg 0.62 • Healthy</div>
                <div className="text-[11px] text-[#6B7280]">Peak &gt;0.6 • no decay</div>
              </div>
              <span className="text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] rounded-full px-2 py-1">Healthy</span>
            </div>
            <div className="rounded-xl bg-white text-[#111827] p-3 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#FEF3C7] grid place-items-center text-[#D97706]"><Droplets size={16} /></div>
              <div className="flex-1">
                <div className="text-xs font-bold">Borewell • 4 Recommended Sites</div>
                <div className="text-[11px] text-[#6B7280]">2 Excellent • 1 Good • depth 45–60 m</div>
              </div>
              <span className="text-[11px] font-bold bg-[#111827] text-white rounded-full px-2 py-1">4 sites</span>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="rounded-2xl bg-white text-[#111827] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold tracking-[0.08em] text-[#6B7280]">SUMMARY METRICS</h4>
            <span className="text-[10px] font-bold bg-[#111827] text-white rounded-full px-2 py-1">PILOT • 450 acres</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-3">
              <div className="text-[11px] font-semibold text-[#6B7280]">Total Monitored</div>
              <div className="text-lg font-extrabold leading-none mt-1">450 <span className="text-xs font-bold text-[#6B7280]">acres</span></div>
              <div className="text-[11px] text-[#6B7280]">15 blocks • 30 ac each</div>
            </div>
            <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3">
              <div className="text-[11px] font-semibold text-[#991B1B]">Avg Soil Moisture</div>
              <div className="text-lg font-extrabold leading-none mt-1 text-[#DC2626]">28% <span className="text-xs font-bold text-[#991B1B]">Low</span></div>
              <div className="text-[11px] text-[#991B1B]">3 stress zones</div>
            </div>
            <div className="rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] p-3">
              <div className="text-[11px] font-semibold text-[#6B7280]">Weather</div>
              <div className="text-sm font-extrabold flex items-center gap-1 mt-1"><ThermometerSun size={14} /> 28°C <span className="text-xs font-medium text-[#6B7280]">• 65% RH</span></div>
              <div className="text-[11px] text-[#6B7280]">Gudur • 13.2°N 79.1°E</div>
            </div>
            <div className="rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] p-3">
              <div className="text-[11px] font-semibold text-[#3730A3]">Latency</div>
              <div className="text-sm font-extrabold text-[#4F46E5] mt-1">&lt; 6h</div>
              <div className="text-[11px] text-[#3730A3]">after Sentinel-2 pass</div>
            </div>
          </div>
          <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex gap-3 p-3">
            <AlertTriangle size={16} className="text-[#DC2626] mt-0.5 shrink-0" />
            <div className="text-xs leading-relaxed">
              <b className="text-[#991B1B]">3 locations show critical water stress.</b> <span className="text-[#7F1D1D]">Recommend immediate irrigation. NDMI &lt;0.1 + NDVI drop &gt;0.15 in 7d.</span>
            </div>
          </div>
        </div>

        {/* Block list quick select */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold tracking-[0.08em] text-white/60">BLOCKS • QUICK SELECT</h3>
          <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto scroll-thin pr-1">
            {blocks.slice(0,8).map(b=>(
              <button key={b.id} onClick={()=>onSelect(b.id)} className={`text-left rounded-xl px-3 py-2.5 border flex items-center gap-2 transition ${selected===b.id?'bg-white text-[#111827] border-white':'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>
                <span className={`size-2 rounded-full shrink-0 ${b.signal==='Green'?'bg-[#22C55E]':b.signal==='Red'?'bg-[#EF4444]':b.signal==='Blue'?'bg-[#3B82F6]':b.signal==='Amber'?'bg-[#F59E0B]':'bg-[#9CA3AF]'}`} />
                <span className="text-xs font-bold">{b.id}</span>
                <span className={`text-[11px] ${selected===b.id?'text-[#6B7280]':'text-white/60'}`}>• {b.village} • {b.acres} ac</span>
                <span className={`ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 ${b.signal==='Green'?'bg-[#DCFCE7] text-[#166534]':b.signal==='Red'?'bg-[#FEE2E2] text-[#991B1B]':b.signal==='Blue'?'bg-[#DBEAFE] text-[#1E40AF]':'bg-white/10 text-white'}`}>{b.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formula callout */}
        <div className="rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] p-3">
          <div className="text-[11px] font-extrabold tracking-[0.06em] text-[#3730A3]">SPECTRAL INDICES • FORMULAE</div>
          <div className="mt-2 space-y-1.5 font-mono text-[11px] leading-relaxed text-[#111827]">
            <div className="bg-white rounded-lg px-2 py-1 border border-[#E5E7EB]"><b>NDVI</b> = (NIR − Red) / (NIR + Red)</div>
            <div className="bg-white rounded-lg px-2 py-1 border border-[#E5E7EB]"><b>NDMI</b> = (NIR − SWIR) / (NIR + SWIR)</div>
            <div className="bg-white rounded-lg px-2 py-1 border border-[#E5E7EB]"><b>NDWI</b> = (Green − NIR) / (Green + NIR)</div>
          </div>
          <div className="text-[10px] text-[#6B7280] mt-2">Bands: B04 Red 665nm • B08 NIR 842nm • B11 SWIR 1610nm • B03 Green 560nm • SCL mask 3,8,9,11</div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span>Free Tier • $0 imagery • &lt;$15/mo 100+ blocks</span>
        <span>Page 1 / 1</span>
      </div>
    </aside>
  )
}
