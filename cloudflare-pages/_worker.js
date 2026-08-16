// Cloudflare Pages reverse proxy entry point.
const UPSTREAM_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";

function rewriteLocation(value, publicOrigin) {
  if (!value) return value;
  return value.replace(UPSTREAM_ORIGIN, publicOrigin);
}

function deferVinextBootstrap(html) {
  // Vinext currently emits the client import before its streamed RSC chunks.
  // A cached client bundle can therefore start before the chunks have arrived
  // and close the React connection, leaving a blank page. Start the import only
  // after the full document (including the inline RSC chunks) has been parsed.
  return html.replace(
    /<script id="_R_">import\(([^)]+)\)<\/script>/,
    '<script id="_R_">addEventListener("DOMContentLoaded",()=>import($1),{once:true})<\/script>',
  );
}

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const upstreamUrl = new URL(publicUrl.pathname + publicUrl.search, UPSTREAM_ORIGIN);
    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.set("x-forwarded-host", publicUrl.host);
    headers.set("x-forwarded-proto", "https");

    const upstreamRequest = new Request(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    });

    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);
    const publicOrigin = publicUrl.origin;

    const location = responseHeaders.get("location");
    if (location) responseHeaders.set("location", rewriteLocation(location, publicOrigin));

    const setCookie = responseHeaders.get("set-cookie");
    if (setCookie) {
      responseHeaders.set(
        "set-cookie",
        setCookie
          .replaceAll("emperor-foods.vatisp.chatgpt.site", publicUrl.hostname)
          .replaceAll("Domain=chatgpt.site", `Domain=${publicUrl.hostname}`),
      );
    }

    const contentType = responseHeaders.get("content-type") || "";
    const shouldRewriteBody =
      contentType.includes("text/") ||
      contentType.includes("application/json") ||
      contentType.includes("application/xml");

    if (shouldRewriteBody) {
      let body = (await upstreamResponse.text()).replaceAll(UPSTREAM_ORIGIN, publicOrigin);
      if (contentType.includes("text/html")) body = deferVinextBootstrap(body);

      responseHeaders.delete("content-length");
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("etag");
      return new Response(body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: responseHeaders,
      });
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
};
