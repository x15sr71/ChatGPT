import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth(); // ✅ await here
    return Response.json({ userId });
  } catch (e) {
    return new Response("Middleware not active", { status: 500 });
  }
}
