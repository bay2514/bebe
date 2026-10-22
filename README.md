# Tabungan Berdua (Bebe)

Aplikasi pencatatan tabungan bersama dan katalog voucher (date ideas & keinginan) untuk pasangan.

## Struktur Repositori
- `backend/`: Laravel API + Sanctum SPA + SQLite
- `frontend/`: React + Vite + Tailwind CSS
- `docs/`: Dokumentasi proyek (PROJECT-BRIEF.md, UI-STYLE.md, PROGRESS.md)

## Panduan Menjalankan (Lingkungan Lokal)

### Persiapan
1. Salin file environment lokal:
   ```bash
   cd backend
   cp .env.local.example .env
   ```

2. Generate `APP_KEY`:
   ```bash
   php artisan key:generate
   ```

3. Jalankan migrasi database (SQLite):
   ```bash
   php artisan migrate
   ```

### Terminal 1: Jalankan Backend Laravel
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

Backend akan tersedia di: `http://localhost:8000`

### Terminal 2: Jalankan Frontend React
```bash
cd frontend
npm install
npm run dev
```

Frontend akan tersedia di: `http://localhost:5173`

### Cara Membuat Akun (Couple)
Setelah backend berjalan:
```bash
cd backend
php artisan db:seed --class=CoupleSeeder
```

atau gunakan command khusus (hanya untuk lokal):
```bash
php artisan couple:create
```

## API Configuration
- Frontend menggunakan path relatif (`/api/v1`) yang secara otomatis diarahkan ke `http://localhost:8000/api/v1` oleh Vite proxy.
- Sanctum stateful domains sudah dikonfigurasi untuk `localhost:5173` dan `127.0.0.1:5173`.

## Panduan Deployment
Lihat `docs/DEPLOY.md` untuk deployment ke Railway dengan Supabase Session Pooler.
