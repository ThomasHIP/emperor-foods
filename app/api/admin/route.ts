import { ensureDatabase, runtimeEnv } from "../../lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const runtime = await runtimeEnv();
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!runtime.ADMIN_TOKEN || supplied !== runtime.ADMIN_TOKEN) return Response.json({ error: "unauthorized" }, { status: 401 });
  const DB = await ensureDatabase();
  const [metrics, orders, leads] = await Promise.all([
    DB.prepare(`SELECT
      COUNT(*) AS orders,
      COUNT(DISTINCT customer_email) AS customers,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN subtotal_satang ELSE 0 END), 0) AS revenue_satang,
      COALESCE(SUM(total_pieces), 0) AS pieces,
      SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) AS pending_payments
      FROM orders`).first<Record<string, unknown>>(),
    DB.prepare("SELECT order_no, customer_email, subtotal_satang, total_pieces, status, payment_status, created_at FROM orders ORDER BY created_at DESC LIMIT 30").all<Record<string, unknown>>(),
    DB.prepare("SELECT name, company, email, phone, quantity, status, created_at FROM corporate_leads ORDER BY created_at DESC LIMIT 30").all<Record<string, unknown>>(),
  ]);
  const voucherMetrics = await DB.prepare(`SELECT COUNT(*) AS issued, SUM(CASE WHEN status = 'redeemed' THEN 1 ELSE 0 END) AS redeemed FROM vouchers`).first<Record<string, unknown>>();
  return Response.json({ metrics: { ...metrics, vouchersIssued: voucherMetrics?.issued || 0, vouchersRedeemed: voucherMetrics?.redeemed || 0, activeProducts: 4 }, orders: orders.results, leads: leads.results });
}
