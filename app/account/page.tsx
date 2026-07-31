"use client";

import { useEffect, useState } from "react";

type Order = {
  orderNo: string;
  subtotalSatang: number;
  totalPieces: number;
  status: string;
  paymentStatus: string;
  paymentUrl?: string | null;
  vouchers: { code: string | null; valueSatang: number; status: string; expiryDate: string }[];
};

export default function AccountPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setError(true); return; }
    fetch(`/api/orders/status?token=${encodeURIComponent(token)}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setOrder)
      .catch(() => setError(true));
  }, []);

  return <main className="portal-page">
    <header><a href="/">♛ EMPEROR FOODS</a><span>Customer Portal</span></header>
    <section>
      {!order && !error && <p>Loading your order…</p>}
      {error && <div className="portal-card"><h1>Order link not found</h1><p>Open the secure link provided in your EMPEROR FOODS confirmation.</p><a href="/">Return to EMPEROR FOODS</a></div>}
      {order && <>
        <div className="portal-title"><p>MY ORDER</p><h1>{order.orderNo}</h1><span>{order.status.replaceAll("_", " ")} · Payment {order.paymentStatus}</span></div>
        <div className="portal-grid"><article className="portal-card"><p>ORDER SUMMARY</p><strong>{order.totalPieces}</strong><span>Mooncake piece(s)</span><h2>{new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(order.subtotalSatang / 100)}</h2>{order.paymentUrl && <a className="portal-pay" href={order.paymentUrl}>Pay securely with HERO PAY →</a>}</article><article className="portal-card"><p>EMPEROR PRIVILEGE</p><strong>{order.vouchers.length}</strong><span>HERO Insure voucher(s)</span><small>One voucher per vehicle and PRB policy. Cannot be combined.</small></article></div>
        <h2 className="voucher-heading">My vouchers</h2>
        <div className="voucher-grid">{order.vouchers.map((voucher, index) => <article key={voucher.code || index}><span>EMPEROR × HERO INSURE</span><strong>฿{voucher.valueSatang / 100}</strong><code>{voucher.code || "ISSUED AFTER PAYMENT"}</code><small>Status: {voucher.status}{voucher.expiryDate.startsWith("CONFIGURE_") ? " · Expiry confirmed when issued" : ` · Expires ${voucher.expiryDate}`}</small></article>)}</div>
      </>}
    </section>
  </main>;
}
