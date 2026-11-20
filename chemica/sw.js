const CACHE='science-chemistry-v12-1795056768016';
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll(["./","./THIRD_PARTY_NOTICES.txt","./assets/index-BXyANL5z.js","./assets/index-D85opa-J.css","./icon-180.png","./icon-192.png","./icon-512.png","./icon-maskable.png","./icon.svg","./index.html","./manifest.webmanifest"]),
      ),
  );
});
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(
          ks
            .filter((k) => k.startsWith('science-chemistry-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (e) => {
  if (
    e.request.method !== "GET" ||
    new URL(e.request.url).origin !== self.location.origin
  )
    return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const c = r.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, c));
        }
        return r;
      })
      .catch(() =>
        caches
          .open(CACHE)
          .then((cache) =>
            cache
              .match(e.request, { ignoreVary: true })
              .then(
                (r) =>
                  r ||
                  (e.request.mode === "navigate"
                    ? cache.match("./", { ignoreVary: true })
                    : Response.error()),
              ),
          ),
      ),
  );
});
