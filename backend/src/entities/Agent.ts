export interface AgentDNA {
    maxSpeed: number;
    lifeSpan: number;
    maxSize: number;
    color: string;
    perceptionRadius: number;
    mutationProbability: number;
}

export class Agent {
    id: number;
    speciesId?: string;
    x: number;
    y: number;
    speed: number;
    age: number;
    size: number;
    dna: AgentDNA;


    velocity: { x: number, y: number } = { x: 0, y: 0 };

    constructor(id: number, speciesId: string, x: number, y: number, speed: number, age: number, size: number, dna: AgentDNA) {
        this.id = id;
        this.speciesId = speciesId;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.age = age;
        this.size = size;
        this.dna = dna;

        const angle = Math.random() * Math.PI * 2;
        this.velocity.x = Math.cos(angle)*10;
        this.velocity.y = Math.sin(angle)*10;

    }


    sense(world: { agents: Agent[], width: number, height: number }, radius: number) {
        // nearby agents
        const nearby = world.agents.filter(a =>
            a.id !== this.id &&
            Math.hypot(a.x - this.x, a.y - this.y) < radius
        );

  

        return { nearby };
    }

    // update(world: { agents: Agent[], width: number, height: number }) {
    //     this.age++;

    //     // Move along velocity
    //     this.x += this.velocity.x;
    //     this.y += this.velocity.y;

    //     // Bounce off world bounds
    //     if (this.x < this.size) { 
    //         this.x = this.size;
    //          this.velocity.x *= -1; 
    //         }
    //     else if (this.x > world.width - this.size) {
    //          this.x = world.width - this.size; 
    //          this.velocity.x *= -1;
    //          }
    //     if (this.y < this.size) { 
    //         this.y = this.size; this.velocity.y *= -1; 
    //     }
    //     else if (this.y > world.height - this.size) { 
    //         this.y = world.height - this.size; this.velocity.y *= -1; 
    //     }
    // }

    handleEdgeCollision(world: { agents: Agent[], width: number, height: number }){

    }

    growOlder(){
        
    }

    update(world: { agents: Agent[], width: number, height: number }) {
        this.age++;
    
        // Predict next position
        let nextX = this.x + this.velocity.x;
        let nextY = this.y + this.velocity.y;
    
        // Bounce on X edges
        if (nextX < this.size) {
            nextX = this.size;
            this.velocity.x *= -1;
        } else if (nextX > world.width - this.size) {
            nextX = world.width - this.size;
            this.velocity.x *= -1;
        }
    
        // Bounce on Y edges
        if (nextY < this.size) {
            nextY = this.size;
            this.velocity.y *= -1;
        } else if (nextY > world.height - this.size) {
            nextY = world.height - this.size;
            this.velocity.y *= -1;
        }
    
        // Apply corrected position
        this.x = nextX;
        this.y = nextY;
    }
    

}