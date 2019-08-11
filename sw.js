const CACHE = 'static-cache';

const ASSETS = [
    './index.html',
    './favicon.ico',
    './images/bg.webp'
];

addEventListener('install', () => {
    caches.open(CACHE).then(cache =>
        cache.addAll(ASSETS)
    );
});

addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            const isCacheable = event.request.url.indexOf("/questions") == -1;
            if (isCacheable && response) {
                return response;
            }
            else {
                return fetch(event.request).then(res => {
                    return caches.open(CACHE).then(cache => {
                        if(isCacheable) {
                            cache.put(event.request.url, res.clone());
                        }
                        return res;
                    });
                })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
    );
});

addEventListener('activate', event => {
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