const CACHE_NAME = "skipgym-v5"; // Bumped version
const ASSETS = ["/", "/index.html", "/manifest.json", "/sw.js"];

// 1. INSTALL: Properly return the promise
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SKIPGYM: Caching Shell");
      return cache.addAll(ASSETS); // Now explicitly returning the promise
    })
  );
});

// 2. ACTIVATE: Cleanup
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("SKIPGYM: Removing Old Cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. FETCH: Strategy - Cache First, then Network
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, try network
      return fetch(e.request)
        .then((networkResponse) => {
          // Optional: Cache new assets on the fly (like your bundled JS)
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If everything fails, return the offline fallback (Home Page)
          return caches.match("/");
        });
    })
  );
});
