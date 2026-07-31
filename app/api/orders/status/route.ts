import { ensureDatabase } from "../../../lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.slice(0, 100);
  if (!token) return Response.json({ error: "missing_token" }, { status: 400 });
  const DB = await ensureDatabase();
  const order = await DB.prepare(`SELECT id, order_no, items_json, subtotal_satang, total_pieces, status,
    payment_status, payment_url, created_at FROM orders WHERE public_token = ?`).bind(token).first<Record<string, unknown>>();
  if (!order) return Response.json({ error: "not_found" }, { status: 404 });
  const voucherRows = await DB.prepare("SELECT code, value_satang, status, expiry_date FROM vouchers WHERE order_id = ? ORDER BY created_at").bind(order.id).all<Record<string, unknown>>();
  return Response.json({
    orderNo: order.order_no,
    items: JSON.parse(String(order.items_json || "[]")),
    subtotalSatang: order.subtotal_satang,
    totalPieces: order.total_pieces,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentUrl: order.payment_url,
    createdAt: order.created_at,
    vouchers: voucherRows.results.map((voucher) => ({ code: order.payment_status === "paid" ? voucher.code : null, valueSatang: voucher.value_satang, status: voucher.status, expiryDate: voucher.expiry_date })),
  });
}
