const CACHE_NAME = 'encarte-musical-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/encartes/encarte1.webp',
  '/encartes/encarte2.webp',
  '/encartes/encarte3.webp',
  '/encartes/encarte4.webp',
  '/encartes/encarte5.webp',
  '/encartes/encarte6.webp',
  '/encartes/encarte7.webp',
  '/encartes/encarte8.webp',
  '/encartes/encarte9.webp',
  '/encartes/encarte10.webp',
  '/encartes/encarte11.webp',
  '/encartes/encarte12.webp',
  '/encartes/encarte13.webp',
  '/encartes/encarte14.webp',
  '/encartes/encarte15.webp',
  '/audio/faixa1.mp3',
  '/audio/faixa2.mp3',
  '/audio/faixa3.mp3',
  '/audio/faixa4.mp3',
  '/audio/faixa5.mp3',
  '/audio/faixa6.mp3',
  '/audio/faixa7.mp3',
  '/audio/faixa8.mp3',
  '/audio/faixa9.mp3',
  '/audio/faixa10.mp3',
  '/audio/faixa11.mp3',
  '/audio/faixa12.mp3',
  '/audio/faixa13.mp3',
  '/audio/faixa14.mp3',
  '/audio/faixa15.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});
