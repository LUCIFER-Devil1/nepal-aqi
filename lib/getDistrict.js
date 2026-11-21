import { districts } from "@/data/districts";

export async function getDistrict(id) {
  const d = districts.find((x) => x.id === id);
  if (!d) return null;

  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${d.lat}&longitude=${d.lon}` +
    `&current=us_aqi,pm2_5,pm10` +
    `&hourly=us_aqi,pm2_5&past_days=1&forecast_days=1` +
    `&timezone=Asia%2FKathmandu`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Open-Meteo returned status " + res.status);
  const data = await res.json();

  // Keep only hours up to now, then take the last 24
  const now = data.current?.time ?? "";
  const hours = data.hourly.time
    .map((t, i) => ({
      time: t,
      label: t.slice(11, 16),
      aqi: data.hourly.us_aqi[i],
      pm25: data.hourly.pm2_5[i],
    }))
    .filter((h) => h.time <= now && h.aqi != null)
    .slice(-24);

  return {
    ...d,
    aqi: data.current?.us_aqi ?? null,
    pm25: data.current?.pm2_5 ?? null,
    pm10: data.current?.pm10 ?? null,
    updated: data.current?.time ?? null,
    type: "Estimated",
    source: "Open-Meteo (CAMS model)",
    hours,
  };
}