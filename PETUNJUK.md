# Catatan Apapa & Amama Yasmin: cara memasang

Data disimpan di Google Sheets. Aplikasi (index.html) ditaruh di GitHub Pages.
Tiga langkah: siapkan Sheet, pasang kode penghubung, unggah aplikasi.

## 1. Siapkan Google Sheet dan Apps Script

1. Buka sheets.google.com dan buat spreadsheet baru, misalnya "Catatan Apapa & Amama Yasmin".
2. Di spreadsheet itu pilih menu **Extensions → Apps Script**.
3. Hapus isi editor, lalu tempel seluruh isi file **Code.gs**.
4. Di baris `const KUNCI = '...'` ganti isinya dengan kode rahasia keluarga (contoh: `yasmin-2026-xyz`). Simpan kodenya, nanti diketik sekali di setiap HP.
5. Klik **Deploy → New deployment**. Pada ikon roda gigi pilih **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Klik **Deploy**, lalu **Authorize access** dan izinkan akun Google Anda. Jika muncul peringatan "Google hasn't verified this app", pilih **Advanced → Go to ... (unsafe)**. Ini script milik Anda sendiri.
7. Salin **Web app URL** (berakhiran `/exec`).

Sheet bernama "Transaksi" akan dibuat otomatis saat pertama dipakai. Jangan ubah baris judul di baris 1.

## 2. Isi alamat di aplikasi

Buka **index.html** dengan editor teks, cari baris:

```
var API_URL = 'PASTE_URL_APPS_SCRIPT_DI_SINI';
```

Ganti tulisan di antara tanda kutip dengan Web app URL tadi.

## 3. Unggah ke GitHub Pages

1. Di github.com buat repository baru, misalnya `catatan-yasmin`.
2. Pilih **Add file → Upload files**, lalu unggah **index.html**, **manifest.webmanifest**, dan **icon.svg**. Klik **Commit changes**.
   (Code.gs dan file ini tidak perlu diunggah.)
3. Buka **Settings → Pages**. Pada Source pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu 1 sampai 2 menit. Alamat aplikasi: `https://NAMA-GITHUB-ANDA.github.io/catatan-yasmin/`

## 4. Pakai di dua HP

1. Buka alamat tadi di Chrome pada HP Apapa dan HP Amama.
2. Ketik kode keluarga (sekali saja).
3. Menu ⋮ → **Tambahkan ke layar utama**.

Catatan dari satu HP muncul di HP lain dalam sekitar 20 detik, atau langsung saat aplikasi dibuka kembali.

## Catatan penting

- **Mengubah Code.gs setelah dipasang:** Deploy → Manage deployments → ikon pensil → Version: **New version** → Deploy. Alamat tidak berubah.
- **Mengedit langsung di Sheet** boleh (misalnya memperbaiki jumlah). Jaga kolom *jenis* tetap `Masuk` atau `Keluar`, dan kolom *kategori* sesuai nama di aplikasi (Bahan Pokok, Sedekah, Bayar Utang, dan seterusnya).
- **Keamanan:** siapa pun yang tahu alamat Apps Script **dan** kode keluarga bisa membaca dan menulis data. Kode ada di Code.gs, bukan di GitHub, jadi repo yang publik tidak membocorkannya. Jangan bagikan kodenya.
- **Ganti kode:** ubah `KUNCI` di Code.gs, deploy versi baru, lalu ketik kode baru di tiap HP.
