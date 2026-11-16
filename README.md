# BIRU STUDIO

Video dan game untuk anak. Tanpa iklan, tanpa rekomendasi, bisa offline.
**BY SASAM**

## Isi

| File | Fungsi |
|---|---|
| `index.html` | aplikasi (layar VIDEO & GAME) |
| `app.js` | pendaftaran service worker |
| `manifest.webmanifest` | nama & ikon saat dipasang di layar utama |
| `sw.js` | service worker → aplikasi tetap terbuka tanpa internet |
| `icons/` | ikon 192, 512, maskable, apple-touch |

## Deploy

Static site. Di Vercel: framework **Other**, build command kosong, output directory kosong.

## Catatan

- Tombol admin bisa disembunyikan dari pengaturan (buka dengan mengetuk logo Biru 3× lalu PIN).
- PIN bawaan: `1234`
- Video yang di-upload dari file disimpan di perangkat; video YouTube butuh internet.

<!-- deploy: static site, tanpa build -->
