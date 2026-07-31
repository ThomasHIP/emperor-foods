import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNo: text("order_no").notNull().unique(),
  publicToken: text("public_token").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  customerJson: text("customer_json").notNull(),
  itemsJson: text("items_json").notNull(),
  giftBox: text("gift_box").notNull(),
  couponCode: text("coupon_code"),
  subtotalSatang: integer("subtotal_satang").notNull(),
  totalPieces: integer("total_pieces").notNull(),
  status: text("status").notNull().default("awaiting_confirmation"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentReference: text("payment_reference"),
  paymentUrl: text("payment_url"),
  createdAt: text("created_at").notNull(),
});

export const vouchers = sqliteTable("vouchers", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  code: text("code").notNull().unique(),
  valueSatang: integer("value_satang").notNull().default(20000),
  status: text("status").notNull().default("issued"),
  expiryDate: text("expiry_date").notNull(),
  redeemedPolicy: text("redeemed_policy"),
  redeemedVehicle: text("redeemed_vehicle"),
  createdAt: text("created_at").notNull(),
});

export const corporateLeads = sqliteTable("corporate_leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  quantity: integer("quantity").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
});
