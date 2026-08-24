/**
 * Submits every public URL to IndexNow after a deploy.
 *
 * IndexNow is Bing's push protocol — instead of waiting to be crawled, we tell
 * it what changed. That matters here beyond Bing itself: ChatGPT Search and
 * Copilot answer German local queries from the Bing index, so this is the
 * shortest path from "page shipped" to "an assistant can cite it".
 *
 * Google does not participate; Google discovery still comes from the sitemap.
 *
 * Usage:  node scripts/indexnow.mjs
 * Needs:  INDEXNOW_KEY (defaults to the key committed in /public)
 */

const HOST = "mmoving.de";
const KEY = process.env.INDEXNOW_KEY ?? "9052846261f58c994e5ca29e637d3671";
const ORIGIN = `https://${HOST}`;

async function collectUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const urlList = await collectUrls();
if (urlList.length === 0) throw new Error("sitemap contained no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList,
  }),
});

// 200 and 202 both mean accepted; IndexNow returns no body.
if (res.status !== 200 && res.status !== 202) {
  throw new Error(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
}
console.log(`IndexNow accepted ${urlList.length} URLs (${res.status})`);
