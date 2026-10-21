# Panduan Deploy Backend Bebe ke Google Cloud Run

## Persiapan Awal
1. Pastikan Anda memiliki akun Google Cloud (mendaftar gratis, memerlukan kartu kredit untuk verifikasi identitas, namun ada Free Tier yang besar).
2. Buka [Google Cloud Console](https://console.cloud.google.com/).

## Langkah 1: Buat Project Baru
1. Di bagian atas dashboard, klik dropdown project, lalu klik **New Project**.
2. Beri nama project (contoh: `bebe-backend`), lalu klik **Create**.

## Langkah 2: Aktifkan API yang Dibutuhkan
1. Di search bar atas, cari dan buka **Cloud Run API**, lalu klik **Enable**.
2. Cari dan buka **Artifact Registry API**, lalu klik **Enable**.

## Langkah 3: Deploy via Cloud Run (Hubungkan ke GitHub)
1. Buka halaman **Cloud Run** di console Google Cloud.
2. Klik **Create Service**.
3. Pilih opsi: **Continuously deploy new revisions from a source repository**.
4. Klik **Set up with Cloud Build** dan hubungkan repository GitHub Anda (`bebe`).
5. Konfigurasi service:
   - **Service name**: `bebe-backend`
   - **Region**: Pilih `asia-southeast1` (Singapore) agar akses cepat.
   - **Authentication**: Pilih **Allow unauthenticated invocations** (agar publik/frontend bisa mengakses API).
6. Konfigurasi Build & Container:
   - **Branch**: `dev`
   - **Build type**: **Dockerfile** (Cloud Run akan otomatis membaca `backend/Dockerfile` kita).
   - **Root directory**: `backend`
   - **Port**: `80` (Cloud Run akan otomatis meneruskan ke `$PORT` yang kita tangani di Dockerfile).
7. Di bagian **Variables & Secrets** (Environment Variables), tambahkan:
   - `APP_ENV` = `production`
   - `APP_DEBUG` = `false`
   - `APP_KEY` = `base64:s1FZkaUV5h8MQtD26mM7KfPhow86KzH+RLT3abcTCKc=`
   - `DB_CONNECTION` = `sqlite`
8. Klik **Create**.

## Langkah 4: Selesai!
Cloud Run akan otomatis melakukan build dari GitHub dan memberikan URL publik (contoh: `https://bebe-backend-xxxx-as.a.run.app`). 
Salin URL tersebut untuk dihubungkan ke frontend Netlify!
