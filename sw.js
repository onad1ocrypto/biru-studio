/* BIRU STUDIO — service worker
   Strategi:
   - Halaman (HTML) : ambil dari internet dulu, kalau gagal pakai cache  -> update langsung terlihat
   - File lain      : pakai cache dulu (cepat & tetap jalan offline)
   Versi cache dinaikkan setiap rilis agar cache lama dibuang. */
const CACHE = 'biru-studio-v5';
const GAMES_URL = 'games.json';
const ASSETS = [
  './', './index.html', './app.js', './games.json', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png',
  './animals/bee.jpg',  './animals/butterfly.jpg',  './animals/chick.jpg',  './animals/croc.jpg',  './animals/frog.jpg',  './animals/lion.jpg',  './animals/octopus.jpg',  './animals/rabbit.jpg',  './animals/turtle.jpg',  './animals/whale.jpg'
];

/* simpan satu per satu: kalau ada berkas yang gagal, sisanya tetap tersimpan */
async function addEach(cache, urls) {
  await Promise.all(urls.map((u) =>
    fetch(u, { cache: 'no-store' })
      .then((res) => { if (res && res.ok) return cache.put(u, res); })
      .catch(() => {})
  ));
}

/* ambil semua berkas milik satu game dari games.json, lalu simpan ke cache */
async function cacheGame(cache, file) {
  const base = file.replace(/index\.html$/, '');
  let urls = [base + 'index.html'];
  try {
    const res = await fetch(GAMES_URL, { cache: 'no-store' });
    const list = await res.json();
    const g = (list || []).find((x) => x && x.file === file);
    if (g && Array.isArray(g.files) && g.files.length) urls = g.files.map((f) => new URL(f, self.location).href);
  } catch (_) {}
  await addEach(cache, urls);
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(async (c) => {
        await addEach(c, ASSETS);
        /* daftar game tambahan: simpan halamannya supaya bisa main offline */
        try {
          const res = await fetch(GAMES_URL, { cache: 'no-store' });
          const list = await res.json();
          for (const g of (list || [])) {
            if (g && g.file) await cacheGame(c, g.file);
          }
        } catch (_) {}
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isPage) {
    // jaringan dulu -> cache hanya bila offline
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() =>
        /* offline: pakai halaman yang sama bila tersimpan (mis. game), baru halaman utama */
        caches.match(req).then((hit) => hit || caches.match('./index.html')).then((hit) => hit || caches.match('./'))
      )
    );
    return;
  }

  // aset statis: cache dulu
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
