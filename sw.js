const CACHE_VERSION = '11.05.2026-1501';
const CACHE_STATIC  = `equilibrio-static-${CACHE_VERSION}`;
const CACHE_MP3     = `equilibrio-mp3-${CACHE_VERSION}`;
const BASE = self.location.pathname.replace('/sw.js', '');

// Assets estáticos críticos (lista COMPLETA)
const STATIC_ASSETS = [
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/silence.mp3`,
  `${BASE}/encartes/encarte1.webp`,
  `${BASE}/encartes/encarte2.webp`,
  `${BASE}/encartes/encarte3.webp`,
  `${BASE}/encartes/encarte4.webp`,
  `${BASE}/encartes/encarte5.webp`,
  `${BASE}/encartes/encarte6.webp`,
  `${BASE}/encartes/encarte7.webp`,
  `${BASE}/encartes/encarte8.webp`,
  `${BASE}/encartes/encarte9.webp`,
  `${BASE}/encartes/encarte10.webp`,
  `${BASE}/encartes/encarte11.webp`,
  `${BASE}/encartes/encarte12.webp`,
  `${BASE}/encartes/encarte13.webp`,
  `${BASE}/encartes/encarte14.webp`,
  `${BASE}/encartes/encarte15.webp`,
];

// Lista de MP3s (lista COMPLETA)
const MP3_ASSETS = [
  `${BASE}/mp3/01-Gente.mp3`,
  `${BASE}/mp3/02-Strani Amori.mp3`,
  `${BASE}/mp3/03-I Venti Del Cuore.mp3`,
  `${BASE}/mp3/04-Scrivimi.mp3`,
  `${BASE}/mp3/05-Dolcissima Maria.mp3`,
  `${BASE}/mp3/06-Lettera.mp3`,
  `${BASE}/mp3/07-La Solitudine.mp3`,
  `${BASE}/mp3/08-Passerà.mp3`,
  `${BASE}/mp3/09-Come Fa Un'Onda.mp3`,
  `${BASE}/mp3/10-La Forza Della Vita.mp3`,
  `${BASE}/mp3/11-Due.mp3`,
  `${BASE}/mp3/12-Piú O Meno.mp3`,
  `${BASE}/mp3/13-La Vita è Adesso.mp3`,
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(CACHE_MP3).then(cache => cache.addAll(MP3_ASSETS))
    ]).catch(err => console.warn('Precache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_STATIC && k !== CACHE_MP3)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // MP3s: cache-first com fallback de rede
  if (url.includes('/mp3/')) {
    event.respondWith(
      caches.open(CACHE_MP3).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(async () => {
            // Fallback silencioso
            const silenceResponse = await caches.match(`${BASE}/silence.mp3`);
            if (silenceResponse) return silenceResponse;
            
            // Fallback alternativo (sem arquivo extra)
            return new Response('', { 
              status: 204,
              headers: { 'Content-Type': 'audio/mpeg' }
            });
          });
        })
      )
    );
    return;
  }
  
  // Assets estáticos: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE}/index.html`);
        }
        return new Response('Recurso não disponível offline', { status: 404 });
      });
    })
  );
});
