import express from "express";
import { WebSocketServer } from "ws";
import { World } from "./entities/World";

const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });


const world = new World([500, 500]);

world.init();

const broadcastState = () => {
  const state = world.getState();
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(state));
    }
  });
}

setInterval(() => {
  broadcastState();
}, 200);

setInterval(() => {
  world.saveState();
}, 5 * 60 * 1000);

// Simple REST test route
app.get("/", (req, res) => res.send("Antfarm backend running!"));
