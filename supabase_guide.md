# Cara Setup Supabase untuk Aplikasi Bebe (Free PostgreSQL)

## Langkah 1: Buat Project Baru di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan login dengan GitHub.
2. Klik **New Project**.
3. Isi:
   - **Name**: `bebe`
   - **Database Password**: *(buat password kuat, simpan!)*
   - **Region**: Asia Singapore
   - **Pricing Plan**: **Free**
4. Klik **Create new project** (tunggu selesai, ±2 menit).

## Langkah 2: Dapatkan Database URL dari Supabase
Setelah project jadi:
1. Masuk ke project Supabase `bebe`.
2. Klik menu **Settings** -> **Database**.
3. Copy **Connection String** (ada di bagian **Connection Pooling** atau **Connection String**).
   Contoh format:  
   `postgresql://postgres:[PASSWORD]@db.[REGION].supabase.co:5432/postgres`

## Langkah 3: Update Environment Variables di Render
1. Buka project Web Service `bebe-backend` di Render.
2. Masuk ke **Environment** tab.
3. Tambahkan/Edit variabel:
   - `DB_URL` = *(paste Connection String Supabase yang tadi disalin)*

## Langkah 4: Jalankan Deploy di Render
Klik **Manual Deploy** -> **Latest Commit** untuk trigger deploy ulang.
Render akan otomatis koneksi ke Supabase PostgreSQL dan menjalankan migrasi.

## Catatan Penting:
- Database password Supabase harus disimpan dengan aman.
- Connection string berisi password — jangan di-share ke orang lain.
- Jika ada error koneksi, cek apakah IP Render di-white-list di Supabase (biasanya otomatis di-free tier Supabase).
