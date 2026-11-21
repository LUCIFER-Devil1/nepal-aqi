import { connection } from "next/server";
import { districts } from "@/data/districts";
import { getStations, pm25ToAqi } from "@/lib/getMeasured";

const MAX_KM = 25;
const MAX_AGE_HOURS = 3;

function km(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function getAqi() {
  await connection();

  const lats = districts.map((d) => d.lat).join(",");
  const lons = districts.map((d) => d.lon).join(",");
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lats}&longitude=${lons}` +
    `&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKathmandu`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Open-Meteo returned status " + res.status);
  const data = await res.json();
  const list = Array.isArray(data) ? data : [data];

  let stations = [];
  try {
    stations = await getStations();
  } catch (e) {
    // If OpenAQ fails, fall back to estimates only
  }
  const fresh = stations.filter(
    (s) => s.time && (Date.now() - new Date(s.time).getTime()) / 36e5 <= MAX_AGE_HOURS
  );

  return districts.map((d, i) => {
    const base = {
      ...d,
      aqi: list[i]?.current?.us_aqi ?? null,
      pm25: list[i]?.current?.pm2_5 ?? null,
      pm10: list[i]?.current?.pm10 ?? null,
      updated: list[i]?.current?.time ?? null,
      type: "Estimated",
      source: "Open-Meteo (CAMS model)",
    };

    const near = fresh
      .map((s) => ({ ...s, dist: km(d, s) }))
      .filter((s) => s.dist <= MAX_KM)
      .sort((a, b) => a.dist - b.dist);

    if (near.length === 0) return base;

    const avg = near.reduce((sum, s) => sum + s.pm25, 0) / near.length;
    return {
      ...base,
      aqi: pm25ToAqi(avg),
      pm25: Math.round(avg * 10) / 10,
      updated: near[0].time,
      type: "Measured",
      source: `${near.map((s) => s.name).join(", ")} via OpenAQ`,
    };
  });
}