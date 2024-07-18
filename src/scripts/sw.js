/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'RUNTIME';

const CacheHelper = {
    async cachingAppShell(requests) {
        const cache = await this._openCache();
        cache.addAll(requests);
    },

    async deleteOldCache() {
        const cacheNames = await caches.keys();
        cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((filteredName) => caches.delete(filteredName));
    },

    async revalidateCache(request) {
        const response = await caches.match(request);
        if (response) {
            this._fetchRequest(request);
            return response;
        }
        return this._fetchRequest(request);
    },

    async _openCache() {
        return caches.open(CACHE_NAME);
    },

    async _fetchRequest(request) {
        const response = await fetch(request);
        if (!response || response.status !== 200) {
            return response;
        }
        await this._addCache(request);
        return response;
    },

    async _addCache(request) {
        const cache = await this._openCache();
        cache.add(request);
    },
};

const assetsToCache = [
    './',
    './index.html',
    './restaurant-detail.html',
    './favorite-restaurant.html',
    './app.bundle.js',
    '../public/icons/restaurant-plate-svgrepo-192x192.png',
    '../public/icons/restaurant-plate-svgrepo-256x256.png',
    '../public/icons/restaurant-plate-svgrepo-384x384.png',
    '../public/icons/restaurant-plate-svgrepo-512x512.png',
    './images/heros/hero-image_1.jpg',
    './images/heros/hero-image_2.jpg',
    './images/heros/hero-image_3.jpg',
    './images/heros/hero-image_4.jpg',
    'https://restaurant-api.dicoding.dev/list',
    'https://restaurant-api.dicoding.dev/images/small/',
    'https://restaurant-api.dicoding.dev/images/medium/',
    'https://restaurant-api.dicoding.dev/images/large/',
];

self.addEventListener('install', (event) => {
    console.log('Installing Service Worker ...');
    event.waitUntil(CacheHelper.cachingAppShell([...assetsToCache]));
});

self.addEventListener('activate', (event) => {
    console.log('Activating Service Worker ...');
    event.waitUntil(CacheHelper.deleteOldCache());
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Cache halaman detail dan favorit menggunakan strategi NetworkFirst
    // if (request.url.includes('/restaurant-detail.html')) {
    //     event.respondWith(
    //         caches.match(request).then((response) => response || fetch(request).then((fetchResponse) => caches.open(CacheHelper.CACHE_NAME).then((cache) => {
    //             cache.put(request, fetchResponse.clone());
    //             return fetchResponse;
    //         }))),
    //     );
    // } else if (request.url.includes('/favorite-restaurant.html')) {
    //     event.respondWith(
    //         caches.match(request).then((response) => response || fetch(request).then((fetchResponse) => caches.open(CacheHelper.CACHE_NAME).then((cache) => {
    //             cache.put(request, fetchResponse.clone());
    //             return fetchResponse;
    //         }))),
    //     );
    // } else {
    //     event.respondWith(CacheHelper.revalidateCache(request));
    // }

    // event.respondWith(
    //     caches.match(request).then((response) => response || fetch(request).then((fetchResponse) => caches.open(CacheHelper.CACHE_NAME)
    //         .then((cache) => cache.put(request, fetchResponse.clone()).then(() => fetchResponse)))),
    // );

    event.respondWith(
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(request).then((fetchResponse) => {
                if (!fetchResponse || fetchResponse.status !== 200) {
                    return fetchResponse;
                }
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return fetchResponse;
            });
        }),
    );
});
