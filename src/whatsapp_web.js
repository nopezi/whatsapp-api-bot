const { Client, LegacySessionAuth, LocalAuth, Message  } = require('whatsapp-web.js');
const socketRun = require('./socket')
const useChat = require('./chat')
const fs = require('fs');

const whatsapp_web = (server) => {
  const SESSION_FILE_PATH = "./whatsapp-session.json";
  let sessionCfg;
  if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
  }

  // const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });
  const client = new Client({
    // authStrategy: new LegacySessionAuth({
    //     session: sessionCfg
    // })
    authStrategy: new LocalAuth({ clientId: "client-one" }),
  });

  // client.fetchMessages({
  //     limit: 10,
  //     fromMe: true
  // })
  // console.log(new BatteryInfo())

  const coba = async () => {
    try {
      // const chat = await client.getChats('')
      // console.log('semua chat ', chat)
      // const chatIds = await client.getContacts.length
      // console.log(chatIds)
    } catch (error) {
      console.log("semua chat error ", error);
    }
  };

  client.on("message_received", async (msg) => {
    console.log("message_received 5555 ", msg);
    console.log(client.getWWebVersion());
    // msg.fetchMessages
    // await console.log(client.getChats())
  });

  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log("QR RECEIVED cek ", qr);
    // qrcode.generate(qr, {small: true});
  });

  useChat(client);

  // socket io
  socketRun(client, server);

  client.initialize();
};

module.exports = whatsapp_web