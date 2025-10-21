const CACHE_NAME = 'unit-price-calculator-v1';
const urlsToCache = [
  './',
  'index.html',
  'index.tsx',
  'App.tsx',
  'components/ItemCard.tsx',
  'components/icons.tsx',
  'types.ts',
  'assets/icon.svg',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // addAllはアトミックな操作なので、一つでも失敗すると全体が失敗します。
        // ネットワークエラーに備え、個別にキャッシュすることも検討できます。
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
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // キャッシュになければネットワークからフェッチする
        return fetch(event.request);
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
            // 新しいバージョンと異なる古いキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});