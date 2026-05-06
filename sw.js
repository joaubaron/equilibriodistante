const CACHE_VERSION = '06.05.2026-1340';
const CACHE_STATIC  = `gente-static-${CACHE_VERSION}`;
const CACHE_MP3     = `gente-mp3-${CACHE_VERSION}`;
const BASE          = '/equilibriodistante';

// Assets estáticos: cacheados na instalação
const STATIC_ASSETS = [
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
  BASE + '/encartes/encarte1.webp',
  BASE + '/encartes/encarte2.webp',
  BASE + '/encartes/encarte3.webp',
  BASE + '/encartes/encarte4.webp',
  BASE + '/encartes/encarte5.webp',
  BASE + '/encartes/encarte6.webp',
  BASE + '/encartes/encarte7.webp',
  BASE + '/encartes/encarte8.webp',
  BASE + '/encartes/encarte9.webp',
  BASE + '/encartes/encarte10.webp',
  BASE + '/encartes/encarte11.webp',
  BASE + '/encartes/encarte12.webp',
  BASE + '/encartes/encarte13.webp',
  BASE + '/encartes/encarte14.webp',
  BASE + '/encartes/encarte15.webp',
];

// Instalação: cacheia assets estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Ativação: remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_MP3)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: estratégia diferente para MP3s vs assets estáticos
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // MP3s: cache-first, guarda no primeiro acesso (arquivos grandes)
  if (url.includes('/mp3/')) {
    event.respondWith(
      caches.open(CACHE_MP3).then(cache =>
        cache.match(event.request).then(hit => {
          if (hit) return hit;
          return fetch(event.request).then(res => {
            // Guarda cópia no cache somente se resposta válida
            if (res && res.status === 200) {
              cache.put(event.request, res.clone());
            }
            return res;
          });
        })
      )
    );
    return;
  }

  // Tudo mais: cache-first (assets estáticos)
  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request))
  );
});
