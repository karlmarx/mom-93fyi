// Service worker for the bed bug PWA.
//
// Strategy:
// - HTML / RSC payloads: NetworkFirst, fall back to cache when offline. This
//   means a fresh deploy lands the moment the browser asks for a page.
// - Fingerprinted /_next/static/*: CacheFirst. These URLs change on every
//   build so caching them indefinitely is safe.
// - /version and the SW itself: never cached here — let the network +
//   Cache-Control headers handle them.
//
// Bump the CACHE constant whenever the SW logic itself changes, so old
// clients pick up new logic on activate.
const CACHE = "bedbug-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Always go to network for the version probe and the SW file itself.
  if (url.pathname === "/version" || url.pathname.endsWith("/bedbug-sw.js")) {
    return;
  }

  // Fingerprinted static assets: CacheFirst.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(req, copy))
            .catch(() => undefined);
          return res;
        });
      }),
    );
    return;
  }

  // Everything else (HTML, RSC, manifest, etc.): NetworkFirst.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches
          .open(CACHE)
          .then((cache) => cache.put(req, copy))
          .catch(() => undefined);
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("/bedbug")),
      ),
  );
});
