# Telco-App: Sistem Rekomendasi

## 1. Deskripsi Proyek

Telco-App adalah aplikasi web full-stack telekomunikasi yang memanfaatkan Machine Learning untuk merekomendasikan paket layanan terbaik berdasarkan profil penggunaan pelanggan.

**Teknologi Utama:**
* Backend: Python (Flask), PostgreSQL, Psycopg2.
* Frontend: JavaScript (Native/Vanilla), Webpack.
* Machine Learning: Scikit-Learn, TensorFlow/Keras (h5), Pandas.

## 2. Petunjuk Setup Environment

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:
* Python 3.11
* Node.js & npm
* PostgreSQL 16/17

### A. Konfigurasi Database

**Setup Database (PostgreSQL):** Buat database baru bernama `telco_app`:

**Opsi 1: Menggunakan Terminal**
```bash
# Membuat database
createdb -U postgres telco_app

# Atau melalui psql
psql -U postgres -c "CREATE DATABASE telco_app;"
```

**Opsi 2: Menggunakan pgAdmin**
1. Buka pgAdmin dan login
2. Klik kanan pada **Databases** → pilih **Create** → **Database**
3. Masukkan nama database: `telco_app`
4. Klik **Save**

Jalankan query SQL untuk membuat tabel:

**Opsi 1: Menggunakan Terminal**
```bash
# Pastikan database 'telco_app' sudah dibuat sebelumnya
psql -U postgres -d telco_app -f backend/data/create_tables.sql

# Masukkan data dummy
psql -U postgres -d telco_app -f backend/data/insert_tables.sql
```

**Opsi 2: Menggunakan pgAdmin**
1. Di pgAdmin, klik kanan pada database `telco_app` → pilih **Query Tool**
2. Buka file `backend/data/create_tables.sql`, copy isinya, paste ke Query Tool
3. Klik tombol **Execute/Run** (ikon play) atau tekan **F5**
4. Ulangi langkah 2-3 untuk file `backend/data/insert_tables.sql`

**Alternatif: Restore dari Backup**

Jika perintah `create_tables.sql` dan `insert_tables.sql` tidak berhasil, gunakan file backup:

**Opsi 1: Menggunakan Terminal**
```bash
# Restore database dari file backup
pg_restore -U postgres -d telco_app backend/data/telco.backup
```

**Opsi 2: Menggunakan pgAdmin**
1. Klik kanan pada database `telco_app` → pilih **Restore**
2. Pada bagian **Filename**, klik ikon folder dan pilih file `backend/data/telco.backup`
3. Klik **Restore**

### B. Konfigurasi Backend

**Buat Virtual Environment:** Buka terminal di folder root proyek, lalu jalankan:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Instal Dependencies Python:**
```bash
pip install -r backend/requirements.txt
```

**Konfigurasi Environment Variables:** Salin file `.env.example` di dalam folder backend menjadi `.env`. Sesuaikan konfigurasi berikut:
```bash
cd backend
cp .env.example .env
```

Edit file `.env` dan sesuaikan `SECRET_KEY`, `SENDGRID_API_KEY`, `MAIL_SENDER`, dan `DATABASE_URL` (password postgres) sesuai konfigurasi Anda.

### C. Konfigurasi Frontend

**Instal Dependencies Node.js:** Buka terminal baru (pastikan berada di root folder proyek):
```bash
npm install
```

## 3. Tautan dan Konfigurasi Model ML

Model Machine Learning yang digunakan untuk sistem rekomendasi dan prediksi sudah disertakan di dalam repositori ini. 

**Lokasi Model:** File model terletak di direktori: `backend/ml/`

**Daftar File Model:**
* `telco_model.h5`: Model utama (Machine Learning).
* `telco_le.pkl`: Label Encoder (untuk decoding hasil prediksi).
* `telco_scaler.pkl`: Scaler (untuk normalisasi data input).
* `telco_vec.pkl`: Vectorizer (jika menggunakan pemrosesan teks).

**Cara Memuat Model (Load):** Aplikasi secara otomatis memuat model ini saat server Flask dijalankan. Logika pemuatan model terdapat pada file:

`backend/models/ml_model.py`

**⚠️ PENTING - Unduh Model ML:**

Jika file `.h5` atau `.pkl` tidak ada di folder `backend/ml/` (karena limit ukuran Git), **WAJIB** unduh dari link berikut:

📥 **Download Link:** [MODEL-MACHINE-LEARNING](https://drive.google.com/drive/folders/1G6xqj8qly8R2N5zTPofVMagay-IRgV9g?usp=sharing)

Setelah diunduh, letakkan semua file model ke dalam folder `backend/ml/`.

## 4. Cara Menjalankan Aplikasi

Anda perlu menjalankan dua terminal secara bersamaan (satu untuk Backend, satu untuk Frontend).

**Terminal 1: Menjalankan Backend (Server API)** Pastikan virtual environment aktif dan berada di root folder.
```bash
# Jalanan Python
python backend/main.py
```

Server akan berjalan di: `http://localhost:5000`

**Terminal 2: Menjalankan Frontend (UI)** Buka terminal baru di root folder proyek.
```bash
# Mode Development (dengan Hot Reload)
npm run start-dev

# Mode Production
npm run serve

# Build Project
npm run build
```

Aplikasi Frontend akan berjalan di: `http://localhost:9000` (Sesuai konfigurasi .env).