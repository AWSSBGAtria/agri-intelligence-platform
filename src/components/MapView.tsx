import { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, CircleMarker, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SiteConfig } from '../data/sites'

// Fix leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function FitBounds({ bbox }: { bbox: [number,number,number,number] }){
  const map = useMap()
  useEffect(()=>{
    const southWest: [number,number] = [bbox[1], bbox[0]]
    const northEast: [number,number] = [bbox[3], bbox[2]]
    map.fitBounds([southWest, northEast], {padding:[24,24]})
  },[map, bbox])
  return null
}

function ZoomControls(){
  const map = useMap()
  return (
    <div className="absolute left-4 top-4 z-[400] flex flex-col gap-2.5">
      <div className="rounded-2xl overflow-hidden border border-white/80 shadow-lg">
        <button onClick={()=>map.zoomIn()} className="size-10 grid place-items-center bg-white hover:bg-[#F9FAFB] text-[#111827] font-bold text-lg leading-none" aria-label="Zoom in">+</button>
        <div className="h-px bg-[#E5E7EB]" />
        <button onClick={()=>map.zoomOut()} className="size-10 grid place-items-center bg-white hover:bg-[#F9FAFB] text-[#111827] font-bold text-lg leading-none" aria-label="Zoom out">−</button>
      </div>
      <div className="hidden sm:grid place-items-center size-10 rounded-2xl bg-white border border-[#E5E7EB] shadow text-[#111827]" title="North">
        <span className="text-[11px] font-black tracking-widest">N</span>
        <span className="text-[9px] -mt-1">▲</span>
      </div>
    </div>
  )
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
  site: SiteConfig
  layers: { satellite:boolean; ndvi:boolean; borewell:boolean; rainfall:boolean; grid:boolean }
  onBlockSelect: (id:string)=>void
  selected: string | null
}

