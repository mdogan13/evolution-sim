import * as PIXI from "pixi.js";
import { Application } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // WebSocket connection to backend
  const ws = new WebSocket("ws://localhost:3000");
  window.ws = ws;

  // Agent map: id → { sprite, prevX, prevY, targetX, targetY, lastUpdate }
  const agents = new Map();

  // Assume backend tick interval (ms)
  const TICK_INTERVAL = 200;

  ws.onmessage = (event) => {
    const state = JSON.parse(event.data);

    state.agents.forEach((a) => {
      let agent = agents.get(a.id);
      if (!agent) {
        // Create new graphics object
        const g = new PIXI.Graphics();
      
        g.circle(0, 0, a.size)
        .fill({ color: 0x00ff00  })
        .closePath();
        app.stage.addChild(g);
   

        agent = {
          sprite: g,
          prevX: a.x,
          prevY: a.y,
          targetX: a.x,
          targetY: a.y,
          lastUpdate: performance.now(),
        };
        agents.set(a.id, agent);
      } else {
        // Move previous → target
        agent.prevX = agent.sprite.x;
        agent.prevY = agent.sprite.y;
        agent.targetX = a.x;
        agent.targetY = a.y;
        agent.lastUpdate = performance.now();
      }
    });

    // Remove missing agents
    for (let [id, agent] of agents.entries()) {
      if (!state.agents.find((a) => a.id === id)) {
        app.stage.removeChild(agent.sprite);
        agents.delete(id);
      }
    }
  };

  // Smooth animation
  app.ticker.add(() => {
    const now = performance.now();
    agents.forEach((agent) => {
      const alpha = Math.min((now - agent.lastUpdate) / TICK_INTERVAL, 1);
      agent.sprite.x =
        agent.prevX + (agent.targetX - agent.prevX) * alpha;
      agent.sprite.y =
        agent.prevY + (agent.targetY - agent.prevY) * alpha;
    });
  });
})();
