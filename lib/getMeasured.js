const BASE = "https://api.openaq.org/v3";

function opts() {
  return {
    headers: { "X-API-Key": process.env.OPENAQ_API_KEY },
    next: { revalidate: 1800 },
  };
}

// PM2.5 (µg/m³) to US AQI, using the 2024 EPA breakpoints
export function pm25ToAqi(c) {
  if (c == null || c < 0) return null;
  const bp = [
    [0, 9.0, 0, 50],
    [9.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 125.4, 151, 200],
    [125.5, 225.4, 201, 300],
    [225.5, 325.4, 301, 500],
  ];
  const x = Math.round(c * 10) / 10;
  for (const [cl, ch, il, ih] of bp) {
    if (x <= ch) return Math.round(((ih - il) / (ch - cl)) * (Math.max(x, cl) - cl) + il);
  }
  return 500;
}

export async function getStations() {
  const res = await fetch(`${BASE}/locations?iso=NP&parameters_id=2&limit=100`, opts());
  if (!res.ok) throw new Error("OpenAQ locations returned " + res.status);
  const { results } = await res.json();

  const all = await Promise.all(
    results.map(async (loc) => {
      const sensor = loc.sensors?.find((s) => s.parameter?.id === 2);
      if (!sensor || !loc.coordinates) return null;
      const r = await fetch(`${BASE}/locations/${loc.id}/latest`, opts());
      if (!r.ok) return null;
      const latest = (await r.json()).results?.find((x) => x.sensorsId === sensor.id);
      if (!latest || latest.value == null) return null;
      return {
        name: loc.name,
        lat: loc.coordinates.latitude,
        lon: loc.coordinates.longitude,
        pm25: latest.value,
        time: latest.datetime?.utc,
      };
    })
  );
  return all.filter(Boolean);
}