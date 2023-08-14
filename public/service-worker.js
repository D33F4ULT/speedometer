import { precacheAndRoute } from "workbox-precaching";

// Precache your assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache the index.html as well
precacheAndRoute([{ url: "/", revision: null }]);

// Cache other assets aggressively with a Cache First strategy
// Adjust the patterns and cache names as needed
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image",
  new CacheFirst({
    cacheName: "static-assets",
  })
);

// Use a custom handler to serve the index.html for navigation requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
