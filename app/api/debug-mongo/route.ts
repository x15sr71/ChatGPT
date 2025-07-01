// app/api/debug-mongo/route.ts
export async function GET() {
  return new Response(process.env.MONGODB_URI || "Missing MONGODB_URI");
}
