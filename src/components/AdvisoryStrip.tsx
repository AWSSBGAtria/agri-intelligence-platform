import { Sprout, Droplets, Wheat, Eye } from 'lucide-react'
import type { SiteConfig } from '../data/sites'

export default function AdvisoryStrip({ site, selected }: { site: SiteConfig, selected: string | null }){
  const b = site.blocks.find(x=>x.id===selected) ?? site.blocks[0]
  const tone = b.signal==='Green' ? 'from-[#ECFDF5] to-white border-[#A7F3D0]' : b.signal==='Red' ? 'from-[#FEF2F2] to-white border-[#FECACA]' : b.signal==='Blue' ? 'from-[#EFF6FF] to-white border-[#BFDBFE]' : b.signal==='Amber' ? 'from-[#FFFBEB] to-white border-[#FDE68A]' : 'from-[#F9FAFB] to-white border-[#E5E7EB]'
  const Icon = b.signal==='Green'? Sprout : b.signal==='Red'? Droplets : b.signal==='Blue'? Wheat : Eye
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${tone} p-5 flex gap-4 items-start shadow-sm`}>
      <div className={`size-11 rounded-2xl grid place-items-center shrink-0 ${b.signal==='Green'?'bg-[#16A34A] text-white':b.signal==='Red'?'bg-[#DC2626] text-white':b.signal==='Blue'?'bg-[#2563EB] text-white':b.signal==='Amber'?'bg-[#D97706] text-white':'bg-[#6B7280] text-white'}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-extrabold tracking-[0.08em] rounded-full px-2.5 py-1 border ${b.signal==='Green'?'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]':b.signal==='Red'?'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]':b.signal==='Blue'?'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]':b.signal==='Amber'?'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]':'bg-white text-[#6B7280] border-[#E5E7EB]'}`}>{b.signal} • {b.type.toUpperCase()}</span>
          <span className="text-sm font-bold text-[#111827]">{b.id} • {b.village} • {b.soil}</span>
          <span className="hidden sm:inline text-xs text-[#6B7280]">• NDVI {b.ndvi} • NDMI {b.ndmi} • Rain {b.rainfall24h} mm/24h</span>
        </div>
        <div className="text-[14px] font-semibold text-[#111827] mt-1.5 leading-relaxed">
          {b.signal==='Green' && (site.id==='gkvk' ? 'Sowing window open — Ragi / French beans ideal. 5-day rain >20mm & NDVI slope >0.02/day. Compartment bund + field bean HA-4 recommended.' : 'Sowing window open — 5-day rain >20mm & NDVI slope >0.02/day confirmed. Groundnut sowing optimal next 7–10 days.')}
          {b.signal==='Red' && 'Critical water stress — NDMI <0.1 and NDVI drop >0.15 in 7 days. Immediate irrigation recommended for this block. WSN check 25–30% FC.'}
          {b.signal==='Blue' && 'Harvest ready — NDVI peaked >0.6 and decayed to <0.35 after 30 days. Schedule harvest & logistics.'}
          {b.signal==='Amber' && 'Watch — pre-sowing conditions emerging, but 5-day rain 10–20mm. Monitor next overpass (latency <6h).'}
          {b.signal==='Gray' && 'Normal — no threshold crossed. Continue routine monitoring. Next Sentinel-2 pass 4 AM UTC.'}
        </div>
        <div className="text-xs text-[#6B7280] mt-1.5">Advisory 06:00 IST • Timestream daily • DynamoDB advisory_logs • Hover polygons & pins for details • తెలుగు: {b.signal==='Green'?'వేరుశనగ విత్తడానికి అనుకూలం':b.signal==='Red'?'తీవ్ర నీటి ఒత్తిడి — వెంటనే నీరు పెట్టండి':'సాధారణం'}</div>
      </div>
      <div className="hidden lg:flex flex-col items-end gap-1.5">
        <span className="text-[11px] font-bold text-[#6B7280]">{b.acres} ac • Block</span>
        <span className="text-xs font-mono bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-sm">{b.center[0].toFixed(3)}°N, {b.center[1].toFixed(3)}°E</span>
        <span className="text-[11px] text-[#6B7280]">{site.id==='gkvk' ? '930m AMSL • ZARS' : 'Gudur • EPSG:4326'}</span>
      </div>
    </div>
  )
}
