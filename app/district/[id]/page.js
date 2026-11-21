import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aqiCategory, aqiAdvice, aqiMeasures } from "@/lib/aqi";
import { getDistrict } from "@/lib/getDistrict";
import TrendChart from "@/components/TrendChart";

async function Detail({ params }) {
  const { id } = await params;

  let d = null;
  let error = null;
  try {
    d = await getDistrict(id);
  } catch (e) {
    error = e.message;
  }

  if (error) return <p style={{ color: "red" }}>Could not load data: {error}</p>;
  if (!d) notFound();

  const c = aqiCategory(d.aqi);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{d.name}</h1>

      <div style={{
        marginTop: 16, padding: 16, borderLeft: `10px solid ${c.color}`,
        background: "#ffffff", color: "#0f172a", borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}>
        <div style={{ fontSize: 48, fontWeight: 700 }}>{d.aqi ?? "–"}</div>
        <div style={{ fontSize: 18 }}>{c.label}</div>
        <p style={{ marginTop: 8 }}>{aqiAdvice(d.aqi)}</p>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>What you can do</h2>
      <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.7 }}>
        {aqiMeasures(d.aqi).map((m) => <li key={m}>{m}</li>)}
      </ul>
      <p style={{ fontSize: 12, color: "var(--muted)" }}>
        General guidance based on common public-health recommendations, not medical advice.
      </p>

      <p style={{ marginTop: 16 }}>
        PM2.5: <strong>{d.pm25 ?? "–"}</strong> µg/m³ · PM10: <strong>{d.pm10 ?? "–"}</strong> µg/m³
      </p>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>
        {d.type} · {d.source} · Updated {d.updated?.replace("T", " ")}
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>Last 24 hours</h2>
      <TrendChart hours={d.hours} />
    </>
  );
}

export default function DistrictPage({ params }) {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "16px 16px 40px" }}>
      <Link href="/" style={{ color: "#6aa9ff" }}>← All districts</Link>
      <Suspense fallback={<p style={{ marginTop: 16 }}>Loading…</p>}>
        <Detail params={params} />
      </Suspense>

      <footer style={{
        marginTop: 32, paddingTop: 16, textAlign: "center",
        borderTop: "1px solid rgba(100,116,139,0.3)",
        fontSize: 14, color: "var(--muted)",
      }}>
        <p style={{ margin: 0 }}>Made by <strong>Arnim</strong> 🇳🇵</p>
      </footer>
    </main>
  );
}