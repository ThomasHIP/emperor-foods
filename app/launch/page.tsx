"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  emoji: string;
};

type Voucher = {
  code: string;
  orderId: string;
  value: number;
  status: "AVAILABLE" | "REDEEMED";
  redeemUrl: string;
};

const PRODUCTS: Product[] = [
  { id: "mooncake", name: "Pink–Blue Mooncake", subtitle: "Every piece earns one HERO Insure voucher", price: 200, emoji: "🥮" },
  { id: "duck", name: "Emperor Smoked Duck", subtitle: "Qualifying promotional product", price: 690, emoji: "🦆" },
];

function randomBlock(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function createOrderId() {
  return `EMP-${new Date().getFullYear()}-${randomBlock(7)}`;
}

function createVoucherCode() {
  return `HI-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`;
}

export default function LaunchPage() {
  const [cart, setCart] = useState<Record<string, number>>({ mooncake: 1 });
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [step, setStep] = useState<"shop" | "checkout" | "success">("shop");
  const [orderId, setOrderId] = useState("");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const lines = useMemo(
    () => PRODUCTS.map((product) => ({ ...product, quantity: cart[product.id] || 0 })).filter((item) => item.quantity > 0),
    [cart],
  );

  const subtotal = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const eligiblePieces = lines.reduce((sum, item) => sum + item.quantity, 0);

  function updateQuantity(productId: string, delta: number) {
    setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] || 0) + delta) }));
  }

  function placeOrder(event: FormEvent) {
    event.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || eligiblePieces === 0) return;

    const newOrderId = createOrderId();
    const generated = Array.from({ length: eligiblePieces }, () => {
      const code = createVoucherCode();
      return {
        code,
        orderId: newOrderId,
        value: 200,
        status: "AVAILABLE" as const,
        redeemUrl: `https://heroinsure.successconnection.co.th/redeem?code=${encodeURIComponent(code)}`,
      };
    });

    setOrderId(newOrderId);
    setVouchers(generated);
    setStep("success");
  }

  return (
    <main className="launch-shell">
      <style>{`
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5ecdc; color: #3b1018; font-family: Arial, sans-serif; }
        .launch-shell { min-height: 100vh; background: linear-gradient(180deg,#fffaf1 0%,#f4ead8 100%); }
        .topbar { background:#36000c; color:#f4d58b; padding:18px 22px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:10; }
        .brand { font-family: Georgia,serif; font-size:21px; letter-spacing:2px; font-weight:700; }
        .cart-pill { border:1px solid #d8aa4f; border-radius:999px; padding:9px 14px; color:white; }
        .hero { padding:58px 22px 38px; background:radial-gradient(circle at top right,#8d1029 0,#510010 44%,#260007 100%); color:white; }
        .hero-inner,.section { max-width:1100px; margin:auto; }
        .kicker { color:#e4bd68; text-transform:uppercase; letter-spacing:3px; font-size:12px; font-weight:700; }
        h1 { font-family:Georgia,serif; font-size:clamp(42px,8vw,82px); line-height:.95; margin:16px 0 20px; max-width:850px; }
        .hero p { max-width:680px; color:#f0deda; font-size:18px; line-height:1.7; }
        .credit-banner { display:inline-flex; gap:12px; align-items:center; margin-top:18px; padding:14px 18px; border:1px solid #d8aa4f; border-radius:16px; background:rgba(255,255,255,.06); }
        .credit-banner strong { font-size:26px; color:#f6cf74; }
        .section { padding:44px 22px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px; }
        .card { background:#fffaf3; border:1px solid #dfcfb5; border-radius:20px; overflow:hidden; box-shadow:0 12px 35px rgba(66,22,12,.08); }
        .product-art { height:200px; display:grid; place-items:center; font-size:90px; background:linear-gradient(135deg,#f4a9bb,#84a9e8); }
        .card-body { padding:22px; }
        .card h2 { font-family:Georgia,serif; margin:0 0 8px; font-size:28px; }
        .muted { color:#7a6863; line-height:1.5; }
        .price { color:#8b001d; font-size:30px; font-family:Georgia,serif; margin:18px 0; }
        .qty { display:flex; align-items:center; gap:12px; }
        button { cursor:pointer; border:0; }
        .qty button { width:40px; height:40px; border-radius:50%; background:#3b1018; color:white; font-size:22px; }
        .qty span { min-width:25px; text-align:center; font-weight:700; }
        .primary { width:100%; padding:17px 20px; border-radius:12px; background:#a30d2a; color:white; font-weight:800; font-size:17px; }
        .secondary { width:100%; padding:15px 20px; border:1px solid #8b001d; border-radius:12px; background:transparent; color:#6b0016; font-weight:700; }
        .summary { background:#31000b; color:white; border-radius:22px; padding:24px; margin-top:25px; display:grid; gap:15px; }
        .summary-row { display:flex; justify-content:space-between; gap:20px; }
        .summary strong { color:#f1cb74; }
        .checkout-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr); gap:22px; }
        .panel { background:#fffdf8; border:1px solid #ddcfba; border-radius:20px; padding:24px; }
        .panel h2 { font-family:Georgia,serif; font-size:32px; margin-top:0; }
        label { display:grid; gap:7px; color:#604f49; font-weight:700; margin-bottom:15px; }
        input, textarea { width:100%; border:1px solid #cfbda4; border-radius:10px; padding:13px 14px; font:inherit; background:white; }
        textarea { min-height:90px; resize:vertical; }
        .notice { background:#fff2cc; border:1px solid #d9b75d; padding:14px; border-radius:12px; color:#5c4300; line-height:1.5; margin:14px 0; }
        .success { text-align:center; padding-top:55px; }
        .success h1 { color:#48000e; margin-inline:auto; }
        .order-id { font-family:monospace; font-size:24px; letter-spacing:1px; padding:13px; border:1px dashed #a37a38; display:inline-block; border-radius:10px; background:#fffaf0; }
        .voucher-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(310px,1fr)); gap:20px; margin-top:30px; }
        .voucher { background:#fffdf8; border:1px solid #d8c49f; border-radius:22px; overflow:hidden; text-align:left; box-shadow:0 15px 35px rgba(54,0,12,.12); }
        .voucher-head { background:#081f45; color:white; padding:18px 20px; display:flex; justify-content:space-between; }
        .partner-slot { border:1px dashed #d4ae62; color:#d4ae62; padding:5px 8px; border-radius:7px; font-size:11px; }
        .voucher-body { padding:22px; }
        .voucher-value { font-size:50px; color:#b20a36; font-family:Georgia,serif; font-weight:700; }
        .voucher-code { font-family:monospace; font-size:20px; font-weight:800; background:#f1e6d2; padding:11px; border-radius:9px; margin:14px 0; text-align:center; }
        .qr { display:grid; place-items:center; background:white; border:1px solid #dcc8a8; border-radius:14px; padding:12px; }
        .qr img { width:180px; height:180px; }
        .terms { font-size:12px; color:#71635d; line-height:1.5; margin-top:13px; }
        @media (max-width:760px){ .checkout-grid{grid-template-columns:1fr;} .hero{padding-top:42px;} .section{padding-inline:16px;} }
      `}</style>

      <header className="topbar">
        <div className="brand">♛ EMPEROR FOODS</div>
        <div className="cart-pill">Cart · {eligiblePieces}</div>
      </header>

      {step !== "success" && (
        <section className="hero">
          <div className="hero-inner">
            <div className="kicker">EMPEROR × HERO INSURE</div>
            <h1>Purchase with meaning. Reward every piece.</h1>
            <p>Every qualifying EMPEROR product generates its own unique HERO Insure voucher after confirmed payment. Redeem each voucher for a ฿200 discount on one PRB or one Voluntary motor insurance policy.</p>
            <div className="credit-banner"><strong>฿200</strong><span>One product · One voucher · One insurance policy</span></div>
          </div>
        </section>
      )}

      {step === "shop" && (
        <section className="section">
          <div className="kicker">Launch collection</div>
          <h1 style={{ color: "#46000f", fontSize: "clamp(38px,6vw,62px)" }}>Choose your products</h1>
          <div className="grid">
            {PRODUCTS.map((product) => (
              <article className="card" key={product.id}>
                <div className="product-art">{product.emoji}</div>
                <div className="card-body">
                  <h2>{product.name}</h2>
                  <div className="muted">{product.subtitle}</div>
                  <div className="price">฿{product.price.toLocaleString()}</div>
                  <div className="qty">
                    <button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease quantity">−</button>
                    <span>{cart[product.id] || 0}</span>
                    <button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="summary">
            <div className="summary-row"><span>Products selected</span><strong>{eligiblePieces}</strong></div>
            <div className="summary-row"><span>HERO Insure vouchers after payment</span><strong>{eligiblePieces}</strong></div>
            <div className="summary-row"><span>Subtotal</span><strong>฿{subtotal.toLocaleString()}</strong></div>
            <button className="primary" disabled={eligiblePieces === 0} onClick={() => setStep("checkout")}>Continue to checkout</button>
          </div>
        </section>
      )}

      {step === "checkout" && (
        <section className="section checkout-grid">
          <form className="panel" onSubmit={placeOrder}>
            <div className="kicker">Secure checkout</div>
            <h2>Customer and delivery</h2>
            <label>Full name<input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></label>
            <label>Mobile number<input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></label>
            <label>Email<input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} /></label>
            <label>Delivery address<textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} /></label>
            <div className="notice"><strong>Launch demo:</strong> confirming below simulates successful HERO PAY payment and immediately generates the vouchers. Live payment requires HERO PAY API credentials and payment webhook confirmation.</div>
            <button className="primary" type="submit">Simulate successful HERO PAY payment</button>
            <button className="secondary" type="button" style={{ marginTop: 10 }} onClick={() => setStep("shop")}>Back to products</button>
          </form>

          <aside className="panel">
            <h2>Order summary</h2>
            {lines.map((item) => <div className="summary-row" key={item.id}><span>{item.name} × {item.quantity}</span><strong>฿{(item.price * item.quantity).toLocaleString()}</strong></div>)}
            <hr style={{ border: 0, borderTop: "1px solid #ddcfba", margin: "18px 0" }} />
            <div className="summary-row"><span>Total</span><strong>฿{subtotal.toLocaleString()}</strong></div>
            <div className="summary-row"><span>Vouchers to issue</span><strong>{eligiblePieces}</strong></div>
          </aside>
        </section>
      )}

      {step === "success" && (
        <section className="section success">
          <div className="kicker">Payment confirmed · vouchers issued</div>
          <h1>Thank you, {customer.name}</h1>
          <p className="muted">Your order has been created and each qualifying item has generated one unique HERO Insure voucher.</p>
          <div className="order-id">{orderId}</div>

          <div className="voucher-grid">
            {vouchers.map((voucher, index) => {
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(voucher.redeemUrl)}`;
              return (
                <article className="voucher" key={voucher.code}>
                  <div className="voucher-head"><strong>HERO INSURE VOUCHER</strong><span className="partner-slot">PARTNER BRAND / LOGO</span></div>
                  <div className="voucher-body">
                    <div className="muted">Voucher {index + 1} of {vouchers.length}</div>
                    <div className="voucher-value">฿200</div>
                    <strong>Discount for one insurance policy</strong>
                    <p className="muted">Choose PRB Insurance or Voluntary Motor Insurance.</p>
                    <div className="voucher-code">{voucher.code}</div>
                    <div className="qr"><img src={qrUrl} alt={`QR code for voucher ${voucher.code}`} /><small>Scan to open redemption landing page</small></div>
                    <div className="terms">One voucher may be redeemed once for one eligible insurance policy. It cannot be exchanged for cash or combined with another voucher on the same policy. Final eligibility and expiry are verified by HERO Insure.</div>
                  </div>
                </article>
              );
            })}
          </div>

          <button className="secondary" style={{ maxWidth: 360, marginTop: 28 }} onClick={() => { setCart({ mooncake: 1 }); setCustomer({ name: "", phone: "", email: "", address: "" }); setStep("shop"); setVouchers([]); }}>Create another test order</button>
        </section>
      )}
    </main>
  );
}
