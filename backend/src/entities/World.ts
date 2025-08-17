import { Agent } from "./Agent";
import fs from "fs";

export class World {
    SAVE_FILE = "./src/state.json";
    agents: Agent[] = [];
    size: [number, number];
    state: any = { tick: 0, agents: [], worldConfig: { width: 0, height: 0, tickSpeed: 200 } };

    constructor(size: [number, number]) {
        this.size = size;
    }

    init(): void {
        this.loadState();

        setInterval(() => {
            this.tick();
        }, this.state.worldConfig.tickSpeed);
    }

    loadState() {
        console.log('loading state')
        try {
            const data = fs.readFileSync(this.SAVE_FILE, "utf8");
            const parsed = JSON.parse(data);

            this.state = parsed;
            this.state.agents = parsed.agents.map((a: any, i: number) =>
                new Agent(a.id, a.speciesId, a.x, a.y, a.speed, a.age, a.size, a.dna)
            );
        } catch {
            console.log("No save found, starting fresh");
            this.state.worldConfig.width = this.size[0];
            this.state.worldConfig.height = this.size[1];
            for (let i = 0; i < 20; i++) {
                this.state.agents.push(new Agent(i, '123', Math.random() * 500, Math.random() * 500, 4, 0, 5, {
                    maxSpeed: 5,
                    lifeSpan: 5,
                    maxSize: 5,
                    color: 'ffffff',
                    perceptionRadius: 5,
                    mutationProbability: 5,
                }));
            }
            this.saveState();
        }
    }

    tick() {
        this.state.tick++;
        this.state.agents.forEach((agent: Agent) => {
            agent.update({
                agents: this.state.agents,
                width: this.state.worldConfig.width,
                height: this.state.worldConfig.height
            });
        });
    }
    
    getState(): any {
        return this.state;
    }

    saveState() {
        fs.writeFileSync(this.SAVE_FILE, JSON.stringify(this.state, null, 2));
    }

}