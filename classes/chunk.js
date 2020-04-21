class Chunk
{
    constructor(/** @type {Vector2} */ chunkPosition, /** @type {World} */ world){
        /** @type {World} */ 
        this.world = world;
        
        this.id = Chunk.getChunkId(chunkPosition);
        /** @type {Vector2} */
        this.position = chunkPosition;

        /** @type {number} */ 
        this.seed = this.world.seed + Utils.stringHash(this.id);
        
        /** @type {StarSystem[]} */
        this.systems = [];
        /** @type {Body[]} */
        this.bodies = [];

        this.minBodyAmount = 100;
        this.maxBodyAmount = 200;

        this.generateChunk();
    }

    /** @type {string} */ 
    static getChunkId(/** @type {Vector2} */ chunkPosition){
        return `C[${chunkPosition.x};${chunkPosition.y}]`;
    }

    /** @type {void} */
    generateChunk(){
        const rng = new Math.seedrandom(this.seed);
        const bodyCount = Math.ceil(Utils.lerp(this.minBodyAmount, this.maxBodyAmount, rng()));

        for (let i = 0; i < bodyCount; i++){
            const star = new Star(
                this, new Vector2(rng(), rng()), "Unnamed Star", null, i
            );

            this.bodies.push(star);
        }

    }

    /** @type {void} */ 
    drawBodies(){
        for (let body of this.bodies){
            body.drawThis();
        }
    }

}