/* BIRU STUDIO — daftarkan service worker agar aplikasi bisa dibuka tanpa internet */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      /* bila ada versi baru, langsung pakai tanpa perlu tutup aplikasi */
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            sw.postMessage('skip-waiting');
          }
        });
      });
      reg.update().catch(() => {});
    }).catch(() => {});

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!window.__biruReloaded) { window.__biruReloaded = true; /* biarkan, konten sudah baru */ }
    });
  });
}
