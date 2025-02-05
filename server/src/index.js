const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Engedélyezett CORS beállítások
app.use(cors());
app.use(express.json());

// HTTP végpont
app.get('/', (req, res) => {
    res.send('Szia! Ez egy Node.js szerver.');
});

// WebSocket kapcsolat kezelése
wss.on('connection', (ws) => {
    console.log('Új WebSocket kapcsolat!');

    ws.on('message', (message) => {
        console.log(`Üzenet érkezett: ${message}`);
        ws.send(`Szerver válasza: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket kapcsolat lezárva.');
    });
});

// Szerver indítása
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
