"use client";

import dynamic from "next/dynamic";

const AqiMap = dynamic(() => import("./AqiMap"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});

export default function MapView({ data }) {
  return <AqiMap data={data} />;
}