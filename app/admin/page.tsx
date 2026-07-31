"use client";

import { FormEvent, useState } from "react";

type Dashboard = {
  metrics: Record<string, number>;
  orders: Record<string, string | number>[];
  leads: Record<string, string | number>[];
};

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    const token = String(new FormData(event.currentTarget).get("token") || "");
    const response = await fetch("/api/admin", { headers: { authorization: `Bearer ${token}` } });
    if (response.ok) setDashboard(await response.json()); else setError("Access denied. Configure and use the EMPEROR ADMIN_TOKEN.");
    setBusy(false);
  };

  if (!dashboard) return <main className="admin-login"><form onSubmit={unlock}><span>♛</span><p>EMPEROR FOODS</p><h1>Admin Dashboard</h1><label><span>Secure access token</span><input name="token" type="password" required autoComplete="current-password" /></label><button type="submit" disabled={busy}>{busy ? "Checking…" : "Open dashboard"}</button>{error && <small>{error}</small>}</form></main>;

  const m = dashboard.metrics;
  return <main className="admin-page"><aside><strong>♛ EMPEROR</strong><span>FOODS ADMIN</span><nav><a href="#overview">Overview</a><a href="#orders">Orders</a><a href="#customers">Customers</a><a href="#payments">Payments</a><a href="#vouchers">Vouchers</a><a href="#corporate">Corporate</a></nav><a href="/">View store ↗</a></aside><section><header><div><p>OPERATIONS</p><h1>Commerce overview</h1></div><span>Mid-Autumn 2026</span></header><div className="admin-metrics" id="overview"><article><span>Orders</span><strong>{m.orders || 0}</strong></article><article><span>Paid revenue</span><strong>฿{Math.round((m.revenue_satang || 0) / 100).toLocaleString()}</strong></article><article><span>Mooncakes</span><strong>{m.pieces || 0}</strong></article><article><span>Customers</span><strong>{m.customers || 0}</strong></article><article><span>Vouchers issued</span><strong>{m.vouchersIssued || 0}</strong></article><article><span>Pending payment</span><strong>{m.pending_payments || 0}</strong></article></div><div className="admin-panel" id="orders"><h2>Recent orders</h2><div className="admin-table"><div className="admin-table-head"><span>Order</span><span>Customer</span><span>Pieces</span><span>Total</span><span>Payment</span></div>{dashboard.orders.length ? dashboard.orders.map((order) => <div key={String(order.order_no)}><strong>{order.order_no}</strong><span>{order.customer_email}</span><span>{order.total_pieces}</span><span>฿{Math.round(Number(order.subtotal_satang) / 100).toLocaleString()}</span><span>{order.payment_status}</span></div>) : <p>No orders yet.</p>}</div></div><div className="admin-panel" id="corporate"><h2>Corporate enquiries</h2><div className="admin-table"><div className="admin-table-head"><span>Company</span><span>Contact</span><span>Quantity</span><span>Status</span><span>Date</span></div>{dashboard.leads.length ? dashboard.leads.map((lead, index) => <div key={`${lead.email}-${index}`}><strong>{lead.company}</strong><span>{lead.name}</span><span>{lead.quantity}</span><span>{lead.status}</span><span>{String(lead.created_at).slice(0, 10)}</span></div>) : <p>No enquiries yet.</p>}</div></div></section></main>;
}
