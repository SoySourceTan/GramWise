const CACHE_NAME = 'unit-price-calculator-v2';
// Caching only essential files for the app shell. JS/CSS is inlined.
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // We only handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // Strategy: Network falling back to cache
    // Try to fetch from the network first to get the latest version.
    fetch(event.request)
      .then((response) => {
        // If the fetch is successful, clone the response and cache it.
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // If the network fails, try to serve from the cache.
        return caches.match(event.request).then(response => {
            return response || caches.match('/');
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
