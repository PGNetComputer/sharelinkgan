var CACHE = 'sharelinkgan-v4';
var CACHE_BAGI = 'sl-bagikan';
var FILES = ['./', './index.html', './config.js', './manifest.json', './ikon-192.png', './ikon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE && k !== CACHE_BAGI; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* ---- Menerima file/link dari tombol "Bagikan" di HP (Android) ---- */
function terimaBagikan(req) {
  return req.formData().then(function (fd) {
    var f = fd.get('file'), teks = ['title', 'text', 'url'].map(function (k) { return fd.get(k) || ''; }).filter(Boolean).join(' ');
    return caches.open(CACHE_BAGI).then(function (c) {
      var ada = !!(f && typeof f === 'object' && f.size);
      var meta = new Response(JSON.stringify({ judul: String(fd.get('title') || ''), isi: String(fd.get('text') || ''), teks: teks, nama: ada ? f.name : '', tipe: ada ? f.type : '', ada: ada, waktu: Date.now() }));
      return c.put('./_bagikan_meta', meta).then(function () {
        return ada ? c.put('./_bagikan_file', new Response(f, { headers: { 'content-type': f.type || 'application/octet-stream' } })) : c.delete('./_bagikan_file');
      });
    });
  }).catch(function () {}).then(function () {
    return Response.redirect(new URL('./?bagikan=1', self.registration.scope).href, 303);
  });
}
self.addEventListener('fetch', function (e) {
  var url = e.request.url;
  if (e.request.method === 'POST' && new URL(url).pathname.slice(-8) === '/bagikan') { e.respondWith(terimaBagikan(e.request)); return; }
  if (e.request.method !== 'GET' || url.indexOf('callback=') >= 0 || url.indexOf('script.google') >= 0 || url.indexOf('googleusercontent') >= 0) return;
  if (new URL(url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var salin = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, salin); }); return r;
    }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); })
  );
});

/* ---- Notifikasi dari Firebase Cloud Messaging ---- */
self.addEventListener('push', function (e) {
  var p = {};
  try { p = e.data ? e.data.json() : {}; } catch (x) { p = { data: { judul: 'SHARELINKGAN', isi: e.data ? e.data.text() : '' } }; }
  var d = p.data || p, n = p.notification || {};
  var judul = d.judul || n.title || 'SHARELINKGAN', isi = d.isi || n.body || '';
  var badge = parseInt(d.badge, 10);
  var tugas = [self.registration.showNotification(judul, {
    body: isi, icon: 'ikon-192.png', badge: 'ikon-192.png', tag: d.tag || 'sharelinkgan', renotify: true, data: { url: './?tab=transfer' }
  })];
  if (self.navigator && self.navigator.setAppBadge && !isNaN(badge)) tugas.push(badge > 0 ? self.navigator.setAppBadge(badge) : self.navigator.clearAppBadge());
  tugas.push(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) { cs.forEach(function (c) { c.postMessage({ sl: 'muat' }); }); }));
  e.waitUntil(Promise.all(tugas).catch(function () {}));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ('focus' in cs[i]) { cs[i].postMessage({ sl: 'muat', tab: 'transfer' }); return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