export default function MapView({ site, layers, onBlockSelect, selected }: Props){
  return (
    <div className="relative w-full h-full">
      <MapContainer center={site.center} zoom={site.zoom} zoomControl={false} className="w-full h-full" style={{background:'#E8EEF6'}}>
        <FitBounds bbox={site.bbox} />
        {layers.satellite ? (
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="ESRI Satellite" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        )}

        {layers.ndvi && site.blocks.map(b=> (
          <CircleMarker key={'heat-'+b.id} center={b.center} radius={38} pathOptions={{ fillColor: ndviColor(b.ndvi), fillOpacity: 0.34, color: ndviColor(b.ndvi), weight:0 }}>
            <Tooltip sticky direction="top" opacity={0.95}>
              <div className="text-xs leading-tight"><b>NDVI heat</b> {b.ndvi} • {b.soil}<br/><span className="text-[11px] text-[#6B7280]">Yellow 0.2 → Dark Green 0.75 • B04 665nm + B08 842nm</span></div>
            </Tooltip>
          </CircleMarker>
        ))}

        {layers.borewell && site.recommended.map(r=> {
          const color = r.cls==='Excellent' ? '#22C55E' : r.cls==='Good' ? '#86EFAC' : r.cls==='Moderate' ? '#FCD34D' : '#EF4444'
          const poly: [number,number][] = [[r.lat+0.007,r.lon-0.007],[r.lat+0.007,r.lon+0.007],[r.lat-0.007,r.lon+0.007],[r.lat-0.007,r.lon-0.007]]
          return (
            <Polygon key={r.id} positions={poly} pathOptions={{ color, weight:1.2, dashArray: r.cls==='Poor'?'6 6':undefined, fillColor: color, fillOpacity: r.cls==='Excellent'?0.30:0.20 }}>
              <Tooltip sticky direction="top" opacity={0.95}>
                <div className="text-xs"><b>{r.cls}</b> • {r.score} • {r.lithology}<br/><span className="text-[11px] text-[#6B7280]">Hatched suitability zone • slope {r.slope}°</span></div>
              </Tooltip>
            </Polygon>
          )
        })}

        {layers.rainfall && site.isohyets.map((line,i)=> (
          <Polyline key={'iso-'+i} positions={line} pathOptions={{ color:'#60A5FA', weight:2, dashArray:'8 8', opacity:0.9 }}>
            <Tooltip sticky><span className="text-xs">Rainfall isohyet • CHIRPS 0.05° • dashed blue</span></Tooltip>
          </Polyline>
        ))}

        {layers.grid && site.blocks.map(b=> (
          <Polygon
            key={b.id}
            positions={b.polygon}
            pathOptions={{
              color: selected===b.id ? '#4F46E5' : '#22C55E',
              weight: selected===b.id ? 2.6 : 1.3,
              fillColor: b.signal==='Red' ? '#FEE2E2' : b.signal==='Green' ? '#DCFCE7' : b.signal==='Blue' ? '#DBEAFE' : 'transparent',
              fillOpacity: selected===b.id ? 0.62 : 0.50,
            }}
            eventHandlers={{ click: ()=>onBlockSelect(b.id) }}
          >
            <Tooltip sticky direction="top" opacity={0.96}>
              <div className="text-xs leading-snug">
                <div className="font-bold">{b.id} • {b.village} • {b.acres} ac</div>
                <div className="text-[11px] text-[#4B5563]">{b.soil} • NDVI {b.ndvi} • NDMI {b.ndmi} • {b.rainfall24h} mm/24h</div>
                <div className={`inline-flex mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${b.signal==='Green'?'bg-[#DCFCE7] text-[#166534]':b.signal==='Red'?'bg-[#FEE2E2] text-[#991B1B]':b.signal==='Blue'?'bg-[#DBEAFE] text-[#1E40AF]':'bg-[#FEF3C7] text-[#92400E]'}`}>{b.signal} • {b.type}</div>
                <div className="text-[10px] text-[#6B7280] mt-1">Click to focus advisory • 30-acre polygon</div>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {site.existing.map((e,i)=>(
          <Marker key={'ex-'+i} position={[e.lat,e.lon]} icon={blueIcon}>
            <Tooltip direction="top" offset={[0,-10]} opacity={0.95}>
              <div className="text-xs"><b>Existing borewell</b> • Depth {e.depth} • {e.status}<br/><span className="text-[11px] text-[#6B7280]">{(e as any).lps ? `Yield ${(e as any).lps} • ` : ''}{e.lat.toFixed(3)}°N {(e as any).lon?.toFixed(3) ?? e.lon.toFixed(3)}°E • Blue ring</span></div>
            </Tooltip>
          </Marker>
        ))}

        {site.blips.map(b=>(
          <Marker key={'blip-'+b.block} position={[b.lat,b.lon]} icon={pulsingIcon('#3B82F6')}>
            <Tooltip direction="top" offset={[0,-8]} opacity={0.95}>
              <div className="text-xs"><b className="text-[#1E40AF]">Water stress • Soil Moisture Low</b><br/>{b.label} • Block {b.block}<br/><span className="text-[11px] text-[#6B7280]">Pulsing blue blip • 3 ripple rings • NDMI &lt;0.1 + NDVI drop &gt;0.15</span></div>
            </Tooltip>
          </Marker>
        ))}

        {layers.borewell && site.recommended.filter(r=>r.cls==='Excellent' || r.cls==='Good').map(r=>(
          <Marker key={r.id} position={[r.lat,r.lon]} icon={recIcon}>
            <Tooltip direction="top" offset={[0,-28]} opacity={0.97}>
              <div className="text-xs leading-snug">
                <div className="font-bold text-[#166534]">Recommended borewell • {r.cls} {r.score}</div>
                <div className="text-[11px]">{r.lithology} • Depth {r.depth} • Slope {r.slope}°</div>
                <div className="text-[11px] text-[#6B7280]">Green pin pulsing • tap for MCDA + RF details • {r.village}</div>
              </div>
            </Tooltip>
          </Marker>
        ))}

        <ZoomControls />
      </MapContainer>

      <div className="absolute left-4 bottom-4 z-[400] flex flex-col gap-2.5">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-full border border-[#E5E7EB] px-3 py-1.5 shadow">
          <div className="h-1.5 w-[84px] bg-[#111827] relative rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-white border-r border-[#111827]" />
          </div>
          <span className="text-[11px] font-bold text-[#111827]">500 m</span>
          <span className="text-[11px] text-[#6B7280]">▲ North</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-[#111827] text-white rounded-full px-3.5 py-1.5 text-[11px] font-medium shadow">
          <span className="size-1.5 rounded-full bg-[#22C55E] animate-pulse" /> {site.meta.latLon} • WGS 84 / EPSG:4326
        </div>
      </div>
    </div>
  )
}
