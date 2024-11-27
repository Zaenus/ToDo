// Service Worker Version Number
const VERSION = 'v1';

// Cache Name
const CACHE_NAME = `${VERSION}-sw`;

// Array of resources to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  // Add other assets you want to cache here
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app files...');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching:', event.request.url);

  // Check if the request is for a page or resource that needs caching
  if (event.request.method === 'GET' && !event.request.url.match(/^https?:\/\/(www\.)?googleapis\.com/) &&
!event.request.url.match(/^https?:\/\/(www\.)?fonts.googleapis\.com\/css/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if available
          return response || fetch(event.request);
        })
        .catch(error => {
          console.error('[Service Worker] Fetch failed:', error);
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name));
      })
      .catch(error => {
        console.error('[Service Worker] Activation failed:', error);
      })
  );
});