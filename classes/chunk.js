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

        this.minAmount = 150;
        this.maxAmount = 250;

        this.generateChunk();
    }

    /** @type {string} */ 
    static getChunkId(/** @type {Vector2} */ chunkPosition){
        return `C[${chunkPosition.x};${chunkPosition.y}]`;
    }

    /** @type {void} */
    generateChunk(){
        const rng = new Math.seedrandom(this.seed);
        const systemCount = Math.ceil(rng() * (this.maxAmount - this.minAmount) + this.minAmount);

        for (let i = 0; i < systemCount; i++){
            let position = new Vector2(rng(), rng());
            
            const system = new StarSystem(
                this, i, "Untitled Star System", position
            );

            this.systems.push(system);
        }

    }

    /** @type {bool} */ 
    validToDraw(/** @type {StarSystem} */ object){
        if (object instanceof StarSystem){
            return true;
        } else
        if (object instanceof Body){
            return true;
        }
    }

    /** @type {void} */ 
    drawSystems(){
        for (let system of this.systems){
            if (this.validToDraw(system)){
                system.drawBodies();
            }
        }
    }

    /** @type {void} */ 
    drawBodies(){
        for (let body of this.bodies){
            if (this.validToDraw(body)){
                camera.drawBody(body);
            }
        }
    }

}