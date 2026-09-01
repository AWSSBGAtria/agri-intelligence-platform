import { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, CircleMarker, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { blocks, existingBorewells, recommended, waterStressBlips, rainfallIsohyets } from '../data/mockData'

// Fix leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function FitBounds(){
  const map = useMap()
  useEffect(()=>{ map.fitBounds([[13.16,79.07],[13.26,79.135]], {padding:[20,20]}) },[map])
  return null
}

function ndviColor(v:number){
  if(v<0.3) return '#FEF3C7'
  if(v<0.45) return '#86EFAC'
  if(v<0.6) return '#22C55E'
  return '#16A34A'
}

const pulsingIcon = (color:string) => L.divIcon({
  className: 'custom-pulsing',
  html: `<div style="position:relative;width:14px;height:14px">
    <span style="position:absolute;inset:0;background:${color};border-radius:999px;opacity:0.35;animation:ripple 1.6s ease-out infinite"></span>
    <span style="position:absolute;inset:3px;background:${color};border-radius:999px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25)"></span>
  </div>`,
  iconSize:[14,14], iconAnchor:[7,7]
})

const recIcon = L.divIcon({
  className:'rec-pin',
  html:`<div style="position:relative;width:28px;height:34px;display:grid;place-items:center;animation:drift 2s ease-in-out infinite">
    <div style="width:28px;height:28px;background:#22C55E;border:2px solid white;border-radius:999px;display:grid;place-items:center;box-shadow:0 8px 20px rgba(34,197,94,0.5)">
      <span style="font-size:14px">📍</span>
    </div>
    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #22C55E;margin-top:-2px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))"></div>
  </div>`,
  iconSize:[28,34], iconAnchor:[14,30]
})

const blueIcon = L.divIcon({
  className:'blue-pin',
  html:`<div style="width:18px;height:18px;background:#3B82F6;border:2px solid white;border-radius:999px;box-shadow:0 4px 12px rgba(59,130,246,0.5)"></div>`,
  iconSize:[18,18], iconAnchor:[9,9]
})

interface Props {
  layers: { satellite:boolean; ndvi:boolean; borewell:boolean; rainfall:boolean; grid:boolean }
  onBlockSelect: (id:string)=>void
  selected: string | null
}

