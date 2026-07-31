import { ensureDatabase, runtimeEnv } from "../../lib/database";

export const dynamic = "force-dynamic";

type OrderLine = { productId: string; name: string; quantity: number; pieces: number };

function safeText(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function code(prefix: string, size = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return `${prefix}-${Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("")}`;
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const items = Array.isArray(body.items) ? body.items as OrderLine[] : [];
  const validItems = items.filter((item) => item && Number.isInteger(item.quantity) && item.quantity > 0 && Number.isInteger(item.pieces) && item.pieces > 0 && item.quantity <= 100 && item.pieces <= 8);
  const totalPieces = validItems.reduce((sum, item) => sum + item.quantity * item.pieces, 0);
  const email = safeText(customer.email, 160).toLowerCase();
  if (!email.includes("@") || !safeText(customer.fullName, 160) || !safeText(customer.phone, 40) || !safeText(customer.address, 1000) || totalPieces < 1) {
    return Response.json({ error: "invalid_order" }, { status: 400 });
  }

  const DB = await ensureDatabase();
  const id = crypto.randomUUID();
  const orderNo = `EMP-${new Date().getUTCFullYear()}-${code("", 7).replace("-", "")}`;
  const publicToken = crypto.randomUUID();
  const now = new Date().toISOString();
  const subtotalSatang = totalPieces * 20000;
  const giftBox = safeText(body.giftBox, 40) || "individual";
  const coupon = safeText(body.coupon, 60) || null;
  const runtime = await runtimeEnv();
  const expiryDate = runtime.VOUCHER_EXPIRY_DATE || "CONFIGURE_BEFORE_REDEMPTION";

  await DB.prepare(`INSERT INTO orders (
    id, order_no, public_token, customer_email, customer_json, items_json, gift_box,
    coupon_code, subtotal_satang, total_pieces, status, payment_status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_confirmation', 'pending', ?)`)
    .bind(id, orderNo, publicToken, email, JSON.stringify(customer), JSON.stringify(validItems), giftBox, coupon, subtotalSatang, totalPieces, now)
    .run();

  const voucherStatements = Array.from({ length: totalPieces }, () => DB.prepare(`INSERT INTO vouchers (
    id, order_id, code, value_satang, status, expiry_date, created_at
  ) VALUES (?, ?, ?, 20000, 'reserved', ?, ?)`)
    .bind(crypto.randomUUID(), id, code("EMP-HI", 10), expiryDate, now));
  for (let index = 0; index < voucherStatements.length; index += 50) {
    await DB.batch(voucherStatements.slice(index, index + 50));
  }

  let paymentUrl: string | null = null;
  let paymentReference: string | null = null;
  const { HERO_PAY_API_URL, HERO_PAY_API_KEY, SITE_URL } = runtime;
  if (HERO_PAY_API_URL && HERO_PAY_API_KEY) {
    try {
      const paymentResponse = await fetch(HERO_PAY_API_URL, {
        method: "POST",
        headers: { authorization: `Bearer ${HERO_PAY_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          merchantReference: orderNo,
          amount: subtotalSatang,
          currency: "THB",
          description: `EMPEROR Mooncake order ${orderNo}`,
          customer: { name: safeText(customer.fullName, 160), email, phone: safeText(customer.phone, 40) },
          methods: ["promptpay", "card", "alipay", "wechat_pay", "payment_link"],
          returnUrl: `${SITE_URL || new URL(request.url).origin}/account?token=${publicToken}`,
          webhookUrl: `${SITE_URL || new URL(request.url).origin}/api/hero-pay/webhook`,
        }),
      });
      if (paymentResponse.ok) {
        const payment = await paymentResponse.json() as Record<string, unknown>;
        paymentUrl = safeText(payment.paymentUrl ?? payment.checkoutUrl, 1000) || null;
        paymentReference = safeText(payment.paymentId ?? payment.reference, 200) || null;
        await DB.prepare("UPDATE orders SET payment_url = ?, payment_reference = ? WHERE id = ?").bind(paymentUrl, paymentReference, id).run();
      }
    } catch {
      // Order remains safely stored and awaiting a manually issued HERO PAY link.
    }
  }

  return Response.json({ orderNo, voucherCount: totalPieces, publicToken, paymentUrl }, { status: 201 });
}
