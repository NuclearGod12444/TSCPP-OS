const cacheName = 'TSCPPDESKTOP-v5.3.0';
const staticAssets = [
  './',
  './index.html',
  './manifest.json',
  './serviceworker.js',
  './tscpp.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.searchParams.has('v')) {
    event.respondWith(fetch(event.request).then(resp => {
      try { const r = resp.clone(); caches.open(cacheName).then(c=>c.put(event.request, r)); } catch(e){}
      return resp;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    return cached || fetch(event.request);
  })());
});
