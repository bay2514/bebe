# API Contract & Endpoints - Tabungan Berdua

Base URL: `http://localhost:8000/api/v1`

## Autentikasi
Semua endpoint memerlukan header `Authorization: Bearer <token>` dari Laravel Sanctum.

---

### 1. Wallet & Saldo
- **GET /wallet**
  - Mengambil informasi saldo bersama dan daftar partner.
- **POST /wallet/deposit**
  - Menambah saldo tabungan.
  - Body: `amount` (integer, min 1), `note` (string, optional).
- **POST /wallet/refund**
  - Mengembalikan/koreksi saldo tabungan.
  - Body: `amount` (integer, min 1), `note` (string, required).

### 2. Voucher & Redeem
- **GET /vouchers**
  - Daftar katalog voucher aktif (filter: `category`, `search`).
- **GET /vouchers/{id}**
  - Detail satu voucher.
- **POST /vouchers/{id}/redeem**
  - Membeli/meredeem voucher menggunakan saldo bersama. Memotong saldo secara atomik dan mencatat transaksi + redemption.

### 3. Riwayat Transaksi (Ledger)
- **GET /transactions**
  - Riwayat mutasi/transaksi wallet (filter: `type`, `direction`, pagination).
- **GET /transactions/{id}**
  - Detail mutasi tertentu.

### 4. Voucher Saya (Redemptions)
- **GET /redemptions**
  - Daftar voucher yang sudah diredeem oleh pasangan (filter: `status`, pagination).
- **GET /redemptions/{id}**
  - Detail redemption dan snapshot harga/voucher terkait.
