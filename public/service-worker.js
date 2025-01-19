const cacheName = 'shoppingList-app-cache';

// Install event - Cache static assets if needed
self.addEventListener('install', (event) => {
    console.log('Service worker was installed');
    self.skipWaiting(); // Activate the service worker immediately
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service worker was activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== cacheName) // Keep only the latest cache
                    .map((name) => caches.delete(name)) // Delete old caches
            );
        })
    );
});

// Fetch event - Cache strategy (Network First with fallback to cache)
self.addEventListener('fetch', (event) => {
    if (['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
        return; // Don't cache mutating requests
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request)) // Fallback to cache
    );
});

// Notification click event - Handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);
    event.notification.close(); // Close the notification

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                // Focus on an open tab
                return clientList[0].focus();
            } else {
                // Open a new tab
                return clients.openWindow('/');
            }
        })
    );
});

// Optional: Push event - Handle push notifications if implemented
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    const data = event.data ? event.data.json() : { title: 'Default Title', body: 'Default Body' };
    const title = data.title || 'Push Notification';
    const options = {
        body: data.body,
        icon: '/path/to/icon.png', // Replace with your app's icon
        badge: '/path/to/badge.png', // Replace with your app's badge
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
