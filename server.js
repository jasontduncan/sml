import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const wss = new WebSocketServer({ noServer: true });
let currentCode = "<!-- Start typing HTML here -->";

app.use(express.static('public'));

const server = app.listen(3000, () => {
  console.log('http://localhost:3000');
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    ws.send(currentCode);
    ws.on('message', msg => {
      currentCode = msg.toString();
      wss.clients.forEach(c => {
        if (c !== ws && c.readyState === 1) {
          c.send(currentCode);
        }
      });
    });
  });
});
