const CACHE_NAME = 'itportal-cache-3.5.3';
const urlsToCache = [
	'/apple-touch-icon.png',
	'/favicon-32x32.png',
	'/favicon-16x16.png',
	'/safari-pinned-tab.svg',
	'/favicon.ico',
	'/browserconfig.xml',
	'/font-awesome/css/all.min.css',
	'https://fonts.googleapis.com/css?family=Merriweather|Roboto:400,100,300,500,700,900',
	'/css/app.css',
	'/css/console.css',
	'/css/help.css',
	'/css/me.css',
	'/css/my-apps.css',
	'/css/search.css',
	'/css/spread.css',
	'/css/ticket.css',
	'/foundation/css/foundation.min.css',
	'/jquery/jquery.min.js',
	'/foundation/js/foundation.min.js',
	'/simplebar/simplebar.min.js',
	'/js/app.js',
	'/js/pages/index.js',
	'/js/pages/search.js',
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		Promise.all([
			caches.open(CACHE_NAME),
			self.skipWaiting()
		])
			.then(function(cache) {
				return cache.addAll(urlsToCache);
			})
			.catch(function() {

			})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName !== CACHE_NAME;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.method !== 'GET') { return; }
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				return response;
			}
			return fetch(event.request);
		}).catch(function() {

		})
	);
});