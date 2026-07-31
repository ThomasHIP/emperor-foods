import { ensureDatabase } from "../../lib/database";

export const dynamic = "force-dynamic";

const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const name = clean(body.name, 160);
  const company = clean(body.company, 200);
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 40);
  const quantity = Number(body.quantity);
  if (!name || !company || !email.includes("@") || !phone || !Number.isInteger(quantity) || quantity < 20) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const DB = await ensureDatabase();
  await DB.prepare(`INSERT INTO corporate_leads (id, name, company, email, phone, quantity, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`)
    .bind(crypto.randomUUID(), name, company, email, phone, quantity, clean(body.message, 2000) || null, new Date().toISOString())
    .run();
  return Response.json({ ok: true }, { status: 201 });
}
