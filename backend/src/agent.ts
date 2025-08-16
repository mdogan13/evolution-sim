import { AgentDNA } from "./models/agent.model";

export class Agent {
    id: number;
    speciesId?: string;
    x: number;
    y: number;
    speed: number;
    age: number;
    size: number;
    dna: AgentDNA;

    constructor(id: number, speciesId: string, x: number, y: number, speed: number, age: number, size: number, dna: AgentDNA) {
        this.id = id;
        this.speciesId = speciesId;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.age = age;
        this.size = size;
        this.dna = dna;
    }

    moveTowards(targetX: number, targetY: number) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    sense(agents: Agent[], radius: number): Agent[] {
        const nearByAgents = agents.filter(a => a.id !== this.id &&
            Math.hypot(a.x - this.x, a.y - this.y) < radius
        );
        return nearByAgents;
    }

    update(world: { agents: Agent[] }) {
        this.age++;

        // Example: move toward nearest neighbor if any
        const nearby = this.sense(world.agents, 50);
        console.log(nearby);
        const moveDist = Math.random() * 2 - 1;
        this.moveTowards(this.x + moveDist, this.y + moveDist);
        // a.x += Math.random() * 2 - 1;
        // a.y += Math.random() * 2 - 1;
        // if (nearby.length > 0) {
        //     const nearest = nearby[0];
        //     this.moveTowards(nearest.x, nearest.y);
        // }
    }

}