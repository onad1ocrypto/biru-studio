/* BIRU STUDIO — daftarkan service worker agar aplikasi bisa dibuka tanpa internet */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
