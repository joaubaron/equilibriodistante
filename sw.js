const CACHE_VERSION = '06.05.2026-1256';
const CACHE_NAME = `encarte-${CACHE_VERSION}`;
const BASE = '/equilibriodistante';

const ASSETS = [
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
  BASE + '/encartes/encarte15.webp'
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
