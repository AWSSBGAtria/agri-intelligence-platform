import type { SiteId } from '../data/sites'

export default function SiteSwitcher({ site, onChange }: { site: SiteId; onChange: (s:SiteId)=>void }){
  return (
    <div className="inline-flex rounded-full bg-[#F3F4F6] p-1 border border-[#E5E7EB] gap-1">
      <button
        onClick={()=>onChange('chittoor')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${site==='chittoor' ? 'bg-[#111827] text-white shadow' : 'text-[#6B7280] hover:text-[#111827]'}`}
      >
        Chittoor <span className="font-medium opacity-70">• Gudur</span>
      </button>
      <button
        onClick={()=>onChange('gkvk')}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${site==='gkvk' ? 'bg-[#4F46E5] text-white shadow' : 'text-[#6B7280] hover:text-[#111827]'}`}
      >
        GKVK <span className="font-medium opacity-70">• Bangalore</span>
      </button>
    </div>
  )
}
