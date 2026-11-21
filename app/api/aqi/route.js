import { districts } from "@/data/districts.js";

export async function GET() {
  const lats = districts.map(d => d.lat).join(",");
  const lons = districts.map(d => d.lon).join(",");

  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lats}&longitude=${lons}` +
    `&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKathmandu`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    return Response.json({ error: "Upstream API failed" }, { status: 502 });
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : [data];

  const result = districts.map((d, i) => ({
    ...d,
    aqi: list[i]?.current?.us_aqi ?? null,
    pm25: list[i]?.current?.pm2_5 ?? null,
    pm10: list[i]?.current?.pm10 ?? null,
    updated: list[i]?.current?.time ?? null,
    type: "Estimated",
    source: "Open-Meteo (CAMS model)",
  }));

  return Response.json(result);
}