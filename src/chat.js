const modelChat = require('./models/chat')

const chat = async (client) => {
    console.log('masok')
    client.on('message', msg => {
        console.log('cek pesan :: ', msg)
        if (msg.body == '!ping') {
            msg.reply('pong')
        } else if (msg.body == 'halo') {
            msg.reply('hai juga')
        }

        modelChat.simpan_pesan({
            pengirim: msg.from,
            penerima: msg.to,
            pesan: msg.body
        })
    })

}

module.exports = chat