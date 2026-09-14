import { allRoutes } from '../lib/routes';

// يتولّد مع كل بناء، فتتغير النسخة تلقائياً ويحدّث المتصفح الكاش
export const GET = () => {
  const version = `itmaen-${Date.now()}`;
  const body = `
const CACHE = ${JSON.stringify(version)};
const ROUTES = ${JSON.stringify(allRoutes)};

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(ROUTES.map((u) => c.add(new Request(u, { cache: 'reload' }))));
    // الخطوط والملفات المشتركة المشار إليها من الصفحة الرئيسية
    try {
      const html = await (await c.match('/')).text();
      const assets = [...new Set(html.match(/\\/_astro\\/[^"')\\s]+/g) || [])];
      await Promise.allSettled(assets.map((u) => c.add(u)));
    } catch (err) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    // الشبكة أولاً مع مهلة قصيرة — وقت الطوارئ ما ننتظر شبكة بطيئة
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const cached = await c.match(url.pathname) || await c.match(req);
      const net = fetch(req).then((res) => { if (res.ok) c.put(url.pathname, res.clone()); return res; });
      if (cached) {
        const timeout = new Promise((r) => setTimeout(() => r(cached), 2500));
        return Promise.race([net.catch(() => cached), timeout]);
      }
      try { return await net; } catch (err) { return (await c.match('/')) || Response.error(); }
    })());
    return;
  }

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  })());
});
`;
  return new Response(body, { headers: { 'Content-Type': 'application/javascript; charset=utf-8' } });
};
