import fs from "fs";
import { Agent } from "./agent";


interface State {
    tick: number;
    agents: Agent[];
}

const SAVE_FILE = "./src/state.json";

let state: State = { tick: 0, agents: [] };

export function loadState() {
    console.log('loading state')
    try {
        const data = fs.readFileSync(SAVE_FILE, "utf8");
        state = JSON.parse(data);
        console.log("Loaded state from", SAVE_FILE);
    } catch {
        console.log("No save found, starting fresh");
        for (let i = 0; i < 20; i++) {
            state.agents.push(new Agent(i, '123', Math.random() * 500, Math.random() * 500, 4, 0, 3, {
                maxSpeed: 5,
                lifeSpan: 5,
                maxSize: 5,
                color: 'ffffff',
                perceptionRadius: 5,
                mutationProbability: 5,
            }));
        }
        saveState();
    }
}

export function tick() {
    state.tick++;
    state.agents.forEach((a:Agent) => {
        a.update({agents:state.agents});

    });
}

export function getState(): State {
    return state;
}

export function saveState() {
    fs.writeFileSync(SAVE_FILE, JSON.stringify(state, null, 2));
}
