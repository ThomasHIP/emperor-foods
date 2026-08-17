const APP_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";

const STORE_PATCH = `<script>
(() => {
  const norm = (v) => (v || "").replace(/\\s+/g, " ").trim();

  function patchDelivery() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parentText = norm(node.parentElement?.textContent);
      if ((parentText.includes("จัดส่ง") || parentText.includes("ค่าส่ง")) && /120\\s*บาท/.test(node.nodeValue || "")) {
        node.nodeValue = (node.nodeValue || "").replace(/120\\s*บาท/g, "200 บาท");
      }
    }
  }

  function findProductCard(titleEl, requiredPrices) {
    let el = titleEl;
    for (let i = 0; i < 8 && el; i++, el = el.parentElement) {
      const text = norm(el.textContent);
      if (requiredPrices.every((p) => text.includes(p)) && text.length < 2200) return el;
    }
    return null;
  }

  function patchWholeDuck() {
    const all = [...document.querySelectorAll("h1,h2,h3,h4,h5,p,span,div")];
    const title = all.find((el) => {
      const t = norm(el.textContent);
      if (el.children.length > 2) return false;
      return t === "เป็ดรมควันชานอ้อยทั้งตัว" || t === "เป็ดรมควันอบชานอ้อยทั้งตัว" || t === "Whole Sugarcane-Smoked Duck" || t === "甘蔗烟熏整鸭";
    });
    if (!title) return;

    const card = findProductCard(title, ["790", "890", "990"]);
    if (!card || card.dataset.emperorSingleDuck === "1") return;
    card.dataset.emperorSingleDuck = "1";

    const original = norm(title.textContent);
    if (/^[ก-๙]/.test(original)) title.textContent = "เป็ดรมควันอบชานอ้อย";
    else if (/[一-龥]/.test(original)) title.textContent = "甘蔗烟熏整鸭";
    else title.textContent = "Whole Sugarcane-Smoked Duck";

    [...card.querySelectorAll("*")].forEach((el) => {
      if (el === title || el.contains(title)) return;
      const t = norm(el.textContent);
      if (!t || t.length > 180) return;
      if (/890|990|ขนาดเล็ก|ขนาดกลาง|ขนาดใหญ่|ประมาณ\\s*1\\.[123]|Small|Medium|Large|1\\.1\\s*kg|1\\.2\\s*kg|1\\.3\\s*kg/i.test(t)) {
        el.style.display = "none";
      }
    });

    const price = document.createElement("div");
    price.className = "emperor-duck-single-price";
    price.textContent = "฿790";
    price.style.cssText = "margin-top:18px;font-weight:800;font-size:clamp(26px,6vw,36px);line-height:1;color:inherit;text-align:right";
    title.insertAdjacentElement("afterend", price);
  }

  function patchKnownPrices() {
    const all = [...document.querySelectorAll("section,article,div,li")];
    for (const el of all) {
      const t = norm(el.textContent);
      if (t.length > 900) continue;
      if ((t.includes("อกเป็ดรมควัน") || /Smoked Duck Breast/i.test(t)) && t.includes("4 ชิ้น") && t.includes("599")) {
        [...el.childNodes].forEach((n) => { if (n.nodeType === 3) n.nodeValue = (n.nodeValue || "").replace(/599/g, "590"); });
        [...el.querySelectorAll("*")].forEach((n) => { if (n.children.length === 0 && /599/.test(n.textContent || "")) n.textContent = (n.textContent || "").replace(/599/g, "590"); });
      }
      if ((t.includes("ลิ้นหมู") || /Pig.?s Tongue/i.test(t)) && t.includes("499")) {
        [...el.querySelectorAll("*")].forEach((n) => { if (n.children.length === 0 && /499/.test(n.textContent || "")) n.textContent = (n.textContent || "").replace(/499/g, "490"); });
      }
    }
  }

  function patchAll() {
    patchDelivery();
    patchWholeDuck();
    patchKnownPrices();
  }

  let timer;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(patchAll, 80); };
  new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  patchAll();
  setTimeout(patchAll, 500);
  setTimeout(patchAll, 1500);
})();
<\/script>`;

