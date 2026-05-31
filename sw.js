const CACHE_NAME = 'checq-cache-v3.4.1';

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['index.html', 'manifest.json', 'app-icon.png', './']);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((hit) => {
      return hit || fetch(evt.request).catch(() => {
        if (evt.request.mode === 'navigate') {
          return caches.match('index.html') || caches.match('./');
        }
      });
    })
  );
});