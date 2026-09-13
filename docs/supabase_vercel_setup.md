# Panduan Langkah Manual Detail: Setup Supabase & Deploy Vercel
**Winning Product Discovery Engine**

Dokumen ini berisi panduan langkah-demi-langkah (step-by-step) untuk mengonfigurasi database PostgreSQL di **Supabase** dan men-deploy dashboard Next.js ke **Vercel** pada paket gratis (Free/Hobby Tier).

---

## DAFTAR ISI
1. [BAGIAN 1: Setup Supabase (Database)](#bagian-1-setup-supabase-database)
   - [1.1 Membuat Proyek Supabase Baru](#11-membuat-proyek-supabase-baru)
   - [1.2 Mengambil Kredensial API & Database URL](#12-mengambil-kredensial-api--database-url)
   - [1.3 Menjalankan Skrip DDL (Skema Database)](#13-menjalankan-skrip-ddl-skema-database)
   - [1.4 Verifikasi Tabel & View di Table Editor](#14-verifikasi-tabel--view-di-table-editor)
   - [1.5 Menyiapkan `.env` Lokal untuk Pipeline Python](#15-menyiapkan-env-lokal-untuk-pipeline-python)
2. [BAGIAN 2: Deploy Dashboard ke Vercel](#bagian-2-deploy-dashboard-ke-vercel)
   - [2.1 Memastikan Repository GitHub Sudah Ter-Push](#21-memastikan-repository-github-sudah-ter-push)
   - [2.2 Import Repository di Vercel Dashboard](#22-import-repository-di-vercel-dashboard)
   - [2.3 Konfigurasi Root Directory (Kritis!)](#23-konfigurasi-root-directory-kritis)
   - [2.4 Memasukkan Environment Variables di Vercel](#24-memasukkan-environment-variables-di-vercel)
   - [2.5 Deployment Pertama](#25-deployment-pertama)
   - [2.6 Mengatur `NEXT_PUBLIC_BASE_URL` & Redeploy](#26-mengatur-next_public_base_url--redeploy)
3. [BAGIAN 3: Integrasi GitHub Actions (Automasi Mingguan)](#bagian-3-integrasi-github-actions-automasi-mingguan)
4. [BAGIAN 4: Panduan Troubleshooting Masalah Umum](#bagian-4-panduan-troubleshooting-masalah-umum)

---

## BAGIAN 1: Setup Supabase (Database)

### 1.1 Membuat Proyek Supabase Baru
1. Buka browser dan kunjungi [https://supabase.com](https://supabase.com).
2. Klik **Sign In** atau **Start your project** (login menggunakan akun GitHub Anda).
3. Di halaman dashboard Supabase, klik tombol **"New Project"**.
4. Isi formulir pembuatan proyek:
   - **Organization**: Pilih organisasi Anda (default akun Anda).
   - **Name**: Isi dengan `winning-product-engine` (atau nama pilihan Anda).
   - **Database Password**: Buat password yang kuat dan **simpan/catat password ini** karena tidak akan ditampilkan lagi.
   - **Region**: Pilih yang paling dekat dengan Indonesia untuk latensi terendah, yaitu:  
     `Southeast Asia (Singapore) - ap-southeast-1`.
   - **Pricing Plan**: Pilih **Free Plan** ($0/month).
5. Klik tombol **"Create new project"**.
6. Tunggu 1–2 menit hingga provisioning database selesai (status berubah menjadi hijau / "Active").

---

### 1.2 Mengambil Kredensial API & Database URL

Anda memerlukan dua jenis kredensial:
1. **API Keys** (untuk Vercel Next.js Dashboard)
2. **Database Connection String** (untuk Pipeline Python & GitHub Actions)

#### A. Mengambil API Keys (Untuk Vercel Dashboard)
1. Di sidebar kiri Supabase, klik icon **Settings** (roda gigi di paling bawah) atau buka **Project Settings**.
2. Klik tab menu **"API"** (di bawah bagian Configuration).
3. Temukan dan salin informasi berikut:
   - **Project URL**: Format `https://[PROJECT-REF].supabase.co`  
     *(Ini akan menjadi `NEXT_PUBLIC_SUPABASE_URL`)*
   - **Project API Keys**:
     - `anon` / `public`: String panjang JWT public.  
       *(Ini akan menjadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`)*
     - `service_role` / `secret`: Klik **"Reveal"** untuk melihat string rahasia ini.  
       *(Ini akan menjadi `SUPABASE_SERVICE_ROLE_KEY`)*  
       > ⚠️ **PERINGATAN KEAMANAN**: Kunci `service_role` memiliki akses bypass Row Level Security. JANGAN PERNAH menyimpannya di file publik atau commit ke Git. Hanya simpan di Vercel Environment Variables dan `.env.local`.

#### B. Mengambil Database Connection String (Untuk Python Pipeline)
1. Masih di **Project Settings**, klik tab menu **"Database"**.
2. Gulir ke bawah ke bagian **"Connection string"**.
3. Pilih tab **URI**:
   - Anda akan melihat format:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
     ```
   - Atau Direct Connection:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
4. Ganti teks `[YOUR-PASSWORD]` dengan password database yang Anda buat pada langkah 1.1.
5. Salin string lengkap ini. *(Ini akan menjadi variabel `DATABASE_URL`)*.

---

### 1.3 Menjalankan Skrip DDL (Skema Database)

File DDL berada di folder `sql/` pada repository. Anda harus menjalankannya secara berurutan di Supabase SQL Editor.

1. Di sidebar kiri Supabase, klik icon **SQL Editor** (ikon terminal/dokumen code).
2. Klik tombol **"New query"** (atau tanda `+`).
3. Jalankan 4 skrip berikut **secara berurutan**:

#### Query 1: Dimensi (File: `sql/01_ddl_dimensions.sql`)
- Buka file `sql/01_ddl_dimensions.sql` di editor lokal Anda, copy seluruh isinya, dan paste ke SQL Editor Supabase.
- Klik tombol **"Run"** (atau tekan `Cmd + Enter` / `Ctrl + Enter`).
- Pastikan muncul notifikasi hijau: `Success. No rows returned`.
- *Isi tabel yang dibuat:* `dim_category_keyword`, `dim_competitor_product`.

#### Query 2: Fakta (File: `sql/02_ddl_facts.sql`)
- Buat tab query baru (klik `+`).
- Copy seluruh isi `sql/02_ddl_facts.sql` dan paste ke SQL Editor.
- Klik **"Run"**.
- Pastikan muncul notifikasi hijau: `Success. No rows returned`.
- *Isi tabel yang dibuat:* `fact_product_snapshot`, `fact_customer_reviews`.

#### Query 3: Scoring & Peluang (File: `sql/03_ddl_scoring.sql`)
- Buat tab query baru (klik `+`).
- Copy seluruh isi `sql/03_ddl_scoring.sql` dan paste ke SQL Editor.
- Klik **"Run"**.
- Pastikan muncul notifikasi hijau: `Success. No rows returned`.
- *Isi tabel yang dibuat:* `fact_sourcing_opportunity`.

#### Query 4: View Analitik Agregasi (File: `sql/04_view_subcategory_features.sql`)
- Buat tab query baru (klik `+`).
- Copy seluruh isi `sql/04_view_subcategory_features.sql` dan paste ke SQL Editor.
- Klik **"Run"**.
- Pastikan muncul notifikasi hijau: `Success. No rows returned`.
- *Isi view yang dibuat:* `vw_subcategory_features`.

---

### 1.4 Verifikasi Tabel & View di Table Editor

1. Di sidebar kiri Supabase, klik icon **Table Editor** (ikon tabel).
2. Pastikan di panel skema `public` muncul:
   - ✅ `dim_category_keyword`
   - ✅ `dim_competitor_product`
   - ✅ `fact_product_snapshot`
   - ✅ `fact_customer_reviews`
   - ✅ `fact_sourcing_opportunity`
3. Klik icon **Database** -> **Views** di sidebar kiri untuk memverifikasi bahwa:
   - ✅ `vw_subcategory_features` sudah aktif.

---

### 1.5 Menyiapkan `.env` Lokal untuk Pipeline Python

Agar Anda bisa menjalankan pipeline Python dari komputer Anda (lokal):

1. Buat file `.env` di root repository (`/Winning-Product-Discovery-Engine/.env`):
   ```bash
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
2. Jalankan uji koneksi dan pipeline singkat jika diinginkan:
   ```bash
   python3 pipeline/run_all.py
   ```
   *(Data awal akan masuk ke tabel Supabase)*.

---

## BAGIAN 2: Deploy Dashboard ke Vercel

### 2.1 Memastikan Repository GitHub Sudah Ter-Push

1. Pastikan seluruh perubahan kode sudah ter-commit dan ter-push ke GitHub:
   ```bash
   git status
   git add .
   git commit -m "feat: complete supabase ddl and vercel dashboard"
   git push origin main
   ```

---

### 2.2 Import Repository di Vercel Dashboard

1. Kunjungi [https://vercel.com](https://vercel.com) dan login (disarankan via akun GitHub Anda).
2. Di dashboard Vercel, klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Di daftar repository GitHub yang terhubung, cari repository **`Winning-Product-Discovery-Engine`**.
4. Klik tombol **"Import"** di samping repository tersebut.

---

### 2.3 Konfigurasi Root Directory (Kritis!)

> ⚠️ **PERHATIAN SANGAT PENTING**:  
> Folder Next.js berada di subdirektori `dashboard/`, BUKAN di root repository. Jika Anda melewatkan langkah ini, build Vercel akan mencari Next.js di root dan gagal!

1. Pada halaman konfigurasi project di Vercel ("Configure Project"):
2. Cari bagian **"Root Directory"**.
3. Klik tombol **"Edit"** di samping field Root Directory.
4. Pilih atau ketik: `dashboard`
5. Klik **"Continue"**.
6. Vercel akan secara otomatis mendeteksi:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

---

### 2.4 Memasukkan Environment Variables di Vercel

Sebelum menekan tombol Deploy, buka accordion **"Environment Variables"** pada halaman yang sama.

Tambahkan 4 variabel berikut satu per satu:

| Key | Value (Contoh) | Deskripsi |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzcompany.supabase.co` | URL proyek Supabase (dari Langkah 1.2A) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Kunci anon/public Supabase (dari Langkah 1.2A) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Kunci service_role rahasia Supabase (dari Langkah 1.2A) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Sementara isi localhost, akan diperbarui di Langkah 2.6 |

*Catatan: Pastikan centang "Production", "Preview", dan "Development" aktif untuk semua variabel.*

---

### 2.5 Deployment Pertama

1. Klik tombol **"Deploy"**.
2. Tunggu proses build berlangsung (~1–2 menit).
3. Anda akan melihat animasi confetti dengan tulisan:  
   🎉 **"Congratulations! You just deployed a new Next.js App."**
4. Klik tombol **"Continue to Dashboard"** atau klik thumbnail preview untuk melihat aplikasi Anda.
5. Catat domain yang diberikan oleh Vercel, misalnya:  
   `https://winning-product-discovery-engine.vercel.app`

---

### 2.6 Mengatur `NEXT_PUBLIC_BASE_URL` & Redeploy

Agar server-side fetch di App Router Next.js bekerja optimal di lingkungan production Vercel:

1. Di dashboard proyek Vercel Anda, buka tab **"Settings"**.
2. Di menu samping kiri, klik **"Environment Variables"**.
3. Cari variabel **`NEXT_PUBLIC_BASE_URL`**.
4. Klik icon titik tiga (`...`) di sebelah kanan, pilih **"Edit"**.
5. Ubah nilainya menjadi URL Vercel produksi Anda:
   ```
   https://winning-product-discovery-engine.vercel.app
   ```
   *(Gunakan domain asli proyek Vercel Anda tanpa trailing slash `/`)*.
6. Klik **"Save"**.
7. Lakukan Redeploy agar nilai baru ini aktif:
   - Buka tab **"Deployments"** di bagian atas.
   - Klik titik tiga (`...`) pada deployment terbaru di daftar teratas.
   - Pilih **"Redeploy"**.
   - Centang opsi default lalu klik **"Redeploy"**.
8. Setelah selesai (~1 menit), buka URL Vercel Anda.
9. Tes 3 halaman navigasi:
   - `/` (Market Landscape & WPS Leaderboard)
   - `/pricing` (Pricing Distribution & Sentiment Pain Points)
   - `/sourcing` (HPP & Margin Simulator)

---

## BAGIAN 3: Integrasi GitHub Actions (Automasi Mingguan)

Repository ini memiliki workflow GitHub Actions di `.github/workflows/weekly_pipeline.yml` yang berjalan otomatis setiap Minggu malam (Senin 03:00 WIB) untuk mengupdate data produk dan scoring WPS.

Agar workflow ini dapat menulis data langsung ke database Supabase Anda:

1. Buka repository Anda di **GitHub**.
2. Klik tab **"Settings"** (di bar navigasi repo atas).
3. Di sidebar kiri, klik **"Secrets and variables"** -> **"Actions"**.
4. Di bagian **Repository secrets**, klik tombol **"New repository secret"**.
5. Isi formulir:
   - **Name**: `DATABASE_URL`
   - **Secret**: Masukkan connection string Supabase Anda (sama persis dengan yang di Langkah 1.2B):
     ```
     postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
6. Klik **"Add secret"**.
7. **Uji Coba Manual (Workflow Dispatch)**:
   - Buka tab **"Actions"** di repo GitHub Anda.
   - Di daftar workflow sebelah kiri, klik **"Weekly Product Discovery Pipeline"**.
   - Klik tombol **"Run workflow"** di sisi kanan, pilih branch `main`, dan klik **"Run workflow"**.
   - Pantau eksekusi: workflow akan menjalankan testing (pytest) dan mengeksekusi pipeline end-to-end ke Supabase.

---

## BAGIAN 4: Panduan Troubleshooting Masalah Umum

### 1. Build Vercel Gagal: "Cannot find module next" atau "No Next.js package found"
- **Penyebab**: Root directory di Vercel masih mengarah ke root repo (`/`), bukan ke subfolder Next.js.
- **Solusi**: Masuk ke Vercel -> Settings -> General -> Root Directory -> ubah menjadi `dashboard` -> simpan -> Redeploy.

### 2. Error Database: `Tenant or user not found` / Connection Refused
- **Penyebab**: Format username atau host Supabase salah.
- **Solusi**: 
  - Jika menggunakan Port `6543` (Connection Pooler): Gunakan user `postgres.[PROJECT-REF]`.
  - Jika menggunakan Port `5432` (Direct Connection): Gunakan user `postgres` dan host `db.[PROJECT-REF].supabase.co`.
  - Pastikan password tidak mengandung karakter spesial yang tidak di-URL encode (jika ada karakter seperti `@`, `#`, ganti password database di Supabase dengan karakter alfanumerik yang kuat).

### 3. Halaman Dashboard Kosong / Data Belum Muncul
- **Penyebab**: Tabel Supabase baru dibuat (DDL selesai), tetapi pipeline scraping/scoring belum dijalankan sehingga tabel fakta masih kosong (`0 rows`).
- **Solusi**: Jalankan pipeline lokal sekali dengan `python3 pipeline/run_all.py` atau trigger via GitHub Actions (Langkah 3). Data akan terisi dan langsung muncul di dashboard Vercel secara real-time.

### 4. Supabase Free Tier Pausing (Inaktivitas)
- **Info**: Supabase Free Tier akan menonaktifkan sementara (*pause*) proyek jika tidak ada request database selama 7 hari berturut-turut.
- **Solusi**: Karena GitHub Actions berjalan otomatis setiap pekan (`0 20 * * 0`), proyek Anda akan otomatis tetap aktif dan tidak akan pernah ter-pause.

---

*Panduan selesai. Seluruh sistem kini beroperasi otomatis: Pipeline Python mengolah data ke Supabase -> Supabase menyimpan data -> Vercel Dashboard menyajikan analitik secara real-time.*
