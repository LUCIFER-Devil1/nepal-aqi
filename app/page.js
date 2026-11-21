import StatCards from "@/components/StatCards";
import { Suspense } from "react";
import Link from "next/link";
import { aqiCategory } from "@/lib/aqi";
import { getAqi } from "@/lib/getAqi";
import MapView from "@/components/MapView";

async function Districts() {
  let data = [];
  let error = null;
  try {
    data = await getAqi();
  } catch (e) {
    error = e.message;
  }
  const sorted = [...data].sort((a, b) => (b.aqi ?? -1) - (a.aqi ?? -1));
  const measured = data.filter((d) => d.type === "Measured").length;

  return (
    <>
      {error && <p style={{ color: "red" }}>Could not load data: {error}</p>}

            <StatCards data={data} />

            <div className="map-wrap" style={{ marginTop: 16 }}>
        <MapView data={data} />
      </div>

      <ul style={{ marginTop: 16 }}>
        {sorted.map((d) => {
          const c = aqiCategory(d.aqi);
          return (
            <li key={d.id} style={{ marginBottom: 8 }}>
              <Link href={`/district/${d.id}`} style={{
                display: "flex", justifyContent: "space-between",
                padding: 12, textDecoration: "none",
                borderLeft: `8px solid ${c.color}`, background: "#f7f7f7", color: "#111"
              }}>
                <span><strong>{d.name}</strong><br /><small>{d.type} · {d.source}</small></span>
                <span style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: 24 }}>{d.aqi ?? "–"}</strong><br />
                  <small>{c.label}</small>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Nepal Air Quality by District</h1>
      <p style={{ color: "#999" }}>
        US AQI. "Measured" comes from a nearby sensor; "Estimated" is modeled, not measured locally.
      </p>
      <Suspense fallback={<p style={{ marginTop: 16 }}>Loading air quality data…</p>}>
        <Districts />
      </Suspense>
    </main>
  );
}