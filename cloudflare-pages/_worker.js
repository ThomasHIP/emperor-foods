// Cloudflare Pages customer shell for the EMPEROR FOODS hosted application.
const APP_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";

const CUSTOMER_SHELL = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>EMPEROR FOODS | Emperor Duck เป็ดจักรพรรดิ</title>
  <meta name="description" content="EMPEROR FOODS — Emperor Duck sugarcane-smoked duck and meats. Chilled delivery nationwide ฿200 flat rate. Receive 200 HERO Credits.">
  <meta name="theme-color" content="#f8f0df">
  <style>
    :root{--cream:#f8f0df;--wine:#6b1020;--wine-deep:#310611;--gold:#c99b32;--gold-light:#ead49a;--ink:#2c1820}
    *{box-sizing:border-box}
    html,body{width:100%;height:100%;margin:0;background:var(--cream);overflow:hidden}
    body{font-family:Arial,Helvetica,"Noto Sans Thai","Noto Sans SC",sans-serif}
    button{font:inherit}
    .app-frame{position:fixed;inset:0;display:block;width:100%;height:100%;height:100dvh;border:0;background:var(--cream);opacity:0;transform:scale(1.012);transition:opacity .75s ease,transform 1.1s cubic-bezier(.2,.75,.2,1)}
    .app-frame.is-ready{opacity:1;transform:none}
    .intro{position:fixed;z-index:30;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 44%,rgba(234,212,154,.28),transparent 30%),linear-gradient(145deg,#fffaf0 0%,var(--cream) 52%,#f2e5cc 100%);color:var(--wine);transition:opacity .85s ease,visibility .85s ease}
    .intro::before{content:"";position:absolute;inset:0;opacity:.22;background-image:radial-gradient(rgba(107,16,32,.18) .55px,transparent .7px);background-size:6px 6px;mask-image:linear-gradient(to bottom,transparent,#000 30%,#000 70%,transparent)}
    .intro::after{content:"";position:absolute;left:-35%;top:0;width:28%;height:100%;transform:skewX(-18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);animation:lightSweep 2.7s .35s cubic-bezier(.22,.7,.24,1) both}
    .intro.is-leaving{opacity:0;visibility:hidden;pointer-events:none}
    .intro-lockup{position:relative;width:min(78vw,560px);display:grid;place-items:center;text-align:center;transform:translateY(8px)}
    .crown{position:relative;margin-bottom:18px;color:var(--gold);font:400 clamp(37px,8vw,61px)/1 Georgia,"Times New Roman",serif;opacity:0;transform:translateY(-18px) scale(.82);animation:crownIn .85s .15s cubic-bezier(.2,.8,.2,1.2) forwards}
    .crown::after{content:"";position:absolute;left:50%;bottom:-13px;width:1px;height:28px;background:linear-gradient(var(--gold),transparent);transform:translateX(-50%) scaleY(0);transform-origin:top;animation:stemIn .6s .75s ease forwards}
    .word-emperor{position:relative;margin:0;color:var(--wine-deep);font:400 clamp(33px,8.8vw,73px)/1 Georgia,"Times New Roman",serif;letter-spacing:.2em;text-indent:.2em;opacity:0;filter:blur(7px);transform:scale(.96);animation:wordIn 1s .58s cubic-bezier(.2,.72,.2,1) forwards}
    .word-foods{margin:14px 0 0;color:var(--wine);font:700 clamp(11px,2.8vw,17px)/1 Arial,Helvetica,sans-serif;letter-spacing:.72em;text-indent:.72em;opacity:0;transform:translateY(9px);animation:foodsIn .75s 1.05s ease forwards}
    .rule{width:min(64vw,390px);height:1px;margin-top:28px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);animation:ruleIn .85s 1.18s ease forwards}
    .tagline{margin:17px 0 0;color:#816e5f;font-size:clamp(8px,2vw,11px);font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:0;animation:foodsIn .7s 1.45s ease forwards}
    .loading-dot{width:4px;height:4px;margin-top:28px;border-radius:50%;background:var(--gold);opacity:0;animation:pulse 1.15s 1.75s ease-in-out infinite}
    .fallback{position:fixed;z-index:31;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%);color:var(--wine);font-size:11px;letter-spacing:.08em;opacity:0;transition:opacity .3s ease}
    .fallback.is-visible{opacity:.72}

    .menu-toggle{position:fixed;z-index:22;right:14px;bottom:max(16px,env(safe-area-inset-bottom));border:1px solid rgba(255,255,255,.34);border-radius:999px;padding:11px 15px;background:linear-gradient(135deg,#5c0617,#86172a);color:#fff7e5;box-shadow:0 10px 30px rgba(35,0,9,.28);font-weight:800;cursor:pointer}
    .menu-toggle strong{color:#f3cf77}
    .menu-backdrop{position:fixed;z-index:23;inset:0;background:rgba(18,3,8,.52);opacity:0;visibility:hidden;transition:.25s ease}
    .menu-backdrop.is-open{opacity:1;visibility:visible}
    .menu-drawer{position:fixed;z-index:24;top:0;right:0;width:min(92vw,430px);height:100%;height:100dvh;background:#fffaf0;color:var(--ink);box-shadow:-22px 0 60px rgba(31,0,9,.3);transform:translateX(103%);transition:transform .32s cubic-bezier(.2,.8,.2,1);overflow:auto;padding:22px 20px calc(34px + env(safe-area-inset-bottom))}
    .menu-drawer.is-open{transform:none}
    .menu-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid #eadcc5}
    .menu-head small{display:block;color:#8d6d4d;font-weight:700;letter-spacing:.08em;margin-bottom:4px}
    .menu-head h2{margin:0;color:var(--wine-deep);font:700 27px/1.05 Georgia,"Times New Roman",serif}
    .close-menu{border:1px solid #e2d3bb;background:#fff;color:var(--wine);border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer}
    .delivery-card{margin:16px 0 10px;padding:14px 15px;border:1px solid #dfbd66;border-radius:14px;background:linear-gradient(135deg,#fff3c9,#fff9e8);color:#5d3207;line-height:1.45}
    .delivery-card b{font-size:20px;color:#851426}
    .benefit-card{margin:0 0 18px;padding:14px 15px;border:1px solid #f0b3c1;border-radius:14px;background:linear-gradient(135deg,#fff0f5,#f3f7ff);color:#4d2130;line-height:1.45}
    .benefit-card b{font-size:20px;color:#b10d3a}
    .menu-list{display:grid;gap:0;border-top:1px solid #eadcc5}
    .menu-row{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start;padding:13px 2px;border-bottom:1px solid #eadcc5}
    .menu-row b{color:#3d1720;font-size:15px}
    .menu-row small{display:block;margin-top:3px;color:#816f67;line-height:1.4}
    .menu-price{color:#8a1023;font:700 20px/1 Georgia,"Times New Roman",serif;white-space:nowrap}
    .menu-note{margin-top:16px;color:#76625b;font-size:12px;line-height:1.55}

    @keyframes crownIn{to{opacity:1;transform:none}}
    @keyframes stemIn{to{transform:translateX(-50%) scaleY(1)}}
    @keyframes wordIn{to{opacity:1;filter:blur(0);transform:none}}
    @keyframes foodsIn{to{opacity:1;transform:none}}
    @keyframes ruleIn{to{transform:scaleX(1)}}
    @keyframes pulse{0%,100%{opacity:.18;transform:scale(.75)}50%{opacity:1;transform:scale(1.45)}}
    @keyframes lightSweep{0%{transform:translateX(0) skewX(-18deg);opacity:0}18%{opacity:.55}100%{transform:translateX(620%) skewX(-18deg);opacity:0}}
    @media (prefers-reduced-motion:reduce){.intro::after{display:none}.crown,.word-emperor,.word-foods,.rule,.tagline{animation-duration:.01ms;animation-delay:.01ms}.loading-dot{animation:none;opacity:.55}.app-frame,.intro,.menu-drawer,.menu-backdrop{transition-duration:.2s}}
  </style>
</head>
<body>
  <iframe id="emperor-app" class="app-frame" title="EMPEROR FOODS online ordering" src="${APP_ORIGIN}/" allow="payment *; clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe>

  <button id="menu-toggle" class="menu-toggle" type="button" aria-controls="current-menu" aria-expanded="false">ส่งทั่วไทย <strong>฿200</strong> · รับ <strong>200 Credits</strong></button>
  <div id="menu-backdrop" class="menu-backdrop" aria-hidden="true"></div>
  <aside id="current-menu" class="menu-drawer" aria-label="Emperor Duck current menu" aria-hidden="true">
    <div class="menu-head">
      <div><small>EMPEROR DUCK · CURRENT MENU</small><h2>เมนูและราคาปัจจุบัน</h2></div>
      <button id="close-menu" class="close-menu" type="button" aria-label="Close menu">×</button>
    </div>
    <div class="delivery-card"><strong>Delivery cost 200 Baht Nationwide</strong><br><b>จัดส่งแบบแช่เย็น ทั่วไทย ราคาเดียว 200 บาท</b><br>ใกล้ไกลราคาเดียว</div>
    <div class="benefit-card"><strong>HERO Credits</strong><br>Receive <b>200 Credits</b><br>รับเครดิต HERO จำนวน <b>200 Credits</b></div>
    <div class="menu-list">
      <div class="menu-row"><div><b>เป็ดรมควัน อบชานอ้อย</b><small>Whole Smoked Duck</small></div><div class="menu-price">฿790</div></div>
      <div class="menu-row"><div><b>อกเป็ดรมควัน</b><small>Smoked Duck Breast · 1 ชิ้น</small></div><div class="menu-price">฿169</div></div>
      <div class="menu-row"><div><b>อกเป็ดรมควัน Family Pack</b><small>Smoked Duck Breast · 4 ชิ้น</small></div><div class="menu-price">฿590</div></div>
      <div class="menu-row"><div><b>น่องสะโพกเป็ดรมควัน</b><small>Smoked Duck Thigh</small></div><div class="menu-price">฿189</div></div>
      <div class="menu-row"><div><b>หมูรมควัน</b><small>Smoked Pork</small></div><div class="menu-price">฿429</div></div>
      <div class="menu-row"><div><b>คอหมูรมควัน</b><small>Smoked Pork Neck</small></div><div class="menu-price">฿479</div></div>
      <div class="menu-row"><div><b>ลิ้นหมูรมควัน</b><small>Smoked Pig’s Tongue · ประมาณ 330 กรัม</small></div><div class="menu-price">฿490</div></div>
      <div class="menu-row"><div><b>ชุดสามกษัตริย์</b><small>อกเป็ดรมควัน 1 + หมูรมควัน 1 + สามชั้นรมควัน 1 · ประมาณ 500 กรัม</small></div><div class="menu-price">฿490</div></div>
    </div>
    <p class="menu-note">ข้อมูลล่าสุด: จัดส่งแบบแช่เย็นทั่วไทย ราคาเดียว 200 บาท และรับ HERO Credits 200 Credits.</p>
  </aside>

  <section id="emperor-intro" class="intro" aria-label="EMPEROR FOODS introduction" aria-live="polite">
    <div class="intro-lockup">
      <div class="crown" aria-hidden="true">♛</div>
      <h1 class="word-emperor">EMPEROR</h1>
      <p class="word-foods">FOODS</p>
      <div class="rule" aria-hidden="true"></div>
      <p class="tagline">Premium Asian Lifestyle</p>
      <div class="loading-dot" aria-hidden="true"></div>
    </div>
  </section>
  <a id="fallback" class="fallback" href="${APP_ORIGIN}/">Open EMPEROR FOODS</a>
  <noscript><style>.app-frame{opacity:1}.intro{display:none}.fallback{opacity:1}</style></noscript>
  <script>
    (() => {
      const frame = document.getElementById("emperor-app");
      const intro = document.getElementById("emperor-intro");
      const fallback = document.getElementById("fallback");
      const toggle = document.getElementById("menu-toggle");
      const drawer = document.getElementById("current-menu");
      const backdrop = document.getElementById("menu-backdrop");
      const close = document.getElementById("close-menu");
      const startedAt = performance.now();
      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const minimumIntro = reduceMotion ? 450 : 2800;
      let revealed = false;

      const revealApp = () => {
        if (revealed) return;
        revealed = true;
        frame.classList.add("is-ready");
        intro.classList.add("is-leaving");
        setTimeout(() => intro.remove(), reduceMotion ? 350 : 950);
      };

      const setMenu = (open) => {
        drawer.classList.toggle("is-open", open);
        backdrop.classList.toggle("is-open", open);
        drawer.setAttribute("aria-hidden", String(!open));
        backdrop.setAttribute("aria-hidden", String(!open));
        toggle.setAttribute("aria-expanded", String(open));
      };

      toggle.addEventListener("click", () => setMenu(!drawer.classList.contains("is-open")));
      close.addEventListener("click", () => setMenu(false));
      backdrop.addEventListener("click", () => setMenu(false));
      document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });

      frame.addEventListener("load", () => {
        const remaining = Math.max(0, minimumIntro - (performance.now() - startedAt));
        setTimeout(revealApp, remaining);
      }, { once: true });

      setTimeout(() => fallback.classList.add("is-visible"), 6500);
    })();
  </script>
</body>
</html>`;

function rewriteLocation(value, publicOrigin) {
  if (!value) return value;
  return value.replace(APP_ORIGIN, publicOrigin);
}

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");

    if (request.method === "GET" && publicUrl.pathname === "/" && acceptsHtml) {
      return new Response(CUSTOMER_SHELL, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy": `frame-src ${APP_ORIGIN}; default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'`,
          "x-content-type-options": "nosniff",
        },
      });
    }

    const upstreamUrl = new URL(publicUrl.pathname + publicUrl.search, APP_ORIGIN);
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", publicUrl.host);
    headers.set("x-forwarded-proto", "https");

    const upstreamResponse = await fetch(new Request(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    }));

    const responseHeaders = new Headers(upstreamResponse.headers);
    const location = responseHeaders.get("location");
    if (location) responseHeaders.set("location", rewriteLocation(location, publicUrl.origin));

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
};