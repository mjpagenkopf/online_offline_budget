const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/assets/css/styles.css",
  "/assets/js/index.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
];

self.addEventListener(`install`, evt => {
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then(cache => {
            cache.addAll(["/api/transaction"]);
        }),
        caches.open(CACHE_NAME).then(() => {
            cache.addAll(FILES_TO_CACHE).then(() => self.skipWaiting())
        })
    )
});

self.addEventListener("activate", evt => {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter( //filter old
            cacheName => !currentCaches.includes(cacheName)
        );
        }).then(cachesToDelete => {
            return Promise.all( //deleting
            cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete)
         }));
    }).then(() => self.clients.claim())
    );
});

self.addEventListener(`fetch`, evt => {
    if (
        evt.request.method !== `GET` || 
        !evt.request.url.startsWith(self.location.origin)
    ) {
        evt.respondWith(fetch(evt.request));
        return;
    }

    if (evt.request.url.includes(`/api/transaction`)) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request).then(response => {
                cache.put(evt.request, response.clone());
                return response;
            }).catch(() => caches.match(evt.request));
        })
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request).then(response => {
                    return cache.put(evt.request, response.clone()).then(() => {
                    return response 
                    // || fetch (evt.request))
                });
            });
        });
        })
    );
});