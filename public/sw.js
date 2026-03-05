// BazaarSaar Service Worker - Minimal PWA stub
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for now
  event.respondWith(fetch(event.request));
});
