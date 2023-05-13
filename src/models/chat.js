const db = require("../db");
const helpers = require("../helpers");

const simpan_pesan = (data) => {
  // const tanggal = new Date()
  // const tanggal_waktu = `${tanggal.getFullYear()}-${tanggal.getMonth()}-${tanggal.getDate()} ${tanggal.getHours()}:${tanggal.getMinutes()}:${tanggal.getSeconds()}`
  let sql = `INSERT INTO pesan_wa (`;
  sql += `pengirim,`;
  sql += `penerima,`;
  sql += `chat,`;
  sql += `created_at, `;
  sql += `timestamp `;
  sql += ` ) VALUES ( `;
  sql += `'${data.pengirim}', `;
  sql += `'${data.penerima}', `;
  sql += `'${data.pesan}', `;
  sql += `'${data.tanggal}', ) `;
  sql += `'${data.timestamp}' ) `;

  console.log("simpan pesan :: ", sql);

  db.pool.query(sql, (err, result) => {
    if (err) {
      console.log("simpan pesan error :: ", err);
    } else {
      console.log("simpan pesan sukses ::", result);
    }
  });
};

const get_all_pesan = (tanggal, callback) => {
  let sql = `SELECT * FROM pesan_wa `;

  if (tanggal) {
    sql += ` WHERE created_at like '%${tanggal}%' `;
  } else {
    // sql += ` WHERE created_at like '%${helpers.tanggal_sekarang()}%' `;
  }

  sql += ` ORDER BY created_at DESC `;

  db.pool.query(sql, (err, result) => {
    if (err) {
      return callback({
        status: false,
        message: err.message,
        data: [],
      });
    } else {
      if (result[0]) {
        result.forEach((element, row) => {
          const tanggal = new Date(element.created_at);
          let tanggal_lengkap = `${tanggal.getDate()} ${helpers.tanggal_bulan(
            tanggal.getMonth()
          )} ${tanggal.getFullYear()}, `;
          tanggal_lengkap += ` ${tanggal.getHours()}:${tanggal.getMinutes()}:${tanggal.getSeconds()} `;
          let dateTime = `${tanggal.getFullYear()}-${tanggal.getMonth()}-${tanggal.getDate()} ${tanggal.getHours()}:${tanggal.getMinutes()}:${tanggal.getSeconds()}`;

          let tanggal_zone = new Date(element.created_at).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            year: 'numeric',
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          console.log(element.created_at)
          console.log(tanggal_zone)

          result[row].created_at = tanggal_zone;
        });

        return callback({
          status: true,
          message: "get data berhasil",
          data: result,
        });
      } else {
        return callback({
          status: false,
          message: "data tidak di temukan",
          data: [],
        });
      }
    }
  });
};

module.exports = {
  simpan_pesan,
  get_all_pesan,
};
