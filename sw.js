const CACHE_NAME = "encarte-v1";
const TOTAL_PAGES = 4;

const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/assets/musica1.mp3",
  "/assets/musica2.mp3"
];

// adiciona encartes automaticamente
for (let i = 1; i <= TOTAL_PAGES; i++) {
  ASSETS.push(`/assets/encarte${i}.webp`);
}

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
