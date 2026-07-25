# Access Control · dbsc

Web untuk mengelola database nomor akses (`db.json` di repo GitHub `akbarsdt2604-dotcom/dbsc`)
tanpa perlu buka GitHub secara manual.

- **Admin/tim**: cari nomor, tambah nomor, hapus nomor
- **Customer/pembeli**: cari nomor, tambah nomor (tidak bisa hapus)

Peran ditentukan otomatis oleh password mana yang dipakai — dicek di server,
jadi tidak bisa "dicurangi" dari sisi browser. Token GitHub disimpan sebagai
environment variable di server, **tidak pernah dikirim ke browser**, jadi aman
walau link web-nya disebar ke banyak orang.

## Cara deploy (Vercel, gratis, ±5 menit)

1. **Bikin token GitHub** (kalau belum ada / mau ganti yang lama):
   - Buka https://github.com/settings/tokens?type=beta → **Generate new token**
   - Resource owner: akun yang punya repo `dbsc`
   - Repository access → **Only select repositories** → centang `dbsc`
   - Repository permissions → **Contents** → **Read and write**
   - Generate, copy tokennya (simpan sementara, jangan taruh di chat manapun)

2. **Bikin akun Vercel** (kalau belum ada): https://vercel.com/signup — bisa daftar pakai akun GitHub kamu langsung, gratis.

3. **Upload project ini ke Vercel**, dua cara, pilih salah satu:

   **Cara A — lewat website (paling gampang, tanpa install apa-apa):**
   - Extract zip project ini di komputer kamu
   - Push isinya ke repo GitHub baru (boleh nama apa aja, misal `dbsc-panel`) — kalau belum tahu caranya, tinggal drag & drop foldernya ke https://github.com/new saat bikin repo baru lewat web
   - Di Vercel, klik **Add New → Project**, pilih repo `dbsc-panel` tadi, klik **Deploy**

   **Cara B — lewat terminal (kalau familiar CLI):**
   ```
   npm install -g vercel
   cd access-control-web
   vercel
   ```
   Ikuti instruksi di layar (login, pilih scope, deploy).

4. **Set Environment Variables** di Vercel:
   - Buka project-nya di dashboard Vercel → **Settings → Environment Variables**
   - Tambahkan satu-satu (lihat `.env.example` di project ini untuk daftar lengkapnya):
     - `GITHUB_TOKEN` → token dari langkah 1
     - `ADMIN_PASSWORD` → password buat kamu/tim (bebas, misal `opipay43admin`)
     - `CUSTOMER_PASSWORD` → password buat customer (bebas, beda dari admin, misal `opipay43cust`)
   - Klik **Save**

5. **Redeploy** (env variable baru butuh deploy ulang sekali):
   - Di tab **Deployments**, klik titik tiga pada deployment terakhir → **Redeploy**

6. Selesai — Vercel kasih kamu link publik (misal `https://dbsc-panel.vercel.app`).
   Bagikan link itu + password yang sesuai ke tim (ADMIN_PASSWORD) atau customer (CUSTOMER_PASSWORD).

## Struktur project

```
api/
  search.js   -> cari/lihat nomor (admin & customer)
  add.js      -> tambah nomor (admin & customer)
  delete.js   -> hapus nomor (KHUSUS admin, ditolak server kalau bukan admin)
lib/
  github.js   -> baca/tulis db.json ke GitHub pakai token rahasia
  auth.js     -> menentukan peran dari password, di server
public/
  index.html  -> tampilan web-nya
```

## Kalau mau ganti password nanti

Tinggal ubah `ADMIN_PASSWORD` / `CUSTOMER_PASSWORD` di Environment Variables Vercel,
lalu redeploy. Tidak perlu ubah kode apa pun.

## Catatan keamanan

- Token GitHub hanya hidup di server (Vercel), tidak pernah dikirim ke browser — beda
  dengan versi HTML statis sebelumnya yang menaruh token langsung di file.
- Tetap jangan sebar `ADMIN_PASSWORD` ke customer — itu kunci penuh (bisa hapus data).
- Semua perubahan (tambah/hapus) tercatat sebagai commit di GitHub dengan pesan yang
  menyebut peran siapa yang melakukannya (`[web:admin] ...` / `[web:customer] ...`),
  jadi ada jejaknya kalau perlu ditelusuri.