export default function MapView({ layers, onBlockSelect, selected }: Props){
  return (
    <div className="relative w-full h-full">
      <MapContainer center={[13.212,79.10]} zoom={13} zoomControl={false} className="w-full h-full" style={{background:'#E8EEF6'}}>
        <FitBounds />
        {/* Base */}
        {layers.satellite ? (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="ESRI Satellite" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        )}

        {/* NDVI heatmap as circle markers grid */}
        {layers.ndvi && blocks.map(b=> (
          <CircleMarker key={'heat-'+b.id} center={b.center} radius={36} pathOptions={{ fillColor: ndviColor(b.ndvi), fillOpacity: 0.38, color: ndviColor(b.ndvi), weight:0 }} />
        ))}

        {/* Borewell suitability hatched polygons (simulated via semi transparent fills) */}
        {layers.borewell && recommended.map(r=> {
          const color = r.cls==='Excellent' ? '#22C55E' : r.cls==='Good' ? '#86EFAC' : r.cls==='Moderate' ? '#FCD34D' : '#EF4444'
          const poly: [number,number][] = [[r.lat+0.008,r.lon-0.008],[r.lat+0.008,r.lon+0.008],[r.lat-0.008,r.lon+0.008],[r.lat-0.008,r.lon-0.008]]
          return <Polygon key={r.id} positions={poly} pathOptions={{ color, weight:1.2, dashArray: r.cls==='Poor'?'6 6':undefined, fillColor: color, fillOpacity: r.cls==='Excellent'?0.32:0.22 }} />
        })}

        {/* Rainfall isohyets */}
        {layers.rainfall && rainfallIsohyets.map((line,i)=> (
          <Polyline key={'iso-'+i} positions={line} pathOptions={{ color:'#60A5FA', weight:2, dashArray:'8 8', opacity:0.9 }} />
        ))}

        {/* 30-acre grids */}
        {layers.grid && blocks.map(b=> (
          <Polygon
            key={b.id}
            positions={b.polygon}
            pathOptions={{
              color: selected===b.id ? '#4F46E5' : '#22C55E',
              weight: selected===b.id ? 2.5 : 1.4,
              fillColor: b.signal==='Red' ? '#FEE2E2' : b.signal==='Green' ? '#DCFCE7' : b.signal==='Blue' ? '#DBEAFE' : 'transparent',
              fillOpacity: 0.55,
              dashArray: selected===b.id ? undefined : '0'
            }}
            eventHandlers={{ click: ()=>onBlockSelect(b.id) }}
          />
        ))}

        {/* existing borewells */}
        {existingBorewells.map((e,i)=>(
          <Marker key={'ex-'+i} position={[e.lat,e.lon]} icon={blueIcon} />
        ))}

        {/* water stress blips */}
        {waterStressBlips.map(b=>(
          <Marker key={'blip-'+b.block} position={[b.lat,b.lon]} icon={pulsingIcon('#3B82F6')} />
        ))}

        {/* recommended pins */}
        {layers.borewell && recommended.filter(r=>r.cls==='Excellent' || r.cls==='Good').map(r=>(
          <Marker key={r.id} position={[r.lat,r.lon]} icon={recIcon} />
        ))}

      </MapContainer>

      {/* Overlays: zoom controls, scale, north arrow, coords, minimap */}
      <div className="absolute left-3 top-3 z-[400] flex flex-col gap-2">
        <div className="rounded-xl overflow-hidden border border-white/80 shadow-lg">
          <button className="size-9 grid place-items-center bg-white hover:bg-[#F9FAFB] text-[#111827] font-bold text-lg leading-none">+</button>
          <div className="h-px bg-[#E5E7EB]" />
          <button className="size-9 grid place-items-center bg-white hover:bg-[#F9FAFB] text-[#111827] font-bold text-lg leading-none">−</button>
        </div>
        <div className="hidden sm:grid place-items-center size-9 rounded-xl bg-white border border-[#E5E7EB] shadow text-[#111827]" title="North">
          <span className="text-[10px] font-black tracking-widest">N</span>
          <span className="text-[8px] -mt-1">▲</span>
        </div>
      </div>

      {/* Scale + coords */}
      <div className="absolute left-3 bottom-3 z-[400] flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full border border-[#E5E7EB] px-2 py-1 shadow">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-[80px] bg-[#111827] relative">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-white border-r border-[#111827]" />
            </div>
            <span className="text-[10px] font-bold text-[#111827]">500 m</span>
          </div>
          <span className="text-[10px] text-[#6B7280]">▲ North</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-[#111827] text-white rounded-full px-3 py-1 text-[11px] font-medium shadow">
          <span className="size-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Lat 13.217°N • Lon 79.100°E • WGS 84 / EPSG:4326
        </div>
      </div>

      {/* Minimap inset */}
      <div className="absolute left-3 sm:left-3 bottom-20 sm:bottom-14 z-[400] hidden sm:block">
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xl overflow-hidden w-[190px]">
          <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <span className="text-[10px] font-extrabold tracking-[0.08em] text-[#111827]">ZOOMED INSET • GUDUR MANDAL</span>
            <span className="text-[10px] font-bold text-[#4F46E5]">1 km</span>
          </div>
          <div className="h-[110px] relative bg-[#E8EEF6] overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(90deg, #D1D5DB 1px, transparent 1px)', backgroundSize:'18px 18px'}} />
            {/* red extent box */}
            <div className="absolute left-[32%] top-[28%] w-[42%] h-[38%] border-2 border-[#EF4444] bg-[#EF4444]/10 shadow-[0_0_0_2px_white]" />
            {/* blocks inside minimap */}
            <div className="absolute left-[36%] top-[32%] grid grid-cols-2 gap-0.5">
              <span className="size-3 bg-[#22C55E]/60 border border-[#22C55E]" />
              <span className="size-3 bg-[#EF4444]/60 border border-[#EF4444]" />
              <span className="size-3 bg-[#86EFAC]/60 border border-[#16A34A]" />
              <span className="size-3 bg-[#FCD34D]/60 border border-[#D97706]" />
            </div>
            <div className="absolute bottom-1 left-1 bg-white/90 rounded-full px-2 py-0.5 text-[9px] font-bold border border-[#E5E7EB]">1 km scale</div>
          </div>
        </div>
      </div>

      {/* Depth tooltip for excellent */}
      <div className="absolute right-3 top-3 z-[400] hidden lg:block pointer-events-none">
        <div className="bg-[#111827] text-white rounded-xl px-3 py-2 shadow-xl border border-white/10 max-w-[220px]">
          <div className="text-[11px] font-bold flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#22C55E] animate-pulse" /> Recommended Borewell — Depth 45–60 m</div>
          <div className="text-[11px] text-white/70 leading-tight mt-1">Tap pulsing green pins for lithology, slope & drainage details</div>
        </div>
      </div>
    </div>
  )
}
