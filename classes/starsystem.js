class StarSystem
{
    constructor(
        /** @type {Chunk} */ chunk,
        /** @type {number} */ id,
        /** @type {string} */ name,
        /** @type {Vector2} */ position
    ){
        this.id = id;

        /** @type {Chunk} */
        this.chunk = chunk;
        /** @type {number} */ 
        this.seed = this.chunk.seed + Utils.stringHash(this.id.toString());

        /** @type {string} */
        this.name = name;

        /** @type {Vector2} */
        this.position = position;
        /** @type {Vector2} */
        this.worldPosition = this.getWorldPos();
        
        /** @type {Body[]} */
        this.stars = [];
        /** @type {Body[]} */
        this.bodies = [];

        this.generateStarSystem();
    }

    /** @type {void} */ 
    getWorldPos(){
        return this.chunk.position.add(this.position).scale(this.chunk.world.properties.chunkSize);
    }
    
    /** @type {void} */ 
    drawBodies(){
        for (let body of this.stars.concat(this.bodies)){
            this.chunk.world.camera.drawBody(body);
        }
    }

    /** @type {void} */ 
    generateStarSystem(){
        const rng = new Math.seedrandom(this.seed);

        const star = new Star(
            this.chunk,
            this.position,
            "Unnamed Star",
            Body.type.STAR,
            Body.type.STAR.generateProperties(rng),
            null
        );
        // body.color = "#" + rng().toString(16).slice(2, 8);
        star.color = "#ffffff";
        this.stars.push(star);
    }

}