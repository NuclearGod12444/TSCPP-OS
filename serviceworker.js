const cacheName = 'TSCPPDESKTOP-v5.1.1';
const staticAssets = [
  './',
  './index.html',
  './manifest.json',
  './serviceworker.js',
  './tscpp.png',
];


self.addEventListener('install', async (event) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
