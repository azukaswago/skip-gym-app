const CACHE_NAME = "skipgym-v2"; // Changed version to force update
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  // Ensure these paths match exactly what Vercel outputs
];

self.addEventListener("install", (e) => {
  self.skipWaiting(); // Force the new service worker to become active immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of all open tabs immediately
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      }),
    ])
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
