/* Quadra 12 — Production Service Worker (Network-First HTML/JS/CSS + Offline Cache) */

const WB_MANIFEST = self.__WB_MANIFEST || [];

function computeManifestHash(entries) {
  let hash = 2166136261;
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const token =
      typeof entry === 'string'
        ? entry
        : `${entry.url || ''}:${entry.revision || ''}`;
    for (let j = 0; j < token.length; j += 1) {
      hash ^= token.charCodeAt(j);
      hash = Math.imul(hash, 16777619);
    }
  }
  return (hash >>> 0).toString(36);
}

const CACHE_NAME = `quadra12-v2.6.2-${computeManifestHash(WB_MANIFEST)}`;
const CORE_FALLBACK_URLS = ['./', './index.html', './chemistry-plate.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const urlsToPrecache = new Set(CORE_FALLBACK_URLS);
      for (const entry of WB_MANIFEST) {
        const url = typeof entry === 'string' ? entry : entry && entry.url;
        if (url) {
          urlsToPrecache.add(url);
        }
      }
      await Promise.allSettled(
        Array.from(urlsToPrecache).map((url) =>
          cache.add(new Request(url, {cache: 'reload'})),
        ),
      );
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith('quadra12-'))
          .map((key) => caches.delete(key)),
      );
      // Clean up legacy Workbox precaches from earlier builds
      await Promise.all(
        keys
          .filter((key) => key.startsWith('workbox-precache'))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

function isHtmlOrAssetRequest(request, url) {
  if (request.mode === 'navigate') return true;
  if (url.origin !== self.location.origin) return false;
  return /\.(?:html|js|mjs|css)(?:$|\?)/i.test(url.pathname);
}

function isCacheableStaticAsset(url) {
  if (url.origin === self.location.origin) {
    return /\.(?:png|jpg|jpeg|svg|ico|webp|woff2?|pdf|json|txt)(?:$|\?)/i.test(
      url.pathname,
    );
  }
  return (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

async function networkFirst(request, isNavigation) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
      cache.put(request, networkResponse.clone()).catch(() => {});
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request, {ignoreSearch: isNavigation});
    if (cached) return cached;
    if (isNavigation) {
      return (
        (await cache.match('./index.html')) ||
        (await cache.match('./')) ||
        new Response('Offline — Please reconnect to load Quadra 12.', {
          status: 503,
          headers: {'Content-Type': 'text/plain; charset=utf-8'},
        })
      );
    }
    throw new Error('Network and cache unavailable');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const networkResponse = await fetch(request);
  if (
    networkResponse &&
    (networkResponse.ok || networkResponse.type === 'opaque')
  ) {
    cache.put(request, networkResponse.clone()).catch(() => {});
  }
  return networkResponse;
}

self.addEventListener('fetch', (event) => {
  const {request} = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Never cache API / Firestore / GitHub release checks
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname === 'api.github.com' ||
    url.hostname.endsWith('googleapis.com') &&
      url.hostname !== 'fonts.googleapis.com'
  ) {
    return;
  }

  if (isHtmlOrAssetRequest(request, url)) {
    event.respondWith(networkFirst(request, request.mode === 'navigate'));
    return;
  }

  if (isCacheableStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
