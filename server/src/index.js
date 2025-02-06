const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
//Posztok számára fenntartott globális változó
let posts = []
fetchData()

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
    const myCounter = counter()
    generateRandomInterval(myCounter, ws)

    /* ws.on('message', (message) => {
        console.log(`Üzenet érkezett: ${message}`);
        ws.send(`Szerver válasza: ${message}`);
    }); */

    ws.on('close', () => {
        console.log('WebSocket kapcsolat lezárva.');
    });

});

function generateRandomInterval(myCounter, ws) {
    let interval = 0
    let rand = Math.random()
    if (rand < 0.5) {
        interval = Math.round(rand * 10000) //max 4900 ms
    } else {
        interval = Math.round(rand * 6000) //max 5940 ms
    }
    console.log(interval)

    setTimeout(()=> {
        let message = getNextPost(myCounter)
        ws.send(message)
        if (message !== "Nincs adat" && message !== "Elfogytak a posztok") {
            generateRandomInterval(myCounter, ws)
        }
    }, interval)
}
//generateRandomInterval()

//konstans időként adja vissza az üzeneteket

/* const myInterval = setInterval(() => {
    let message = getNextPost()
    ws.send(message)
    if (message === "Nincs adat" || message === "Elfogytak a posztok") {
        clearInterval(myInterval)
    }
}, 2000) */

function counter() {
    let index = 0

    function inkrement() {
        return index++
    }

    return inkrement
}

function getNextPost(myCounter) {
    if (posts.length === 0) return "Nincs adat"

    let index = myCounter()

    return index < posts.length ? 
        `${index}. poszt: ${posts[index]}` : "Elfogytak a posztok"

    /* if (index < posts.length) {
        console.log(`${index}. poszt: ${posts[index]}`)
        return `${index}. poszt: ${posts[index]}`
    } else {
        console.log("Elfogytak a posztok")
        return "Elfogytak a posztok"
    } */
}

//Posztok lekérése API-tól
async function fetchData() {
    try {
        const url = "https://jsonplaceholder.typicode.com/posts"
        const data = await fetch(url)
        const jsonData = await data.json()
        const bodys = jsonData
            .map(item => item.body.slice(0, 12))
            .slice(0, 5)
        posts = [...bodys]
    } catch(err) {
        console.log("Hiba a posztok lekérése során: " + err)
    }
}

// Szerver indítása
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
