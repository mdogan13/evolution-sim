import * as PIXI from "pixi.js";
import { Application } from "pixi.js";

(async () => {
  const app = new Application();
  const ws = new WebSocket("ws://localhost:3000");

  const renderedAgents = new Map();
 
  let worldInitialized = false;

  const initializeSim = async (state) => {
    await app.init({
      background: '#1099bb', 
      width: state.worldConfig.width,
      height: state.worldConfig.height,
    });
    document.body.appendChild(app.canvas);
    worldInitialized = true;
    // Smooth animation
    app.ticker.add(() => {
      const now = performance.now();
      renderedAgents.forEach((agent) => {
        const alpha = Math.min((now - agent.lastUpdate) / state.worldConfig.tickSpeed, 1);
        agent.sprite.x =
          agent.prevX + (agent.targetX - agent.prevX) * alpha;
        agent.sprite.y =
          agent.prevY + (agent.targetY - agent.prevY) * alpha;
      });
    });
  };

  const renderAgent = (a) => {
    const g = new PIXI.Graphics();

    g.circle(0, 0, a.size).fill({ color: 0x00ff00 }).closePath();

    app.stage.addChild(g);

    const agentToRender = {
      sprite: g,
      prevX: a.x,
      prevY: a.y,
      targetX: a.x,
      targetY: a.y,
      lastUpdate: performance.now(),
    };

    renderedAgents.set(a.id, agentToRender);
  };


  const updateAgent = (renderedAgent, agentData) => {
    renderedAgent.prevX = renderedAgent.sprite.x;
    renderedAgent.prevY = renderedAgent.sprite.y;

    renderedAgent.targetX = agentData.x;
    renderedAgent.targetY = agentData.y;

    renderedAgent.lastUpdate = performance.now();
  };


  const removeMissingAgents = (state) => {
    for (let [id, agent] of renderedAgents.entries()) {
      if (!state.agents.find((a) => a.id === id)) {
        app.stage.removeChild(agent.sprite);
        renderedAgents.delete(id);
      }
    }
  };

  ws.onmessage = async (event) => {
    const state = JSON.parse(event.data);
    if (!worldInitialized) {
      initializeSim(state);
    }

    state.agents.forEach((agentData) => {
      let renderedAgent = renderedAgents.get(agentData.id);
      if (!renderedAgent) {
        renderAgent(agentData);
      } else {
        updateAgent(renderedAgent, agentData);
      }
    });
    removeMissingAgents(state);

  };

})();
