// Cloudflare Pages customer shell for EMPEROR FOODS.
const APP_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";
const DEFAULT_HERO_PAY_ORIGIN = "https://hero-pay-website.pages.dev";

const STORE_PATCH = `<script>
(() => {
  const clean = (value) => (value || "").replace(/\\s+/g, " ").trim();
  const wholeDuckText = /เป็ดรมควัน|Whole\\s+(Sugarcane-)?Smoked\\s+Duck|Whole.*Duck|甘蔗烟熏整鸭/i;
  const otherProductText = /อกเป็ดรมควัน|น่องสะโพก|หมูรมควัน|ลิ้นหมู|สามกษัตริย์|Smoked Duck Breast|Smoked Duck Thigh|Smoked Pork|Pig.?s Tongue/i;
  const sizeText = /ขนาดเล็ก|ขนาดกลาง|ขนาดใหญ่|Small|Medium|Large|ประมาณ\\s*1\\.[123]|1\\.[123]\\s*(kg|กก)/i;

  function leaves(root = document.body) {
    return [...root.querySelectorAll("*")].filter((el) => el.children.length === 0);
  }

  function exactPrice(el, value) {
    return new RegExp("^(?:฿|บาท\\\\s*)?" + value + "(?:\\\\s*บาท)?$").test(clean(el.textContent));
  }

  function findWholeDuckCard(priceEl, price) {
    let node = priceEl;
    let candidate = null;
    for (let i = 0; i < 10 && node && node !== document.body; i++, node = node.parentElement) {
      const text = clean(node.textContent);
      if (otherProductText.test(text)) break;
      if (text.includes(String(price)) && wholeDuckText.test(text)) {
        candidate = node;
        if (node.querySelector("img,picture") && sizeText.test(text)) break;
      }
      if (text.length > 1800) break;
    }
    return candidate;
  }

  function hideExtraDuckCards() {
    const all = leaves();
    for (const price of [890, 990]) {
      for (const priceEl of all.filter((el) => exactPrice(el, price))) {
        const card = findWholeDuckCard(priceEl, price);
        if (card && card !== document.body) {
          card.style.setProperty("display", "none", "important");
          card.setAttribute("aria-hidden", "true");
          card.dataset.emperorHiddenDuckSize = String(price);
        }
      }
    }
  }

  function normalize790Card() {
    const all = leaves();
    for (const priceEl of all.filter((el) => exactPrice(el, 790))) {
      const card = findWholeDuckCard(priceEl, 790);
      if (!card || card === document.body) continue;
      for (const el of leaves(card)) {
        const text = clean(el.textContent);
        if (!text) continue;
        if (/^เป็ดรมควัน(?:อบ)?ชานอ้อย.*ขนาด(เล็ก|กลาง|ใหญ่)$/i.test(text) || /^เป็ดรมควัน\\s+ขนาด(เล็ก|กลาง|ใหญ่)$/i.test(text)) {
          el.textContent = "เป็ดรมควันอบชานอ้อย";
          continue;
        }
        if (/^Whole.*Duck.*(Small|Medium|Large)$/i.test(text)) {
          el.textContent = "Whole Sugarcane-Smoked Duck";
          continue;
        }
        if (/^甘蔗烟熏整鸭.*(小|中|大)/.test(text)) {
          el.textContent = "甘蔗烟熏整鸭";
          continue;
        }
        if (sizeText.test(text)) el.style.setProperty("display", "none", "important");
      }
      card.dataset.emperorSingleWholeDuck = "790";
    }
  }

  function patchSummaryRows() {
    const all = leaves();
    for (const price of [890, 990]) {
      for (const el of all.filter((node) => exactPrice(node, price))) {
        let row = el;
        for (let i = 0; i < 5 && row.parentElement && row.parentElement !== document.body; i++) {
          const parent = row.parentElement;
          const text = clean(parent.textContent);
          if (otherProductText.test(text)) break;
          if (text.includes(String(price)) && text.length < 300) row = parent;
          else break;
        }
        if (clean(row.textContent).includes(String(price)) && !clean(row.textContent).includes("790")) {
          row.style.setProperty("display", "none", "important");
        }
      }
    }
  }

  function patchKnownText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parentText = clean(node.parentElement?.textContent);
      let value = node.nodeValue || "";
      if ((/ส่ง|delivery/i.test(parentText)) && /120\\s*บาท/.test(value)) value = value.replace(/120\\s*บาท/g, "200 บาท");
      if ((/อกเป็ดรมควัน|Smoked Duck Breast/i.test(parentText)) && /599/.test(value)) value = value.replace(/599/g, "590");
      if ((/ลิ้นหมู|Pig.?s Tongue/i.test(parentText)) && /499/.test(value)) value = value.replace(/499/g, "490");
      node.nodeValue = value;
    }
  }

  function ensurePromptPayStyles() {
    if (document.getElementById("emperor-promptpay-style")) return;
    const style = document.createElement("style");
    style.id = "emperor-promptpay-style";
    style.textContent = ".emperor-promptpay-pay{display:block;width:100%;margin:16px 0 8px;padding:15px 18px;border-radius:14px;background:linear-gradient(135deg,#083d77,#0b6fb8);color:#fff!important;text-decoration:none!important;text-align:center;font-weight:800;box-shadow:0 8px 24px rgba(4,62,116,.22)}.emperor-promptpay-pay small{display:block;margin-top:4px;font-weight:600;opacity:.9}.emperor-promptpay-note{margin:8px 0 0;font-size:12px;line-height:1.45;color:#6a5b55}";
    document.head.appendChild(style);
  }

  function forcePromptPayOnly() {
    for (const select of document.querySelectorAll("select")) {
      const option = select.querySelector('option[value="promptpay"]');
      if (!option) continue;
      select.value = "promptpay";
      for (const child of [...select.options]) if (child.value !== "promptpay") child.disabled = true;
    }
  }

  function injectPromptPayButton() {
    ensurePromptPayStyles();
    forcePromptPayOnly();
    const payment = window.__emperorPromptPayCheckout;
    if (!payment?.checkoutUrl) return;
    const result = document.querySelector(".order-result") || [...document.querySelectorAll("section,div")].find((el) => clean(el.textContent).includes(payment.orderNo || "") && clean(el.textContent).length < 1800);
    if (!result || result.querySelector("[data-emperor-promptpay]")) return;
    const link = document.createElement("a");
    link.dataset.emperorPromptpay = "true";
    link.className = "emperor-promptpay-pay";
    link.href = payment.checkoutUrl;
    link.target = "_top";
    link.rel = "noopener";
    link.innerHTML = "ชำระด้วย PromptPay QR ผ่าน HERO PAY<small>Pay securely with PromptPay QR</small>";
    const note = document.createElement("p");
    note.className = "emperor-promptpay-note";
    note.textContent = "ยอดชำระถูกล็อกจากคำสั่งซื้อ ระบบจะสร้าง Dynamic QR สำหรับรายการนี้โดยเฉพาะ";
    result.appendChild(link);
    result.appendChild(note);
  }

  function installOrderPaymentBridge() {
    if (window.__emperorPaymentBridgeInstalled) return;
    window.__emperorPaymentBridgeInstalled = true;
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url || "";
      const isOrder = /\\/api\\/orders(?:\\?|$)/.test(url) && String(init.method || "GET").toUpperCase() === "POST";
      const response = await originalFetch(input, init);
      if (!isOrder || !response.ok) return response;
      try {
        const result = await response.clone().json();
        const orderNo = result?.orderNo || result?.order_no;
        const publicToken = result?.publicToken || result?.public_token;
        if (orderNo && publicToken) {
          const payResponse = await originalFetch("/api/hero-pay/session", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ order_id: orderNo, public_token: publicToken, description: "EMPEROR FOODS order " + orderNo })
          });
          const payData = await payResponse.json().catch(() => null);
          if (payResponse.ok && payData?.checkout_url) {
            window.__emperorPromptPayCheckout = { orderNo, checkoutUrl: payData.checkout_url };
            setTimeout(injectPromptPayButton, 0);
            setTimeout(injectPromptPayButton, 250);
            setTimeout(injectPromptPayButton, 900);
          }
        }
      } catch {}
      return response;
    };
  }

  function patchAll() {
    hideExtraDuckCards();
    normalize790Card();
    patchSummaryRows();
    patchKnownText();
    forcePromptPayOnly();
    injectPromptPayButton();
  }

  installOrderPaymentBridge();
  let timer;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(patchAll, 100); };
  new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  patchAll();
  setTimeout(patchAll, 400);
  setTimeout(patchAll, 1200);
  setTimeout(patchAll, 3000);
})();
<\/script>`;

