"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { aqiCategory } from "@/lib/aqi";

export default function AqiMap({ data }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, []);

  if (!ready) return <p>Loading map…</p>;

  return (
    <MapContainer
      center={[28.3, 84.1]}
      zoom={7}
      style={{ height: 420, width: "100%", borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((d) => {
        const c = aqiCategory(d.aqi);
        return (
          <CircleMarker
            key={d.id}
            center={[d.lat, d.lon]}
            radius={9}
            pathOptions={{ color: "#222", weight: 1, fillColor: c.color, fillOpacity: 0.85 }}
          >
            <Popup>
              <strong>{d.name}</strong>
              <br />
              AQI: {d.aqi ?? "–"} ({c.label})
              <br />
              PM2.5: {d.pm25 ?? "–"} µg/m³
              <br />
              {d.type} · {d.source}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}