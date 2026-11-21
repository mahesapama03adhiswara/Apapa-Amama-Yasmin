/**
 * Catatan Apapa & Amama Yasmin — penghubung ke Google Sheets.
 * Tempel seluruh isi file ini di Extensions > Apps Script pada Google Sheet Anda.
 */

// Ganti dengan kode rahasia keluarga. Kode yang sama diketik sekali di aplikasi, di setiap HP.
const KUNCI = 'GANTI-DENGAN-KODE-KELUARGA';

const NAMA_SHEET = 'Transaksi';
const HEAD = ['id', 'tanggal', 'jenis', 'kategori', 'jumlah', 'catatan', 'oleh', 'waktu'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NAMA_SHEET);
  if (!sh) {
    sh = ss.insertSheet(NAMA_SHEET);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    // Kolom teks tetap teks: tanggal tidak berubah format, catatan yang diawali "=" tidak dianggap rumus.
    sh.getRange('A:D').setNumberFormat('@');
    sh.getRange('F:G').setNumberFormat('@');
    sh.getRange('E:E').setNumberFormat('#,##0');
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function tgl_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    const zona = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    return Utilities.formatDate(v, zona, 'yyyy-MM-dd');
  }
  return String(v);
}

// Membaca semua transaksi.
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.key !== KUNCI) return out_({ ok: false, error: 'kode' });
  const sh = sheet_();
  const last = sh.getLastRow();
  const rows = [];
  if (last >= 2) {
    const vals = sh.getRange(2, 1, last - 1, HEAD.length).getValues();
    vals.forEach(function (r) {
      if (!r[0]) return;
      rows.push({
        id: String(r[0]), tanggal: tgl_(r[1]), jenis: String(r[2]), kategori: String(r[3]),
        jumlah: Number(r[4]) || 0, catatan: String(r[5] || ''), oleh: String(r[6] || ''), waktu: Number(r[7]) || 0
      });
    });
  }
  return out_({ ok: true, rows: rows });
}

// Menambah atau menghapus satu transaksi.
function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'format' }); }
  if (req.key !== KUNCI) return out_({ ok: false, error: 'kode' });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_();
    if (req.action === 'add') {
      const t = req.tx || {};
      sh.appendRow([
        String(t.id), String(t.tanggal), String(t.jenis), String(t.kategori),
        Number(t.jumlah) || 0, String(t.catatan || ''), String(t.oleh || ''), Number(t.waktu) || 0
      ]);
      return out_({ ok: true });
    }
    if (req.action === 'delete') {
      const last = sh.getLastRow();
      if (last >= 2) {
        const ids = sh.getRange(2, 1, last - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === String(req.id)) { sh.deleteRow(i + 2); break; }
        }
      }
      return out_({ ok: true });
    }
    return out_({ ok: false, error: 'aksi' });
  } finally {
    lock.releaseLock();
  }
}
