"use client";

import { useMemo, useState } from "react";

export default function RewardsPage() {
  const [amount, setAmount] = useState("1498");
  const points = useMemo(() => {
    const value = Number(String(amount).replace(/,/g, ""));
    return Number.isFinite(value) && value > 0 ? Math.floor(value / 100) : 0;
  }, [amount]);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#2d050d 0%,#650c1c 40%,#f8ead2 40%,#fffaf1 100%)", fontFamily: 'Arial, Helvetica, "Noto Sans Thai", sans-serif', color: "#2d171c", padding: "18px 14px 40px" }}>
      <div style={{ width: "min(760px,100%)", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff4dd", margin: "4px 2px 18px" }}>
          <a href="/" style={{ color: "#fff4dd", textDecoration: "none", fontFamily: "Georgia,serif", fontWeight: 700, letterSpacing: ".08em" }}>♛ EMPEROR FOODS</a>
          <a href="/" style={{ color: "#f8dda0", textDecoration: "none", fontSize: 14 }}>กลับหน้าร้าน / Store</a>
        </div>

        <section style={{ background: "linear-gradient(145deg,#fff8e7,#fffdf8)", border: "1px solid #e5c779", borderRadius: 24, padding: "24px 20px", boxShadow: "0 22px 55px rgba(29,0,8,.22)", textAlign: "center" }}>
          <div style={{ fontSize: 38 }}>🦆</div>
          <h1 style={{ margin: "5px 0 2px", color: "#5a0b18", fontFamily: "Georgia,serif", fontSize: "clamp(30px,8vw,48px)", lineHeight: 1.05 }}>EMPEROR Rewards</h1>
          <h2 style={{ margin: "6px 0 18px", color: "#7b5a31", fontSize: 16 }}>สั่ง Emperor Duck · รับ Points · ใช้สิทธิ์ในเครือ HERO</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, margin: "18px 0" }}>
            <div style={{ padding: "15px 8px", borderRadius: 18, background: "#5f0a19", color: "#fff" }}>
              <small>ค่าส่งแช่เย็นทั่วไทย</small>
              <b style={{ display: "block", fontSize: 29 }}>฿200</b>
            </div>
            <div style={{ fontSize: 27, color: "#9b6b18" }}>→</div>
            <div style={{ padding: "15px 8px", borderRadius: 18, background: "linear-gradient(135deg,#fff0a5,#e7bb42)", color: "#5b3300" }}>
              <small>รับ</small>
              <b style={{ display: "block", fontSize: 29 }}>200</b>
              <small>HERO Credits</small>
            </div>
          </div>

          <div style={{ background: "#f8efe0", borderRadius: 18, padding: 17, textAlign: "left", margin: "16px 0" }}>
            <h3 style={{ margin: "0 0 8px", color: "#5a0b18" }}>Points จากยอดซื้อ</h3>
            <p style={{ margin: "5px 0", lineHeight: 1.5 }}><strong style={{ color: "#7d1326" }}>ทุกยอดครบ 100 บาท = 1 Point</strong></p>
            <p style={{ margin: "5px 0", lineHeight: 1.5 }}>คิดเฉพาะจำนวนเต็มของหลักร้อย — เศษไม่ปัดขึ้น</p>
            <p style={{ margin: "5px 0", lineHeight: 1.5 }}><strong>ตัวอย่าง ฿1,498 = 14 Points</strong></p>
          </div>

          <div style={{ marginTop: 18, background: "#fff", borderRadius: 20, padding: 18, textAlign: "left", border: "1px solid #eadbc3" }}>
            <label htmlFor="purchase" style={{ display: "block", fontWeight: 800, marginBottom: 8 }}>ลองคำนวณยอดซื้อของคุณ</label>
            <input id="purchase" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="เช่น 1498" style={{ width: "100%", fontSize: 22, padding: 13, border: "1px solid #d8c7af", borderRadius: 12 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <div style={{ borderRadius: 14, padding: 13, textAlign: "center", background: "#fff8e9", border: "1px solid #ecd7aa" }}>
                <small>Purchase Points</small>
                <b style={{ display: "block", color: "#5a0b18", fontSize: 28 }}>{points}</b>
              </div>
              <div style={{ borderRadius: 14, padding: 13, textAlign: "center", background: "#eef6ff", border: "1px solid #b6d8f3" }}>
                <small>Delivery HERO Credits</small>
                <b style={{ display: "block", color: "#075da8", fontSize: 28 }}>200</b>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, borderRadius: 18, padding: 17, background: "linear-gradient(135deg,#eef7ff,#fff0f4)", border: "1px solid #bed9ee", textAlign: "left" }}>
            <b style={{ color: "#075da8", fontSize: 20 }}>200 HERO Credits = ส่วนลดประกัน พ.ร.บ. 200 บาท</b>
            <p style={{ margin: "7px 0 0", lineHeight: 1.5 }}>ใช้กับ HERO Insure และสิทธิประโยชน์อื่นในเครือ HERO ที่ร่วมรายการ</p>
          </div>

          <a href="/" style={{ display: "block", marginTop: 16, background: "linear-gradient(135deg,#063f79,#0873bd)", color: "#fff", textDecoration: "none", textAlign: "center", padding: 15, borderRadius: 14, fontWeight: 800 }}>สั่ง Emperor Duck / Order Now</a>
          <p style={{ fontSize: 12, color: "#79665d", lineHeight: 1.5, marginTop: 12 }}>หน้านี้เป็นจุดหมายถาวรสำหรับ QR ของ EMPEROR Rewards. Points และ HERO Credits จะยืนยันตามคำสั่งซื้อและเงื่อนไขรายการส่งเสริมการขาย.</p>
        </section>
      </div>
    </main>
  );
}
