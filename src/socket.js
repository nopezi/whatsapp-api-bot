const socketIO = require('socket.io');
const express = require('express');
const qrcode = require('qrcode');

const socketRun = (client, server) => {
  const io = socketIO(server);

  io.on("connection", function (socket) {
    socket.emit("message", "Connecting...");

    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.toDataURL(qr, (err, url) => {
        socket.emit("qr", url);
        socket.emit("message", "Qrcode received, Silahkan Scan dari aplikasi Whatsapp di handphone");
      });
    });

    client.on("ready", () => {
      console.log("Client is ready!");
      socket.emit("message", "Whatsapp sudah ready");
      socket.emit("ready", "Whatsapp ready");
    });

    client.on("authenticated", (session) => {
      console.log("cek AUTHENTICATED :: ", session);
      socket.emit("message", "Whatsapp sudah authenticated");
      socket.emit("authenticated", "Whatsapp authenticated");
      sessionCfg = session;

      if (session) {
        fs.writeFile(
          SESSION_FILE_PATH,
          JSON.stringify(session),
          function (err) {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    });
  });
};

module.exports = socketRun