# Brief: Tabungan Berdua (Voucher Wishlist + Savings Tracker)
Aplikasi untuk 2 pengguna (pasangan): tabungan bersama, katalog voucher (date
ideas dan keinginan) berharga rupiah, redeem voucher memotong saldo, dan riwayat.
Bahasa antarmuka: Indonesia. Gaya tampilan: docs/UI-STYLE.md.
Stack: React (Vite) + Tailwind di frontend/, Laravel API + Sanctum SPA di backend/.
Dev: SQLite, `php artisan serve --host=0.0.0.0 --port=8000`, Vite proxy /api dan /sanctum.

## Fitur
1. Saldo bersama: satu wallet dengan 2 anggota setara.
2. Tambah saldo: nominal, catatan, tanggal, siapa yang menabung.
3. Katalog voucher: judul, deskripsi, kategori (Makan, Hiburan, Belanja,
   Jalan-jalan, Lainnya), emoji, harga, aktif/arsip, sekali atau berulang. CRUD.
4. Redeem: dialog konfirmasi (saldo sekarang dan sesudahnya). Jika cukup, saldo
   terpotong, tercatat, voucher masuk "Voucher Saya" (Siap dipakai, lalu Sudah dipakai).
5. Riwayat: filter jenis dan tanggal, pencarian, saldo setelah tiap transaksi,
   ringkasan bulan ini.

## Aturan uang (WAJIB, diuji otomatis)
- Uang = integer rupiah, tidak boleh float.
- Ledger append-only: tanpa edit atau hapus; koreksi lewat transaksi pembalik.
  Jenis: deposit, redeem, refund, adjustment. Kolom: wallet_id, user_id, type,
  amount (positif), direction (in/out), voucher_id nullable, note, balance_after,
  occurred_at.
- Deposit dan redeem dalam DB::transaction dengan lockForUpdate pada wallet.
  Saldo tidak boleh minus (422 "Saldo belum cukup"). wallets.balance hanya cache
  yang diperbarui di transaksi yang sama.
- Redeem idempoten lewat header Idempotency-Key (tidak memotong dua kali).
- Hanya anggota wallet yang boleh membaca atau menulis (Policy, 403 jika bukan).
- Harga voucher disalin ke transaksi saat redeem (snapshot).

## Backend
- Sanctum SPA (cookie), tanpa token di localStorage. Tanpa pendaftaran publik:
  akun dibuat lewat `php artisan couple:create` (input interaktif, tidak ada
  kata sandi di kode atau seeder). Rate limit login, FormRequest, pesan error
  Indonesia, CORS dan stateful domain untuk localhost:5173.
- Endpoint /api/v1: POST /login, POST /logout, GET /me; GET /summary;
  GET dan POST /transactions (POST hanya deposit); GET, POST, PUT, DELETE
  /vouchers (arsipkan jika pernah di-redeem); POST /vouchers/{id}/redeem;
  GET /redemptions; POST /redemptions/{id}/use.
- Tabel: users, wallets, wallet_user, vouchers, transactions, redemptions,
  idempotency_keys. Seeder contoh hanya untuk lokal.
- Tes (Pest atau PHPUnit): redeem sukses, saldo tidak cukup, redeem ganda dengan
  kunci sama, non-anggota ditolak, deposit menambah saldo, balance_after
  berurutan, ledger tidak bisa diubah. Kontrak API di docs/api-contract.md.

## Frontend
Mobile-first, navigasi bawah (Beranda, Voucher, Tambah, Riwayat, Saya). Halaman:
Login; Beranda (kartu saldo, Tambah Saldo, voucher yang bisa diredeem, 5
transaksi terakhir); Voucher (kartu, filter kategori, pencarian, Redeem dengan
konfirmasi); Voucher Saya; Tambah Saldo (preset 10rb, 25rb, 50rb, 100rb, bebas);
Riwayat; Kelola Voucher; Pengaturan. Format Rp id-ID, tombol minimal 44 px,
loading, kosong, error, toast, tombol nonaktif saat proses (cegah klik ganda),
Idempotency-Key unik per percobaan redeem. Data lewat satu lapisan API
(src/shared/api) dan hook; tanpa logika saldo di frontend.

## Aturan kerja
- Branch dev; jangan push, jangan force push; commit kecil.
- Setelah tiap fase: tes backend lolos dan `npm run build` bersih, commit,
  centang di docs/PROGRESS.md, lalu berhenti dan laporkan. Sesi baru membaca
  PROGRESS.md dan `git log` lalu lanjut ke fase berikutnya.
- Jangan simpan kata sandi, token, atau data pribadi di kode. .env tidak
  di-commit; sediakan .env.example; jangan tampilkan isi .env.
- Jangan install dependensi di luar yang wajar (Laravel, Sanctum, Pest atau
  PHPUnit, React, Router, Tailwind) tanpa menyebut nama dan alasan.
- Tanya jika ada yang tidak jelas; jangan menebak aturan uang.

## Fase
0. Scaffold: frontend/ (Vite React Tailwind, router, alias, ESLint, ErrorBoundary),
   backend/ (Laravel, Sanctum, SQLite), .gitignore, README. Verifikasi php,
   composer, npm tersedia.
1. Backend inti: migrasi, model, Policy, couple:create, layanan wallet (deposit,
   redeem, refund), tes uang.
2. Backend API: semua endpoint, validasi, rate limit, kontrak API.
3. Frontend fondasi: token desain dan komponen sesuai UI-STYLE.md, layout,
   navigasi bawah, login (Sanctum SPA), ProtectedRoute, lapisan API.
4. Beranda, Tambah Saldo, Riwayat.
5. Voucher: katalog, Redeem (konfirmasi, idempoten), Voucher Saya, Kelola Voucher.
6. QA: tes, smoke test semua rute di HP, aksesibilitas, README cara menjalankan.
