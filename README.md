# Tabungan Berdua (Bebe)

Aplikasi pencatatan tabungan bersama dan katalog voucher (date ideas & keinginan) untuk pasangan.

## Struktur Repositori
- `backend/`: Laravel API + Sanctum SPA + SQLite
- `frontend/`: React + Vite + Tailwind CSS
- `docs/`: Dokumentasi proyek (PROJECT-BRIEF.md, UI-STYLE.md, PROGRESS.md)

## Panduan Menjalankan
1. Backend:
   cd backend
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve --host=0.0.0.0 --port=8000

2. Frontend:
   cd frontend
   npm install
   npm run dev
