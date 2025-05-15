const CACHE_NAME = 'storyapp-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/app.bundle.js',
  '/app.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

/**
 * INSTALL – Caching App Shell
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching App Shell');
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * ACTIVATE – Hapus cache lama
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/**
 * FETCH – Hanya tangani GET dan fallback ke index.html untuk navigasi
 */
self.addEventListener('fetch', (event) => {
  // Hanya tangani GET
  if (event.request.method !== 'GET') return;

  // Fallback ke index.html jika request navigasi
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Default cache first
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

/**
 * PUSH NOTIFICATION
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.options?.body || 'Ada cerita baru dari Story App!',
    icon: '/favicon.png',
    badge: '/favicon.png',
  };
  const title = data.title || 'Story App';
  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * NOTIFICATION CLICK
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const client = clientList.find((client) => client.url === '/' && 'focus' in client);
      return client ? client.focus() : clients.openWindow('/');
    })
  );
});
