import express from "express";
import { WebSocketServer } from "ws";
import { tick, getState, loadState, saveState } from "./simulation";

const PORT = 3000;

const app = express();
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// WebSocket
const wss = new WebSocketServer({ server });

// Load previous state or start fresh
loadState();

// Simulation loop
setInterval(() => {
  tick();

  // Broadcast state every second
  const state = getState();
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(state));
    }
  });
}, 200);

// Save snapshot every 5 minutes
setInterval(() => {
  saveState();
  console.log("State saved to JSON");
}, 5 * 60 * 1000);

// Simple REST test route
app.get("/", (req, res) => res.send("Antfarm backend running!"));
