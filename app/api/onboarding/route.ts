import { and, eq } from "drizzle-orm";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { profiles, purposes } from "@/db/schema";

function unavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return Response.json({ error: message.includes("binding") ? "Saving is temporarily unavailable." : "Unable to save your profile." }, { status: 500 });
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in with ChatGPT to save your purpose." }, { status: 401 });
  try {
    const db = getDb();
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.userId)).limit(1);
    const [purpose] = await db.select().from(purposes).where(eq(purposes.userId, user.userId)).limit(1);
    return Response.json({ profile: profile ?? null, purpose: purpose ?? null, user: { displayName: user.displayName, email: user.email } });
  } catch (error) { return unavailable(error); }
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in with ChatGPT to save your purpose." }, { status: 401 });
  const body = await request.json() as { fullName?: string; area?: string; role?: string; statement?: string };
  const fullName = body.fullName?.trim() ?? "";
  const area = body.area?.trim() ?? "";
  const role = body.role?.trim() ?? "";
  const statement = body.statement?.trim() ?? "";
  if (!fullName || !area || !role || !statement) return Response.json({ error: "Complete your profile and purpose before saving." }, { status: 400 });
  if (statement.length > 500) return Response.json({ error: "Keep your purpose under 500 characters." }, { status: 400 });
  try {
    const db = getDb();
    await db.batch([
      db.insert(profiles).values({ userId: user.userId, fullName, email: user.email, area, role }).onConflictDoUpdate({ target: profiles.userId, set: { fullName, email: user.email, area, role, updatedAt: new Date().toISOString() } }),
      db.insert(purposes).values({ userId: user.userId, statement }).onConflictDoUpdate({ target: purposes.userId, set: { statement, status: "active", updatedAt: new Date().toISOString() } }),
    ]);
    const [profile] = await db.select().from(profiles).where(and(eq(profiles.userId, user.userId))).limit(1);
    const [purpose] = await db.select().from(purposes).where(eq(purposes.userId, user.userId)).limit(1);
    return Response.json({ profile, purpose });
  } catch (error) { return unavailable(error); }
}
