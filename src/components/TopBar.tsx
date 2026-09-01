import { Download, Grid3X3, Satellite, Droplets, Leaf, Crosshair } from 'lucide-react'
import SiteSwitcher from './SiteSwitcher'
import type { SiteId } from '../data/sites'

interface Props {
  site: SiteId
  onSiteChange: (s:SiteId)=>void
  layers: { satellite:boolean; ndvi:boolean; borewell:boolean; rainfall:boolean; grid:boolean }
  toggle: (k: keyof Props['layers'])=>void
  online: boolean
  onExport: ()=>void
}

export default function TopBar({ site, onSiteChange, layers, toggle, online, onExport }: Props){
  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
      <div className="h-[36px] border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-extrabold tracking-[0.14em] text-[#111827]">AGRI-INTELLIGENCE</span>
          <span className="hidden lg:inline h-3 w-px bg-[#E5E7EB]" />
          <span className="hidden lg:inline text-[11px] font-medium text-[#6B7280]">30-acre blocks • Daily 6 AM IST</span>
          <SiteSwitcher site={site} onChange={onSiteChange} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[11px] font-semibold text-[#111827]">
            <span className="size-2 rounded-full bg-[#4F46E5]" /> AWS Student Builder Group
          </span>
          <span className={`hidden md:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${online?'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]':'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'}`}>
            <span className={`size-1.5 rounded-full ${online?'bg-[#10B981] animate-pulse':'bg-[#EF4444]'}`} /> {online?'ONLINE':'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 rounded-2xl bg-[#F3F4F6] p-1.5 border border-[#E5E7EB]">
            <button onClick={()=>toggle('satellite')} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${layers.satellite?'bg-[#111827] text-white shadow':'text-[#6B7280] hover:text-[#111827]'}`}>
              <Satellite size={14} /> Satellite
            </button>
            <button onClick={()=>toggle('ndvi')} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${layers.ndvi?'bg-[#16A34A] text-white shadow':'text-[#6B7280] hover:text-[#111827]'}`}>
              <Leaf size={14} /> NDVI
            </button>
            <button onClick={()=>toggle('borewell')} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${layers.borewell?'bg-[#4F46E5] text-white shadow':'text-[#6B7280] hover:text-[#111827]'}`}>
              <Crosshair size={14} /> Borewell
            </button>
            <button onClick={()=>toggle('rainfall')} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${layers.rainfall?'bg-[#0EA5E9] text-white shadow':'text-[#6B7280] hover:text-[#111827]'}`}>
              <Droplets size={14} /> Rainfall
            </button>
          </div>
          <button onClick={()=>toggle('grid')} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${layers.grid?'bg-white border-[#111827] text-[#111827] shadow-sm':'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]'}`}>
            <Grid3X3 size={14} /> 30-acre Polygons
          </button>
          <span className="hidden 2xl:inline text-[11px] text-[#6B7280]">Basemap: <b className="text-[#111827]">ESRI Satellite</b> • CRS: WGS 84 / EPSG:4326 • Tiles z12–16 &lt;200MB</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={onExport} className="inline-flex items-center gap-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 text-xs font-bold shadow-sm transition">
            <Download size={14} /> Export Map
          </button>
        </div>
      </div>
      <div className="h-px bg-[#4F46E5] w-full" />
    </header>
  )
}
