const { Client } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const qrcode = require('qrcode');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED cek ', qr);
    // qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    } else if (msg.body == 'halo') {
    	msg.reply('hai juga');
    }
});

client.initialize();

// socket io
io.on('connection', function(socket) {
	socket.emit('message', 'Connecting...');

	client.on('qr', (qr) => {
	    console.log('QR RECEIVED', qr);
	    qrcode.toDataURL(qr, (err, url) => {
	    	socket.emit('qr', url);
	    	socket.emit('message', 'Qrcode received, please scan');
	    });
	});

	client.on('ready', () => {
	    console.log('Client is ready!');
	    socket.emit('message', 'Whatsapp sudah ready');
	});
});

// send message
app.post('/send-message', (req, res) => {
	const number = req.body.number;
	const message = req.body.message;

	client.sendMessage(number, message).then(response => {
		res.status(200).json({
			status: true,
			response: response
		});
	}).catch(err => {
		res.status(500).json({
			status: false,
			response: err
		});
	});
});

server.listen(9000, function() {
	console.log('App running on *:' + 9000);
});