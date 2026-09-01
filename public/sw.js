// Minimal Workbox-style precache placeholder — offline tiles z12-16, <200MB, WebP, LRU
const CACHE = 'agri-intel-v1';
const PRECACHE = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // tile cache LRU simulation: cache-first for OSM/ESRI
  if (url.hostname.includes('tile.openstreetmap') || url.hostname.includes('arcgisonline')) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const clone = res.clone(); caches.open(CACHE).then(c=>c.put(e.request, clone)); return res;
    }).catch(()=> hit)));
    return;
  }
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
});
