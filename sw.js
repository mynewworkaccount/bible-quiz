const CACHE = 'static-cache';

const ASSETS = [
    '/index.html',
    '/favicon.ico',
    '/style.css',
    '/app.js',
    '/images/7.png'
];

self.addEventListener('install', () => {
    caches.open(CACHE).then(cache =>
        cache.addAll(ASSETS)
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreVary: true }).then(response => {
            const notajax = event.request.url.indexOf('/questions') == -1;
            if (notajax && response) {
                return response;
            }
            else {
                return fetch(event.request).then(response => {
                    const clone = response.clone();
                    caches.open(CACHE).then(cache => {
                        cache.put(event.request, response);
                    });
                    return clone;
                });
            }
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key =>
                    caches.delete(key)
                )
            )
        )
    );
}); 