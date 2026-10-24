# Panduan Deploy ke Railway

## Prasyarat
- Akun Railway
- Akun Supabase (untuk PostgreSQL production)
- Repository GitHub `bebe` sudah di-merge ke branch yang di-track Railway

---

## Langkah Deploy di Railway

### 1. Buat Project Baru di Railway
1. Buka [Railway Dashboard](https://railway.app)
2. Klik **New Project**
3. Pilih **Deploy from GitHub repo**
4. Pilih repository `bebe` dan branch `dev`

### 2. Konfigurasi Service
- **Root Directory**: `backend`
- **Port**: Railway otomatis menggunakan `$PORT` dari Dockerfile

### 3. Tambahkan Environment Variables di Railway
Di tab **Variables**, tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `APP_NAME` | `Tabungan Berdua` | Nama aplikasi |
| `APP_ENV` | `production` | Mode produksi |
| `APP_DEBUG` | `false` | Matikan debug |
| `APP_KEY` | *(generate baru)* | Key Laravel |
| `APP_URL` | `https://bebe-xxxx.up.railway.app` | URL Railway (setelah deploy) |
| `LOG_CHANNEL` | `stderr` | Log ke stdout Railway |
| `LOG_LEVEL` | `info` | Level log |
| `DB_CONNECTION` | `pgsql` | PostgreSQL |
| `DB_HOST` | *(Pooler Host)* | **WAJIB** Gunakan Supabase Session Pooler |
| `DB_PORT` | `5432` | Port Pooler |
| `DB_DATABASE` | `postgres` | Nama database |
| `DB_USERNAME` | `postgres.xxx` | Username format `postgres.project-ref` |
| `DB_PASSWORD` | *(Password)* | Password database |
| `DB_SSLMODE` | `prefer` | SSL Mode |
| `SESSION_DRIVER` | `database` | Database session |
| `SESSION_SECURE_COOKIE` | `true` | Cookie HTTPS only |
| `SESSION_SAME_SITE` | `lax` | CSRF protection |
| `SANCTUM_STATEFUL_DOMAINS` | `bebe-xxxx.up.railway.app` | Domain (tanpa https://) |

### 4. Buat Database PostgreSQL di Supabase (Jika Belum)
1. Buka [supabase.com](https://supabase.com)
2. **New Project** -> Beri nama `bebe`
3. Region: **Asia Singapore**
4. Copy detail koneksi dari **Settings → Database**.
   - **PENTING**: Gunakan **Session Pooler** (Mode: Session, Port: 5432).
   - JANGAN gunakan koneksi langsung (Direct Connection) karena Railway sering tidak mendukung IPv6 outbound yang dibutuhkan oleh Supabase direct connection.

### 5. Generate APP_KEY Baru
```bash
cd backend
php artisan key:generate --show
```
Copy hasil (format: `base64:xxx...`) dan masukkan ke Railway variable `APP_KEY`.

### 6. Deploy
Klik **Deploy** atau **Manual Deploy** -> **Latest Commit**.

Tunggu proses build selesai (±5-10 menit).

---

## Opsi Deployment: Netlify vs Single Domain Railway

### 1. Kapan Menggunakan Netlify (Frontend) + Railway (Backend)?
- **Cocok jika:** Anda ingin frontend di-host di CDN global Netlify (kecepatan akses tinggi, otomatis preview branch, fitur form/serverless jika diperlukan).
- **Konfigurasi:** 
  - Frontend dideploy ke Netlify menggunakan `frontend/netlify.toml`.
  - Netlify melakukan proxying request `/api/*` dan `/sanctum/*` ke URL Railway backend Anda (diatur via `netlify.toml` / redirects).
  - Pastikan `SANCTUM_STATEFUL_DOMAINS` dan `APP_URL` di Railway sesuai dengan domain Netlify Anda (misal `app.netlify.app`), atau gunakan custom domain.

### 2. Kapan Menggunakan Satu Domain Railway (Monolitik / Static on Backend)?
- **Cocok jika:** Anda ingin kesederhanaan operasional (1 service di Railway yang melayani Laravel API sekaligus menyajikan file SPA build di `public/index.html`).
- **Konfigurasi:** 
  - Frontend di-build saat Docker build (`npm run build`) dan hasilnya disalin ke folder `backend/public/`.
  - Laravel menangani semua request SPA via wildcard fallback route (`routes/web.php`). Tidak memerlukan konfigurasi Netlify.

Buka **Terminal Railway** (tab **Deploy** -> **Run command**), lalu jalankan:

```bash
php artisan couple:create
```

Masukkan:
- Nama pasangan 1
- Nama pasangan 2
- Password (input tidak terlihat)

Setelah itu, login melalui `/login` dengan kredensial yang baru dibuat.

---

## Checklist Verifikasi

- [ ] Backend bisa diakses di `https://bebe-xxxx.up.railway.app`
- [ ] Login berhasil dengan akun yang dibuat via `couple:create`
- [ ] Get `/api/v1/me` mengembalikan data user yang login
- [ ] Tambah saldo berhasil (POST `/api/v1/transactions`)
- [ ] Redeem voucher berhasil (POST `/api/v1/vouchers/{id}/redeem`)
- [ ] Refresh halaman di route dalam (misal `/redemptions`) tidak 404
- [ ] Data saldo & voucher **bertahan** setelah redeploy
- [ ] API dipanggil dengan path relatif (`/api/v1/...`) tanpa domain

---

## Peringatan Keamanan

- **JANGAN** commit file `.env` — sudah ada di `.gitignore`
- **JANGAN** share `APP_KEY` atau `DB_URL` ke siapa pun
- `APP_DEBUG=false` sudah aktif di produksi
- Railway tidak menyediakan SQLite yang persisten — **wajib gunakan Supabase PostgreSQL**
- Jangan gunakan wildcard CORS (`*`) — sudah dikonfigurasi dengan domain Railway

---

## Troubleshooting & Penyebab Crash Umum

| Masalah / Error | Penyebab & Solusi |
|-----------------|-------------------|
| **`AH00534: More than one MPM loaded`** | Konflik modul MPM Apache karena image dasar PHP-Apache memuat `mpm_event` secara otomatis saat runtime. Diatasi secara andal langsung di **`entrypoint.sh`** sesaat sebelum Apache dinyalakan: skrip secara otomatis memindai dan menghapus semua modul MPM selain `mpm_prefork`, memastikan tautan `mpm_prefork.load`/`.conf` aktif, memindai `LoadModule mpm_*`, dan menjalankan `apache2ctl configtest` yang akan menggagalkan startup dengan pesan error jelas jika ada konflik. |
| **Migrasi Gagal (`php artisan migrate --force`)** | Koneksi database tidak tersambung atau salah kredensial. Cek log `entrypoint.sh` untuk pesan error detail. |
| **Port Tidak Cocok / Port 80 vs $PORT** | Railway mengharuskan aplikasi mendengar port `$PORT` (default 8080). `entrypoint.sh` sudah dikonfigurasi otomatis mengganti port di Apache. |
| **CRLF Line Endings di Skrip Start** | Berkas `entrypoint.sh` berformat Windows (CRLF) menyebabkan shell error (`\r: command not found`). Sudah diamankan dengan `.gitattributes` (`*.sh text eol=lf`). |
| `SQLSTATE[HY000] [1045]` | Periksa `DB_HOST` dan `DB_USERNAME` di Railway. Pastikan pakai **Session Pooler** host. |
| `Network is unreachable` | Railway tidak mendukung IPv6 outbound. Pastikan gunakan Supabase **Pooler** (IPv4). |
| `App key not set` | Set `APP_KEY` di Railway variables |
| `419 Page Expired` | Set `SANCTUM_STATEFUL_DOMAINS` dengan URL Railway yang benar |
| `500 Internal Error` | Cek logs di Railway tab **Logs**, pastikan migration berhasil |
