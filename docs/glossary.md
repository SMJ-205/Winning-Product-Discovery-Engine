# Glossary — Winning Product Discovery Engine

Daftar istilah teknis yang digunakan dalam sistem ini. Gunakan sebagai referensi saat membaca laporan WPS atau mempresentasikan proyek ke stakeholder non-teknis.

---

## A–G

| Istilah | Definisi |
|---------|----------|
| **Ads Budget** | Anggaran iklan berbayar (misal: Tokopedia Ads / Shopee Ads) yang dialokasikan per unit terjual. Default: 10% dari harga jual. |
| **Agregasi** | Penggabungan data dari banyak baris menjadi satu nilai ringkasan (misal: rata-rata, jumlah, median) per sub-kategori. |
| **CV (Coefficient of Variation)** | Standar deviasi dibagi rata-rata. Digunakan untuk mengukur stabilitas tren pencarian: CV < 0.3 = stabil, CV ≥ 0.3 = musiman/tidak stabil. |
| **Gap Score** | Skor yang mencerminkan "peluang perbaikan" — proporsi ulasan negatif kompetitor yang belum terselesaikan. Semakin tinggi = peluang diferensiasi lebih besar. |
| **GMV (Gross Merchandise Value)** | Total nilai transaksi bruto = Harga Jual × Unit Terjual per bulan. Digunakan sebagai ukuran besar pasar. |

---

## H–M

| Istilah | Definisi |
|---------|----------|
| **HPP (Harga Pokok Penjualan)** | Biaya yang dikeluarkan untuk mendapatkan/memproduksi satu unit produk dari supplier. Disebut juga COGS (Cost of Goods Sold). |
| **Idempotency** | Sifat operasi yang aman dijalankan berulang kali tanpa menghasilkan duplikat data. Diwujudkan dengan `UNIQUE(product_id, snapshot_date)` + `ON CONFLICT DO NOTHING`. |
| **Komisi Marketplace** | Biaya layanan yang dipotong platform (Tokopedia/Shopee) dari setiap transaksi. Berkisar 8–10% dari harga jual. |
| **Mall Seller** | Toko resmi berverifikasi (Official Store / Star Seller) di marketplace. `mall_seller_ratio` = proporsi Mall Seller di suatu sub-kategori. Rasio tinggi = kompetisi lebih ketat. |
| **Margin (Net)** | Keuntungan bersih per unit setelah semua biaya: `Net Margin = (Harga Jual − HPP − Komisi − Ekspedisi − Ads) / Harga Jual`. |
| **Median Harga** | Nilai tengah dari distribusi harga kompetitor — lebih robust terhadap outlier dibanding rata-rata. |
| **Min-Max Normalization** | Teknik mengubah nilai ke skala 0–100: `(nilai − min) / (max − min) × 100`. Digunakan agar semua komponen WPS dapat dibandingkan. |
| **MOQ (Minimum Order Quantity)** | Jumlah minimum unit yang harus dipesan dari supplier dalam satu transaksi. |

---

## N–W

| Istilah | Definisi |
|---------|----------|
| **NLP (Natural Language Processing)** | Pemrosesan teks otomatis untuk mengekstrak informasi dari ulasan pelanggan — dalam sistem ini: klasifikasi keluhan & scoring sentimen. |
| **Negative Review Rate** | Proporsi ulasan dengan rating ≤ 2 bintang dari total ulasan. Digunakan sebagai input Gap Score. |
| **pytrends** | Library Python tidak resmi untuk mengakses data Google Trends. Sering terkena rate-limit (HTTP 429) — sistem menanganinya dengan retry eksponensial. |
| **Sentiment Score** | Angka antara −1.0 (sangat negatif) hingga +1.0 (sangat positif) yang menggambarkan emosi keseluruhan dalam satu ulasan. Dihitung dengan pendekatan leksikon (kamus kata). |
| **Volatility CV** | Lihat CV. Digunakan khusus untuk tren pencarian: keyword dengan CV < 0.3 dianggap stabil dan layak menjadi target niche. |
| **WPS (Winning Product Score)** | Skor komposit 0–100 per sub-kategori: `WPS = 0.35 × Demand + 0.25 × (100 − Competition) + 0.25 × Margin + 0.15 × Gap`. Semakin tinggi = peluang semakin besar. |

---

## Threshold & Label Rekomendasi

| WPS | Label | Aksi |
|-----|-------|------|
| ≥ 70 | 🔥 High Priority — Immediate Sourcing | Segera negosiasi dengan supplier, lakukan sample test |
| 50–69 | 👁 Monitor & Sample Testing | Pantau selama 1–2 bulan, beli sample kecil untuk validasi |
| < 50 | ❌ Reject — Saturated / Unfeasible | Pasar sudah jenuh atau margin tidak layak |

> **Catatan**: Threshold 70 dan 50 bersifat awal (MVP). Kalibrasi ulang setiap kuartal menggunakan persentil dari distribusi WPS historis (mis. kuartil atas = High Priority).
