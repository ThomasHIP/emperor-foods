// Cloudflare Pages reverse proxy entry point.
const UPSTREAM_ORIGIN = "https://emperor-foods.vatisp.chatgpt.site";

function rewriteLocation(value, publicOrigin) {
  if (!value) return value;
  return value.replace(UPSTREAM_ORIGIN, publicOrigin);
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
        setCookie.replaceAll("emperor-foods.vatisp.chatgpt.site", publicUrl.hostname),
      );
    }

    const contentType = responseHeaders.get("content-type") || "";
    const shouldRewriteBody =
      contentType.includes("text/") ||
      contentType.includes("application/json") ||
      contentType.includes("application/xml");

    if (shouldRewriteBody) {
      const body = (await upstreamResponse.text()).replaceAll(UPSTREAM_ORIGIN, publicOrigin);
      responseHeaders.delete("content-length");
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