const CUSTOMER_SHELL = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>EMPEROR FOODS | Emperor Duck เป็ดจักรพรรดิ</title>
<meta name="description" content="EMPEROR DUCK — ค่าส่งแช่เย็น ทั่วไทย 200 บาท รับ 200 เครดิต">
<meta name="theme-color" content="#f8f0df">
<style>
:root{--cream:#f8f0df;--wine:#6b1020;--wine-deep:#310611;--gold:#c99b32;--ink:#2c1820}
*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;background:var(--cream);overflow:hidden}body{font-family:Arial,Helvetica,"Noto Sans Thai",sans-serif}
.app-frame{position:fixed;inset:0;width:100%;height:100dvh;border:0;background:var(--cream);opacity:0;transform:scale(1.006);transition:opacity .7s ease,transform 1s ease}.app-frame.is-ready{opacity:1;transform:none}
.menu-toggle{position:fixed;z-index:22;right:12px;bottom:max(12px,env(safe-area-inset-bottom));max-width:calc(100vw - 24px);border:1px solid rgba(255,255,255,.34);border-radius:22px;padding:10px 16px;background:linear-gradient(135deg,#5c0617,#8b1830);color:#fff8e9;box-shadow:0 10px 30px rgba(35,0,9,.28);font-weight:800;font-size:14px;line-height:1.35;text-align:center;cursor:pointer}.menu-toggle strong{display:block;color:#f3cf77;font-size:16px}
.menu-backdrop{position:fixed;z-index:23;inset:0;background:rgba(18,3,8,.52);opacity:0;visibility:hidden;transition:.25s ease}.menu-backdrop.is-open{opacity:1;visibility:visible}
.menu-drawer{position:fixed;z-index:24;top:0;right:0;width:min(92vw,430px);height:100dvh;background:#fffaf0;color:var(--ink);box-shadow:-22px 0 60px rgba(31,0,9,.3);transform:translateX(103%);transition:transform .32s cubic-bezier(.2,.8,.2,1);overflow:auto;padding:22px 20px calc(34px + env(safe-area-inset-bottom))}.menu-drawer.is-open{transform:none}
.menu-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid #eadcc5}.menu-head small{display:block;color:#8d6d4d;font-weight:700;letter-spacing:.08em;margin-bottom:4px}.menu-head h2{margin:0;color:var(--wine-deep);font:700 27px/1.05 Georgia,serif}.close-menu{border:1px solid #e2d3bb;background:#fff;color:var(--wine);border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer}
.delivery-card,.benefit-card,.payment-card{margin:14px 0;padding:14px 15px;border-radius:14px;line-height:1.5}.delivery-card{border:1px solid #dfbd66;background:linear-gradient(135deg,#fff3c9,#fff9e8);color:#5d3207}.benefit-card{border:1px solid #f0b3c1;background:linear-gradient(135deg,#fff0f5,#f3f7ff);color:#4d2130}.payment-card{border:1px solid #9ac7ed;background:linear-gradient(135deg,#eef8ff,#f7fbff);color:#123f66}.delivery-card b,.benefit-card b,.payment-card b{font-size:20px}.delivery-card b,.benefit-card b{color:#851426}.payment-card b{color:#075c9c}.payment-card small{display:block;margin-top:3px}
.menu-list{display:grid;border-top:1px solid #eadcc5}.menu-row{display:grid;grid-template-columns:1fr auto;gap:14px;padding:13px 2px;border-bottom:1px solid #eadcc5}.menu-row b{font-size:15px}.menu-row small{display:block;margin-top:3px;color:#816f67;line-height:1.4}.menu-price{color:#8a1023;font:700 20px/1 Georgia,serif;white-space:nowrap}.menu-note{margin-top:16px;color:#76625b;font-size:12px;line-height:1.55}
.intro{position:fixed;z-index:30;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 44%,rgba(234,212,154,.28),transparent 30%),linear-gradient(145deg,#fffaf0 0%,#f8f0df 52%,#f2e5cc 100%);color:var(--wine);transition:opacity .85s ease,visibility .85s ease}.intro::after{content:"";position:absolute;left:-35%;top:0;width:28%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);transform:skewX(-18deg);animation:lightSweep 2.7s .35s cubic-bezier(.22,.7,.24,1) both}.intro.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
.intro-lockup{position:relative;width:min(78vw,560px);display:grid;place-items:center;text-align:center}.crown{margin-bottom:18px;color:var(--gold);font:400 clamp(37px,8vw,61px)/1 Georgia,serif;opacity:0;transform:translateY(-18px) scale(.82);animation:crownIn .85s .15s cubic-bezier(.2,.8,.2,1.2) forwards}.word-emperor{margin:0;color:var(--wine-deep);font:400 clamp(33px,8.8vw,73px)/1 Georgia,serif;letter-spacing:.2em;text-indent:.2em;opacity:0;filter:blur(7px);transform:scale(.96);animation:wordIn 1s .58s ease forwards}.word-foods{margin:14px 0 0;color:var(--wine);font-weight:700;font-size:clamp(11px,2.8vw,17px);letter-spacing:.72em;text-indent:.72em;opacity:0;transform:translateY(9px);animation:foodsIn .75s 1.05s ease forwards}.rule{width:min(64vw,390px);height:1px;margin-top:28px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);animation:ruleIn .85s 1.18s ease forwards}.tagline{margin:17px 0 0;color:#816e5f;font-size:clamp(8px,2vw,11px);font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:0;animation:foodsIn .7s 1.45s ease forwards}
.fallback{position:fixed;z-index:31;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%);color:var(--wine);font-size:11px;opacity:0;transition:.3s}
@keyframes crownIn{to{opacity:1;transform:none}}@keyframes wordIn{to{opacity:1;filter:blur(0);transform:none}}@keyframes foodsIn{to{opacity:1;transform:none}}@keyframes ruleIn{to{transform:scaleX(1)}}@keyframes lightSweep{0%{transform:translateX(0) skewX(-18deg);opacity:0}18%{opacity:.55}100%{transform:translateX(620%) skewX(-18deg);opacity:0}}
@media(max-width:600px){.menu-toggle{font-size:13px;padding:9px 14px}.menu-toggle strong{font-size:15px}}@media(prefers-reduced-motion:reduce){.intro::after{display:none}}
</style>
</head>
<body>
<iframe id="emperor-app" class="app-frame" title="EMPEROR FOODS online ordering" src="/store/" allow="payment *; clipboard-write"></iframe>
<button id="menu-toggle" class="menu-toggle" type="button" aria-controls="current-menu" aria-expanded="false"><span>ค่าส่งแช่เย็น ทั่วไทย 200 บาท</span><strong>รับ 200 เครดิต</strong></button>
<div id="menu-backdrop" class="menu-backdrop" aria-hidden="true"></div>
<aside id="current-menu" class="menu-drawer" aria-label="Emperor Duck current menu" aria-hidden="true">
<div class="menu-head"><div><small>EMPEROR DUCK · CURRENT MENU</small><h2>เมนูและราคาปัจจุบัน</h2></div><button id="close-menu" class="close-menu" type="button" aria-label="Close menu">×</button></div>
<div class="delivery-card"><b>ค่าส่งแช่เย็น ทั่วไทย 200 บาท</b><br><small>Chilled delivery nationwide · flat rate 200 Baht</small></div>
<div class="benefit-card"><b>รับ 200 เครดิต</b><br><small>Receive 200 Credits</small></div>
<div class="payment-card"><b>PromptPay QR · HERO PAY</b><small>Dynamic QR ตามยอดคำสั่งซื้อ · Secure server-side checkout</small></div>
<div class="menu-list">
<div class="menu-row"><div><b>เป็ดรมควันอบชานอ้อย</b><small>Whole Sugarcane-Smoked Duck</small></div><div class="menu-price">฿790</div></div>
<div class="menu-row"><div><b>อกเป็ดรมควัน</b><small>Smoked Duck Breast · 1 ชิ้น</small></div><div class="menu-price">฿169</div></div>
<div class="menu-row"><div><b>อกเป็ดรมควัน Family Pack</b><small>Smoked Duck Breast · 4 ชิ้น</small></div><div class="menu-price">฿590</div></div>
<div class="menu-row"><div><b>น่องสะโพกเป็ดรมควัน</b><small>Smoked Duck Thigh</small></div><div class="menu-price">฿189</div></div>
<div class="menu-row"><div><b>หมูรมควัน</b><small>Smoked Pork</small></div><div class="menu-price">฿429</div></div>
<div class="menu-row"><div><b>คอหมูรมควัน</b><small>Smoked Pork Neck</small></div><div class="menu-price">฿479</div></div>
<div class="menu-row"><div><b>ลิ้นหมูรมควัน</b><small>Smoked Pig’s Tongue · ประมาณ 330 กรัม</small></div><div class="menu-price">฿490</div></div>
<div class="menu-row"><div><b>ชุดสามกษัตริย์</b><small>อกเป็ดรมควัน 1 + หมูรมควัน 1 + สามชั้นรมควัน 1 · ประมาณ 500 กรัม</small></div><div class="menu-price">฿490</div></div>
</div><p class="menu-note">ค่าส่งแช่เย็น ทั่วไทย 200 บาท · รับ 200 เครดิต · ชำระผ่าน PromptPay QR โดย HERO PAY</p></aside>
<section id="emperor-intro" class="intro" aria-label="EMPEROR FOODS introduction"><div class="intro-lockup"><div class="crown" aria-hidden="true">♛</div><h1 class="word-emperor">EMPEROR</h1><p class="word-foods">FOODS</p><div class="rule"></div><p class="tagline">Premium Asian Lifestyle</p></div></section>
<a id="fallback" class="fallback" href="${APP_ORIGIN}/">Open EMPEROR FOODS</a>
<script>(()=>{const frame=document.getElementById("emperor-app"),intro=document.getElementById("emperor-intro"),toggle=document.getElementById("menu-toggle"),drawer=document.getElementById("current-menu"),backdrop=document.getElementById("menu-backdrop"),close=document.getElementById("close-menu"),startedAt=performance.now(),reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches,minimumIntro=reduceMotion?450:2800;let revealed=false;const revealApp=()=>{if(revealed)return;revealed=true;frame.classList.add("is-ready");intro.classList.add("is-leaving");setTimeout(()=>intro.remove(),reduceMotion?350:950)};const setMenu=open=>{drawer.classList.toggle("is-open",open);backdrop.classList.toggle("is-open",open);drawer.setAttribute("aria-hidden",String(!open));backdrop.setAttribute("aria-hidden",String(!open));toggle.setAttribute("aria-expanded",String(open))};toggle.addEventListener("click",()=>setMenu(!drawer.classList.contains("is-open")));close.addEventListener("click",()=>setMenu(false));backdrop.addEventListener("click",()=>setMenu(false));document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});frame.addEventListener("load",()=>{const remaining=Math.max(0,minimumIntro-(performance.now()-startedAt));setTimeout(revealApp,remaining)},{once:true});setTimeout(revealApp,6000)})();</script>
</body></html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}

function heroPayOrigin(env) {
  const configured = String(env?.HERO_PAY_BASE_URL || DEFAULT_HERO_PAY_ORIGIN).trim();
  try { return new URL(configured).origin; } catch { return DEFAULT_HERO_PAY_ORIGIN; }
}

async function createHeroPaySession(request, env, publicUrl) {
  if (!env?.HERO_PAY_INTERNAL_API_KEY) {
    return json({ ok: false, code: "HERO_PAY_MERCHANT_KEY_REQUIRED", message: "EMPEROR FOODS is wired to HERO PAY, but its server-side HERO PAY key has not been configured in Cloudflare yet." }, 503);
  }
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, code: "INVALID_JSON", message: "Request body must be JSON." }, 400); }
  const orderId = String(body.order_id || body.orderId || "").trim().slice(0, 80);
  const publicToken = String(body.public_token || body.publicToken || "").trim().slice(0, 100);
  if (!orderId || !publicToken) {
    return json({ ok: false, code: "INVALID_PAYMENT_REQUEST", message: "A valid order reference and order token are required." }, 400);
  }
  let orderResponse;
  try {
    orderResponse = await fetch(APP_ORIGIN + "/api/orders/status?token=" + encodeURIComponent(publicToken), { headers: { "accept": "application/json" } });
  } catch {
    return json({ ok: false, code: "ORDER_STATUS_UNREACHABLE", message: "Could not verify the order amount." }, 502);
  }
  if (!orderResponse.ok) return json({ ok: false, code: "ORDER_NOT_VERIFIED", message: "The order could not be verified." }, 400);
  const order = await orderResponse.json().catch(() => null);
  if (!order || String(order.orderNo || "") !== orderId) return json({ ok: false, code: "ORDER_MISMATCH", message: "Order reference does not match." }, 400);
  if (String(order.paymentStatus || "").toLowerCase() === "paid") return json({ ok: false, code: "ORDER_ALREADY_PAID", message: "This order is already paid." }, 409);
  const subtotalSatang = Number(order.subtotalSatang);
  if (!Number.isInteger(subtotalSatang) || subtotalSatang <= 0) return json({ ok: false, code: "ORDER_AMOUNT_INVALID", message: "Verified order amount is invalid." }, 400);
  const amount = (subtotalSatang + 20000) / 100;
  if (amount > 150000) return json({ ok: false, code: "ORDER_AMOUNT_TOO_HIGH", message: "Order amount exceeds checkout limit." }, 400);
  const origin = heroPayOrigin(env);
  const payload = {
    merchant: "EMPEROR-FOODS",
    order_id: orderId,
    amount,
    description: String(body.description || ("EMPEROR FOODS order " + orderId)).trim().slice(0, 180),
    return_url: publicUrl.origin + "/?payment=return&order=" + encodeURIComponent(orderId),
    expires_in: 900
  };
  let response;
  try {
    response = await fetch(origin + "/api/payments/session", {
      method: "POST",
      headers: { "authorization": "Bearer " + env.HERO_PAY_INTERNAL_API_KEY, "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    return json({ ok: false, code: "HERO_PAY_UNREACHABLE", message: "Could not reach HERO PAY." }, 502);
  }
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { ok: false, code: "HERO_PAY_INVALID_RESPONSE" }; }
  return json(data, response.status);
}

async function heroPayHealth(env) {
  const origin = heroPayOrigin(env);
  const merchantBridgeConfigured = Boolean(env?.HERO_PAY_INTERNAL_API_KEY);
  let provider = null;
  try {
    const response = await fetch(origin + "/api/payments/health", { headers: { "accept": "application/json" } });
    provider = await response.json();
  } catch {}
  return json({ ok: true, service: "EMPEROR FOODS → HERO PAY PromptPay bridge", hero_pay_origin: origin, merchant_bridge_configured: merchantBridgeConfigured, provider });
}

function rewriteLocation(value, publicOrigin) {
  if (!value) return value;
  return value.replace(APP_ORIGIN, publicOrigin);
}

function upstreamUrlFor(publicUrl) {
  let path = publicUrl.pathname;
  if (path === "/store" || path === "/store/") path = "/";
  else if (path.startsWith("/store/")) path = path.slice(6) || "/";
  return new URL(path + publicUrl.search, APP_ORIGIN);
}

export default {
  async fetch(request, env) {
    const publicUrl = new URL(request.url);
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");

    if (publicUrl.pathname === "/api/hero-pay/health" && request.method === "GET") return heroPayHealth(env);
    if (publicUrl.pathname === "/api/hero-pay/session" && request.method === "POST") return createHeroPaySession(request, env, publicUrl);

    if (request.method === "GET" && publicUrl.pathname === "/" && acceptsHtml) {
      return new Response(CUSTOMER_SHELL, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy": `frame-src 'self' ${APP_ORIGIN}; default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'`,
          "x-content-type-options": "nosniff"
        }
      });
    }

    const upstreamUrl = upstreamUrlFor(publicUrl);
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", publicUrl.host);
    headers.set("x-forwarded-proto", "https");
    const upstreamResponse = await fetch(new Request(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual"
    }));

    const responseHeaders = new Headers(upstreamResponse.headers);
    const location = responseHeaders.get("location");
    if (location) responseHeaders.set("location", rewriteLocation(location, publicUrl.origin));
    const contentType = responseHeaders.get("content-type") || "";
    if (request.method === "GET" && (publicUrl.pathname === "/store" || publicUrl.pathname.startsWith("/store/")) && contentType.includes("text/html")) {
      let html = await upstreamResponse.text();
      html = html.includes("</body>") ? html.replace("</body>", STORE_PATCH + "</body>") : html + STORE_PATCH;
      responseHeaders.delete("content-length");
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-security-policy");
      responseHeaders.delete("x-frame-options");
      responseHeaders.set("cache-control", "no-store");
      return new Response(html, { status: upstreamResponse.status, statusText: upstreamResponse.statusText, headers: responseHeaders });
    }

    return new Response(upstreamResponse.body, { status: upstreamResponse.status, statusText: upstreamResponse.statusText, headers: responseHeaders });
  }
};
