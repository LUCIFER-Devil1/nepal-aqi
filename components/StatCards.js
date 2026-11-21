import { aqiCategory } from "@/lib/aqi";

export default function StatCards({ data }) {
  const valid = data.filter((d) => d.aqi != null);
  if (valid.length === 0) return null;

  const worst = valid.reduce((a, b) => (b.aqi > a.aqi ? b : a));
  const best = valid.reduce((a, b) => (b.aqi < a.aqi ? b : a));
  const avg = Math.round(valid.reduce((s, d) => s + d.aqi, 0) / valid.length);
  const measured = data.filter((d) => d.type === "Measured").length;

  const items = [
    { label: "Most polluted", value: worst.aqi, sub: worst.name, color: aqiCategory(worst.aqi).color },
    { label: "Cleanest", value: best.aqi, sub: best.name, color: aqiCategory(best.aqi).color },
    { label: "National average", value: avg, sub: aqiCategory(avg).label, color: aqiCategory(avg).color },
    { label: "Sensor-measured", value: measured, sub: `of ${data.length} districts`, color: "#0ea5e9" },
  ];

  return (
    <div style={{
      display: "grid", gap: 10, marginTop: 16,
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    }}>
      {items.map((it) => (
        <div key={it.label} style={{
          background: "#fff", color: "#0f172a", borderRadius: 14, padding: "12px 14px",
          borderTop: `5px solid ${it.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{it.label}</div>
          <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>{it.value}</div>
          <div style={{ fontSize: 13, color: "#475569" }}>{it.sub}</div>
        </div>
      ))}
    </div>
  );
}