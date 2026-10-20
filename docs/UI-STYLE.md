# Gaya tampilan: lucu, hangat, nuansa pink
Kesan: seperti aplikasi untuk berdua, ceria dan lembut, tapi rapi dan mudah
dibaca. Lucu lewat bentuk, warna, copywriting, dan animasi kecil, bukan lewat
hiasan berlebihan.

## Token warna (satu tempat: tailwind.config.js, nama kelas: pink, cream, plum, dll.)
- bg halaman: pink-50 #FFF5F8; permukaan kartu: #FFFFFF; permukaan lembut: pink-100 #FFE4EC
- pink-200 #FFC9DA, pink-300 #FFA3C0, pink-400 #FF7AA5 (dekorasi, ikon, isian besar)
- pink-500 #F9558C (aksen cerah; JANGAN untuk teks kecil atau latar teks putih)
- pink-600 #D42A6C = warna tombol utama (teks putih, kontras 4,8:1); hover #C21F5C
- pink-700 #B8245F = teks tautan dan aksen teks di atas terang (kontras 5,7:1)
- plum-900 #4A2234 = teks utama; plum-600 #7A5163 = teks sekunder
- aksen kedua: lavender #E9DDFF (badge, latar ilustrasi), butter #FFE8A3 dan
  gold #F5B544 (koin, saldo, bintang), mint #CFF5E4 dengan teks #1E7F5C (sukses)
- bahaya: teks #D6334C di atas putih. Gradasi kartu saldo:
  dari #FF7AA5 ke #F9558C ke #D42A6C, teks putih tebal dan besar saja.
- Semua pasangan teks dan latar harus minimal 4,5:1 (teks besar 3:1).

## Bentuk, jarak, bayangan
- Radius besar: kartu 20 px, tombol pill (999 px), input 16 px, bottom sheet 28 px di atas.
- Bayangan lembut berwarna pink: 0 8px 24px rgba(212,42,108,.12).
- Jarak lega (kelipatan 4 dan 8), padding kartu 16 sampai 20 px, tombol tinggi minimal 48 px.
- Garis tipis pink-200, bukan abu-abu.

## Tipografi
- Judul, angka, dan label tombol: Fredoka (bulat dan ramah), bobot 500 sampai 700.
- Isi teks: Nunito, bobot 400 sampai 700, 16 px, line-height 1.6.
- Muat dari Google Fonts di index.html (preconnect + display=swap), dengan fallback
  ui-rounded, system-ui, sans-serif. Teks kecil minimal 12 px.
- Angka rupiah selalu tebal dan berukuran besar di kartu saldo (tabular-nums).

## Komponen khas
- Kartu saldo: gradasi pink, hiasan hati dan bintang kecil transparan di sudut
  (SVG inline), judul "Tabungan Berdua", angka Rp besar, dua ringkasan kecil
  (masuk dan keluar bulan ini).
- Kartu voucher: gaya tiket dengan lekukan setengah lingkaran di kiri dan kanan
  (CSS mask atau pseudo-element) dan garis putus-putus pemisah; emoji besar di
  kiri, judul, deskripsi singkat, badge kategori warna lembut, harga di dalam
  pil emas. Voucher yang saldonya belum cukup tampil lebih pudar dengan teks
  "Kurang Rp 25.000 lagi" dan tombol nonaktif, bukan disembunyikan.
- Tombol Redeem: pill pink-600; saat ditekan membuka bottom sheet konfirmasi
  yang menampilkan voucher, harga, "Saldo sekarang", "Saldo setelahnya", dan
  tombol "Yuk, redeem!" dan "Nanti dulu".
- Navigasi bawah melayang berbentuk pil putih dengan bayangan pink, ikon
  membulat; item aktif berlatar pink-100 dengan label. Tombol tengah "Tambah"
  berbentuk lingkaran pink-600 yang sedikit menonjol (ikon plus).
- Chip kategori, progress bar target tabungan berbentuk pil dengan isian
  gradasi dan ikon hati di ujungnya, avatar dua orang bertumpuk.
- Riwayat: baris berikon bulat (hijau lembut untuk masuk, pink untuk keluar),
  angka berwarna DAN bertanda (+ dan -) agar tidak mengandalkan warna saja.

## Gerak (halus, ceria)
- Hover dan tekan: skala 0.97 sampai 1.02, 150 sampai 200 ms.
- Setelah redeem sukses: hujan hati dan konfeti kecil selama 1,2 detik, dibuat
  dengan elemen CSS atau canvas kecil buatan sendiri TANPA dependensi baru,
  plus toast "Yeay! Voucher masuk ke Voucher Saya".
- Setelah tambah saldo: angka saldo berhitung naik (count-up 600 ms) dan hati
  kecil melayang.
- Skeleton berdenyut lembut. Semua animasi mati atau diperkecil saat
  prefers-reduced-motion aktif. Jangan ada animasi yang berulang tanpa henti.

## Nada tulisan (Bahasa Indonesia, hangat dan santai)
- Kosong: "Belum ada tabungan nih. Yuk mulai nabung berdua!"
- Saldo kurang: "Sedikit lagi! Kurang Rp 25.000 untuk voucher ini."
- Sukses nabung: "Mantap! Tabungan bertambah Rp 50.000."
- Error: "Ups, ada yang salah. Coba lagi sebentar ya."
- Tombol jelas dan singkat (Tambah Saldo, Redeem, Simpan, Batal).
- Pakai emoji secukupnya (satu per judul atau kartu); jangan di dalam kalimat panjang.

## Ilustrasi dan ikon
- Empty state dan login memakai ilustrasi SVG sederhana buatan sendiri (dua
  hati, celengan, tiket), warna dari token. Jangan mengunduh gambar dari
  internet dan jangan memakai karakter berhak cipta.
- Ikon outline membulat dari komponen ikon yang sudah ada, ukuran eksplisit.

## Aksesibilitas dan kinerja (wajib)
- Fokus terlihat (cincin pink-600 2 px), area sentuh minimal 44 px (tombol 48 px).
- Info tidak hanya lewat warna; aria-label untuk tombol ikon; kontras sesuai di atas.
- Bundel ringan: tanpa pustaka animasi, gambar dekoratif berupa SVG inline.
