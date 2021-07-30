const version = 1;
const PRE_CACHE_NAME = `static-v${version}`;
const RUNTIME = 'runtime';
// const DATA_CACHE_NAME = "data-cache-v1";
//if adding '/404.html' to the precache, the file must exist or the install event will fail
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/css/styles.css",
  "/dist/bundle.js",
  "/dist/manifest.json",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches
      .open(PRE_CACHE_NAME)
      .then((cache) => {
          console.log('caching static files');
          cache.addAll(FILES_TO_CACHE);
      })
        .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches
        .keys()
        .then((keys) => {
            return Promise.all(
                keys
            .filter((key) => key !== PRE_CACHE_NAME)
            .map((key) => caches.delete(key))
            );
        })
        .catch(console.warn) //filter old
    );
});

self.addEventListener(`fetch`, evt => {
    if (
        evt.request.method !== "GET" || !event.request.url.start

    )
    evt.respondWith(
        caches.match(evt.request)
        .then(cacheRes => {
            return (
                cacheRes ||
                fetch(evt.request).then(
                    (response) => {
                        return response;
                    },
                    (err) => {
                        console.log(err)

                    }
                )
            )
        })
    );
});

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