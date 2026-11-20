const CACHE='science-biology-v12-1795056769156';
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll(["./","./THIRD_PARTY_NOTICES.txt","./assets/index-D85opa-J.css","./assets/index-e84-tVCE.js","./icon-180.png","./icon-192.png","./icon-512.png","./icon-maskable.png","./icon.svg","./index.html","./manifest.webmanifest"]),
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
            .filter((k) => k.startsWith('science-biology-') && k !== CACHE)
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
