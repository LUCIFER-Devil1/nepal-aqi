import { getStations } from "@/lib/getMeasured";

export async function GET() {
  try {
    return Response.json(await getStations());
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}