type RuntimeEnv = {
  DB: D1Database;
  HERO_PAY_API_URL?: string;
  HERO_PAY_API_KEY?: string;
  SITE_URL?: string;
  VOUCHER_EXPIRY_DATE?: string;
  ADMIN_TOKEN?: string;
};

export async function runtimeEnv(): Promise<RuntimeEnv> {
  const { env } = await import("cloudflare:workers");
  return env as unknown as RuntimeEnv;
}

let initialized = false;

export async function ensureDatabase() {
  const { DB } = await runtimeEnv();
  if (initialized) return DB;
  await DB.batch([
    DB.prepare(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_no TEXT NOT NULL UNIQUE,
      public_token TEXT NOT NULL UNIQUE,
      customer_email TEXT NOT NULL,
      customer_json TEXT NOT NULL,
      items_json TEXT NOT NULL,
      gift_box TEXT NOT NULL,
      coupon_code TEXT,
      subtotal_satang INTEGER NOT NULL,
      total_pieces INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'awaiting_confirmation',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT,
      payment_url TEXT,
      created_at TEXT NOT NULL
    )`),
    DB.prepare("CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(customer_email)"),
    DB.prepare(`CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      value_satang INTEGER NOT NULL DEFAULT 20000,
      status TEXT NOT NULL DEFAULT 'issued',
      expiry_date TEXT NOT NULL,
      redeemed_policy TEXT,
      redeemed_vehicle TEXT,
      created_at TEXT NOT NULL
    )`),
    DB.prepare("CREATE INDEX IF NOT EXISTS vouchers_order_idx ON vouchers(order_id)"),
    DB.prepare(`CREATE TABLE IF NOT EXISTS corporate_leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    )`),
  ]);
  initialized = true;
  return DB;
}
