export async function GET() {
  const k = process.env.OPENAQ_API_KEY;
  return Response.json({ hasKey: !!k, length: k ? k.length : 0 });
}