const CUSTOMER_SHELL = `<!doctype html>
<html lang="th" data-menu-lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>EMPEROR FOODS | Emperor Duck เป็ดจักรพรรดิ</title>
<meta name="description" content="EMPEROR DUCK — ค่าส่งแช่เย็น ทั่วไทย 200 บาท รับ 200 เครดิต">
<meta name="theme-color" content="#f8f0df">
<style>
:root{--cream:#f8f0df;--wine:#6b1020;--wine-deep:#310611;--gold:#c99b32;--ink:#2c1820}
*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;background:var(--cream);overflow:hidden}body{font-family:Arial,Helvetica,"Noto Sans Thai","Noto Sans SC",sans-serif}.app-frame{position:fixed;inset:0;width:100%;height:100dvh;border:0;background:var(--cream);opacity:0;transform:scale(1.006);transition:opacity .7s ease,transform 1s ease}.app-frame.is-ready{opacity:1;transform:none}
.menu-toggle{position:fixed;z-index:22;right:12px;bottom:max(12px,env(safe-area-inset-bottom));max-width:calc(100vw - 24px);border:1px solid rgba(255,255,255,.34);border-radius:999px;padding:11px 18px;background:linear-gradient(135deg,#5c0617,#8b1830);color:#fff8e9;box-shadow:0 10px 30px rgba(35,0,9,.28);font-weight:800;font-size:14px;line-height:1.35;text-align:center;cursor:pointer}.menu-toggle strong{color:#f3cf77;font-size:16px}.menu-backdrop{position:fixed;z-index:23;inset:0;background:rgba(18,3,8,.52);opacity:0;visibility:hidden;transition:.25s ease}.menu-backdrop.is-open{opacity:1;visibility:visible}.menu-drawer{position:fixed;z-index:24;top:0;right:0;width:min(92vw,430px);height:100dvh;background:#fffaf0;color:var(--ink);box-shadow:-22px 0 60px rgba(31,0,9,.3);transform:translateX(103%);transition:transform .32s cubic-bezier(.2,.8,.2,1);overflow:auto;padding:22px 20px calc(34px + env(safe-area-inset-bottom))}.menu-drawer.is-open{transform:none}.menu-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid #eadcc5}.menu-head small{display:block;color:#8d6d4d;font-weight:700;letter-spacing:.08em;margin-bottom:4px}.menu-head h2{margin:0;color:var(--wine-deep);font:700 27px/1.05 Georgia,serif}.close-menu{border:1px solid #e2d3bb;background:#fff;color:var(--wine);border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer}.delivery-card,.benefit-card{margin:14px 0;padding:14px 15px;border-radius:14px;line-height:1.5}.delivery-card{border:1px solid #dfbd66;background:linear-gradient(135deg,#fff3c9,#fff9e8);color:#5d3207}.benefit-card{border:1px solid #f0b3c1;background:linear-gradient(135deg,#fff0f5,#f3f7ff);color:#4d2130}.delivery-card b,.benefit-card b{font-size:20px;color:#851426}.menu-list{display:grid;border-top:1px solid #eadcc5}.menu-row{display:grid;grid-template-columns:1fr auto;gap:14px;padding:13px 2px;border-bottom:1px solid #eadcc5}.menu-row b{font-size:15px}.menu-row small{display:block;margin-top:3px;color:#816f67;line-height:1.4}.menu-price{color:#8a1023;font:700 20px/1 Georgia,serif;white-space:nowrap}.menu-note{margin-top:16px;color:#76625b;font-size:12px;line-height:1.55}.lang{display:none}html[data-menu-lang="th"] .lang-th,html[data-menu-lang="en"] .lang-en,html[data-menu-lang="zh"] .lang-zh{display:contents}
.intro{position:fixed;z-index:30;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 44%,rgba(234,212,154,.28),transparent 30%),linear-gradient(145deg,#fffaf0 0%,#f8f0df 52%,#f2e5cc 100%);color:var(--wine);transition:opacity .85s ease,visibility .85s ease}.intro::after{content:"";position:absolute;left:-35%;top:0;width:28%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);transform:skewX(-18deg);animation:lightSweep 2.7s .35s cubic-bezier(.22,.7,.24,1) both}.intro.is-leaving{opacity:0;visibility:hidden;pointer-events:none}.intro-lockup{position:relative;width:min(78vw,560px);display:grid;place-items:center;text-align:center}.crown{margin-bottom:18px;color:var(--gold);font:400 clamp(37px,8vw,61px)/1 Georgia,serif;opacity:0;transform:translateY(-18px) scale(.82);animation:crownIn .85s .15s cubic-bezier(.2,.8,.2,1.2) forwards}.word-emperor{margin:0;color:var(--wine-deep);font:400 clamp(33px,8.8vw,73px)/1 Georgia,serif;letter-spacing:.2em;text-indent:.2em;opacity:0;filter:blur(7px);transform:scale(.96);animation:wordIn 1s .58s ease forwards}.word-foods{margin:14px 0 0;color:var(--wine);font-weight:700;font-size:clamp(11px,2.8vw,17px);letter-spacing:.72em;text-indent:.72em;opacity:0;transform:translateY(9px);animation:foodsIn .75s 1.05s ease forwards}.rule{width:min(64vw,390px);height:1px;margin-top:28px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);animation:ruleIn .85s 1.18s ease forwards}.tagline{margin:17px 0 0;color:#816e5f;font-size:clamp(8px,2vw,11px);font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:0;animation:foodsIn .7s 1.45s ease forwards}@keyframes crownIn{to{opacity:1;transform:none}}@keyframes wordIn{to{opacity:1;filter:blur(0);transform:none}}@keyframes foodsIn{to{opacity:1;transform:none}}@keyframes ruleIn{to{transform:scaleX(1)}}@keyframes lightSweep{0%{transform:translateX(0) skewX(-18deg);opacity:0}18%{opacity:.55}100%{transform:translateX(620%) skewX(-18deg);opacity:0}}@media(max-width:600px){.menu-toggle{font-size:13px;padding:10px 15px}.menu-toggle strong{font-size:15px}}
</style>
</head>
<body>
<iframe id="emperor-app" class="app-frame" title="EMPEROR FOODS online ordering" src="/store/" allow="payment *; clipboard-write"></iframe>
<button id="menu-toggle" class="menu-toggle" type="button" aria-controls="current-menu" aria-expanded="false"><span class="lang lang-th">ค่าส่งแช่เย็น ทั่วไทย <strong>200 บาท</strong> · รับ <strong>200 เครดิต</strong></span><span class="lang lang-en">Chilled delivery nationwide <strong>200 Baht</strong> · Receive <strong>200 Credits</strong></span><span class="lang lang-zh">全国冷藏配送 <strong>200 泰铢</strong> · 赠送 <strong>200 积分</strong></span></button>
<div id="menu-backdrop" class="menu-backdrop" aria-hidden="true"></div>
<aside id="current-menu" class="menu-drawer" aria-label="Emperor Duck current menu" aria-hidden="true">
<div class="menu-head"><div><small>EMPEROR DUCK · CURRENT MENU</small><h2><span class="lang lang-th">เมนูและราคาปัจจุบัน</span><span class="lang lang-en">Current Menu & Prices</span><span class="lang lang-zh">当前菜单与价格</span></h2></div><button id="close-menu" class="close-menu" type="button">×</button></div>
<div class="delivery-card"><b><span class="lang lang-th">ค่าส่งแช่เย็น ทั่วไทย 200 บาท</span><span class="lang lang-en">Chilled delivery nationwide 200 Baht</span><span class="lang lang-zh">全国冷藏配送 200 泰铢</span></b></div>
<div class="benefit-card"><b><span class="lang lang-th">รับ 200 เครดิต</span><span class="lang lang-en">Receive 200 Credits</span><span class="lang lang-zh">赠送 200 积分</span></b></div>
<div class="menu-list">
<div class="menu-row"><div><b><span class="lang lang-th">เป็ดรมควันอบชานอ้อย</span><span class="lang lang-en">Whole Sugarcane-Smoked Duck</span><span class="lang lang-zh">甘蔗烟熏整鸭</span></b></div><div class="menu-price">฿790</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">อกเป็ดรมควัน</span><span class="lang lang-en">Smoked Duck Breast</span><span class="lang lang-zh">烟熏鸭胸</span></b><small><span class="lang lang-th">1 ชิ้น</span><span class="lang lang-en">1 piece</span><span class="lang lang-zh">1 块</span></small></div><div class="menu-price">฿169</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">อกเป็ดรมควัน Family Pack</span><span class="lang lang-en">Smoked Duck Breast Family Pack</span><span class="lang lang-zh">烟熏鸭胸家庭装</span></b><small><span class="lang lang-th">4 ชิ้น</span><span class="lang lang-en">4 pieces</span><span class="lang lang-zh">4 块</span></small></div><div class="menu-price">฿590</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">น่องสะโพกเป็ดรมควัน</span><span class="lang lang-en">Smoked Duck Thigh</span><span class="lang lang-zh">烟熏鸭腿</span></b></div><div class="menu-price">฿189</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">หมูรมควัน</span><span class="lang lang-en">Smoked Pork</span><span class="lang lang-zh">烟熏猪肉</span></b></div><div class="menu-price">฿429</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">คอหมูรมควัน</span><span class="lang lang-en">Smoked Pork Neck</span><span class="lang lang-zh">烟熏猪颈肉</span></b></div><div class="menu-price">฿479</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">ลิ้นหมูรมควัน</span><span class="lang lang-en">Smoked Pig's Tongue</span><span class="lang lang-zh">烟熏猪舌</span></b></div><div class="menu-price">฿490</div></div>
<div class="menu-row"><div><b><span class="lang lang-th">ชุดสามกษัตริย์</span><span class="lang lang-en">Three Kings Mixed Set</span><span class="lang lang-zh">三皇拼盘</span></b></div><div class="menu-price">฿490</div></div>
</div><p class="menu-note"><span class="lang lang-th">ค่าส่งแช่เย็น ทั่วไทย 200 บาท · รับ 200 เครดิต</span><span class="lang lang-en">Chilled delivery nationwide 200 Baht · Receive 200 Credits</span><span class="lang lang-zh">全国冷藏配送 200 泰铢 · 赠送 200 积分</span></p></aside>
<section id="emperor-intro" class="intro"><div class="intro-lockup"><div class="crown">♛</div><h1 class="word-emperor">EMPEROR</h1><p class="word-foods">FOODS</p><div class="rule"></div><p class="tagline">Premium Asian Lifestyle</p></div></section>
<script>
(() => {
  const frame=document.getElementById('emperor-app'),intro=document.getElementById('emperor-intro'),toggle=document.getElementById('menu-toggle'),drawer=document.getElementById('current-menu'),backdrop=document.getElementById('menu-backdrop'),close=document.getElementById('close-menu');
  const startedAt=performance.now(); let revealed=false;
  const reveal=()=>{if(revealed)return;revealed=true;frame.classList.add('is-ready');intro.classList.add('is-leaving');setTimeout(()=>intro.remove(),900)};
  const detectLang=()=>{try{const d=frame.contentDocument;if(!d)return 'th';const visible=[...d.querySelectorAll('button,[role=button],select')].filter(e=>e.offsetParent!==null).map(e=>(e.value||e.textContent||'').trim().toUpperCase());if(visible.includes('ZH')||visible.includes('中文')||visible.includes('简体中文'))return 'zh';if(visible.includes('EN'))return 'en';if(visible.includes('TH'))return 'th';const t=d.body?.innerText||'';const th=(t.match(/[ก-๙]/g)||[]).length,zh=(t.match(/[一-龥]/g)||[]).length;if(zh>th&&zh>20)return 'zh';if(th>20)return 'th';return 'en';}catch{return 'th'}};
  const syncLang=()=>{document.documentElement.dataset.menuLang=detectLang()};
  const setMenu=(open)=>{if(open)syncLang();drawer.classList.toggle('is-open',open);backdrop.classList.toggle('is-open',open);drawer.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))};
  toggle.addEventListener('click',()=>setMenu(!drawer.classList.contains('is-open')));close.addEventListener('click',()=>setMenu(false));backdrop.addEventListener('click',()=>setMenu(false));
  frame.addEventListener('load',()=>{setTimeout(reveal,Math.max(0,2500-(performance.now()-startedAt)));setTimeout(()=>{syncLang();try{frame.contentDocument.addEventListener('click',()=>setTimeout(syncLang,120));}catch{}},100)},{once:false});
})();
</script>
</body></html>`;

