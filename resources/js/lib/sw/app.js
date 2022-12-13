"use strict";

var CACHE_NAME = 'itportal-cache-2.4.0';
var urlsToCache = ['/brand/apple-touch-icon.png', '/brand/favicon-32x32.png', '/brand/favicon-16x16.png', '/brand/safari-pinned-tab.svg', '/brand/favicon.ico', '/brand/browserconfig.xml', '/font-awesome/css/all.min.css', 'https://fonts.googleapis.com/css?family=Merriweather|Roboto:400,100,300,500,700,900', '/css/app.css', '/foundation/css/foundation.min.css', '/jquery/jquery.min.js', '/foundation/js/foundation.min.js', '/simplebar/simplebar.min.js', '/js/app.js'];
self.addEventListener('install', function (event) {
  event.waitUntil(Promise.all([caches.open(CACHE_NAME), self.skipWaiting()]).then(function (cache) {
    return cache.addAll(urlsToCache);
  }).catch(function () {}));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName !== CACHE_NAME;
    }).map(function (cacheName) {
      return caches.delete(cacheName);
    }));
  }));
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      return response;
    }

    return fetch(event.request);
  }).catch(function () {}));
});