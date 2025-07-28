const CACHE_NAME = 'cocomicchi-pwa-cache-v1';
const urlsToCache = [
    '/cocomicchi-pwa/', // ルートパス（index.htmlを含む）
    '/cocomicchi-pwa/index.html',
    '/cocomicchi-pwa/style.css',
    '/cocomicchi-pwa/script.js',
    '/cocomicchi-pwa/manifest.json',
    // 画像ファイルは後でimagesフォルダを作成し、その中にアップロードします
    '/cocomicchi-pwa/images/icon-192x192.png',
    '/cocomicchi-pwa/images/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュがあればそれを使う
                if (response) {
                    return response;
                }
                // キャッシュになければネットワークから取得
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
