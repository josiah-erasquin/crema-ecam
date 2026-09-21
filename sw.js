/* Crema service worker — offline-first app shell + runtime font cache + order push. */
const VERSION = 'crema-v7';
const CORE = [
  './',
  'index.html',
  'app.js',
  'data.js',
  'push-config.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];
try { importScripts('push-config.js'); } catch (e) {}
const PUSH_API = ((self.CREMA_PUSH && self.CREMA_PUSH.api) || '').replace(/\/$/, '');

self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let title = 'New coffee order', body = '';
    try {
      if (PUSH_API) {
        const r = await fetch(PUSH_API + '/latest', { cache: 'no-store' });
        if (r.ok) { const d = await r.json(); title = d.title || title; body = d.body || ''; }
      }
    } catch (_) {}
    await self.registration.showNotification(title, {
      body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
      tag: 'crema-order', renotify: true, data: { url: './#order' }
    });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { try { await c.navigate(c.url.split('#')[0] + '#order'); } catch (_) {} return c.focus(); }
    }
    if (self.clients.openWindow) return self.clients.openWindow('./#order');
  })());
});

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // App shell + same-origin: cache-first, fall back to network and cache it.
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html')))
    );
    return;
  }

  // Google Fonts (cross-origin): stale-while-revalidate.
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.open(VERSION).then(c => c.match(req).then(hit => {
        const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
});
