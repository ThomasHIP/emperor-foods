// Cloudflare Pages customer shell for the EMPEROR FOODS hosted application.
const APP_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";

const CUSTOMER_SHELL = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>EMPEROR FOODS | เป็ดจักรพรรดิ</title>
  <meta name="description" content="EMPEROR FOODS — Emperor Duck sugarcane-smoked specialties and temperature-controlled delivery across Thailand.">
  <meta name="theme-color" content="#4b0717">
  <style>
    *{box-sizing:border-box}
    html,body{width:100%;height:100%;margin:0;background:#f8f0df;overflow:hidden}
    iframe{display:block;width:100%;height:100%;height:100dvh;border:0;background:#f8f0df}
    .loading{position:fixed;inset:0;display:grid;place-items:center;color:#6b1020;font:600 14px system-ui;letter-spacing:.12em}
    iframe:not([data-loaded])+.loading{display:grid}
    iframe[data-loaded]+.loading{display:none}
  </style>
</head>
<body>
  <iframe
    title="EMPEROR FOODS online ordering"
    src="${APP_ORIGIN}/"
    allow="payment *"
    referrerpolicy="strict-origin-when-cross-origin"
    onload="this.setAttribute('data-loaded','')"
  ></iframe>
  <div class="loading">EMPEROR FOODS</div>
  <noscript><a href="${APP_ORIGIN}/">Open EMPEROR FOODS</a></noscript>
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

    // Keep the public Cloudflare address stable while the full application runs
    // from its healthy production origin.
    if (
      request.method === "GET" &&
      publicUrl.pathname === "/" &&
      acceptsHtml
    ) {
      return new Response(CUSTOMER_SHELL, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy": `frame-src ${APP_ORIGIN}; default-src 'self'; style-src 'unsafe-inline'`,
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