function mapToUpstream(publicUrl) {
  let path = publicUrl.pathname;
  if (path === "/store" || path === "/store/") path = "/";
  else if (path.startsWith("/store/")) path = path.slice(6) || "/";
  return new URL(path + publicUrl.search, APP_ORIGIN);
}

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");

    if (request.method === "GET" && publicUrl.pathname === "/" && acceptsHtml) {
      return new Response(CUSTOMER_SHELL, { headers: { "content-type":"text/html; charset=utf-8", "cache-control":"no-store", "content-security-policy":`frame-src 'self'; default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'`, "x-content-type-options":"nosniff" } });
    }

    const upstreamUrl = mapToUpstream(publicUrl);
    const headers = new Headers(request.headers); headers.delete("host"); headers.set("x-forwarded-host", publicUrl.host); headers.set("x-forwarded-proto", "https");
    const upstreamResponse = await fetch(new Request(upstreamUrl, { method:request.method, headers, body:request.method==="GET"||request.method==="HEAD"?undefined:request.body, redirect:"manual" }));
    const responseHeaders = new Headers(upstreamResponse.headers);
    const location = responseHeaders.get("location");
    if (location) responseHeaders.set("location", location.replace(APP_ORIGIN, publicUrl.origin + "/store"));

    const contentType = responseHeaders.get("content-type") || "";
    if (request.method === "GET" && publicUrl.pathname.startsWith("/store") && contentType.includes("text/html")) {
      let html = await upstreamResponse.text();
      html = html.replaceAll(APP_ORIGIN, publicUrl.origin + "/store");
      html = html.includes("</body>") ? html.replace("</body>", STORE_PATCH + "</body>") : html + STORE_PATCH;
      responseHeaders.delete("content-length"); responseHeaders.delete("content-encoding"); responseHeaders.delete("content-security-policy"); responseHeaders.set("cache-control","no-store");
      return new Response(html, { status:upstreamResponse.status, statusText:upstreamResponse.statusText, headers:responseHeaders });
    }

    return new Response(upstreamResponse.body, { status:upstreamResponse.status, statusText:upstreamResponse.statusText, headers:responseHeaders });
  }
};