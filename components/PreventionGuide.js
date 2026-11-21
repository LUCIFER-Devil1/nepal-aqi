import { AQI_LEVELS } from "@/lib/aqi";

export default function PreventionGuide() {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>What to do at each AQI level</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
        Tap a level to see the recommended precautions.
      </p>
      <div style={{ marginTop: 12 }}>
        {AQI_LEVELS.map((l) => (
          <details key={l.label} style={{
            background: "#ffffff", color: "#0f172a", borderRadius: 12, marginBottom: 8,
            borderLeft: `8px solid ${l.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            padding: "10px 16px",
          }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              {l.label} <small style={{ color: "#64748b", fontWeight: 400 }}>· AQI {l.range}</small>
            </summary>
            <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.7 }}>
              {l.measures.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}