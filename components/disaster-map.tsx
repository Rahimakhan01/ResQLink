"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

type Disaster = {
  id: number
  type: string
  location: string
  severity: string
  coordinates: [number, number]
  status: string
}

export default function DisasterMap({ disasters }: { disasters: Disaster[] }) {
  // Center of India
  const center: [number, number] = [20.5937, 78.9629]

  return (
    <MapContainer center={center} zoom={5} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {disasters.map((disaster) => (
        <Marker
          key={disaster.id}
          position={disaster.coordinates}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{disaster.type}</h3>
              <p className="text-sm">{disaster.location}</p>
              <p className="text-sm text-red-500">Severity: {disaster.severity}</p>
              <p className="text-sm">Status: {disaster.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}