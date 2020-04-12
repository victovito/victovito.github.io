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

        this.minSysAmount = 75;
        this.maxSysAmount = 150;

        this.minBodyAmount = 5;
        this.maxBodyAmount = 20;

        this.generateChunk();
    }

    /** @type {string} */ 
    static getChunkId(/** @type {Vector2} */ chunkPosition){
        return `C[${chunkPosition.x};${chunkPosition.y}]`;
    }

    /** @type {void} */
    generateChunk(){
        const rng = new Math.seedrandom(this.seed);
        const systemCount = Math.ceil(Utils.lerp(this.minSysAmount, this.maxSysAmount, rng()));
        const bodyCount = Math.ceil(Utils.lerp(this.minBodyAmount, this.maxBodyAmount, rng()));

        for (let i = 0; i < systemCount; i++){
            const position = new Vector2(rng(), rng());
            
            const system = new StarSystem(
                this, i, "Untitled Star System", position
            );

            this.systems.push(system);
        }

        for (let i = 0; i < bodyCount; i++){
            const position = new Vector2(rng(), rng());
            const type = Utils.choseFromObject(Body.type);

            let properties;
            if (type == Body.type.STAR){
                properties = Body.type.STAR.generateProperties(rng);
            } else {
                properties = {
                    radius: 3 * Measure.length.Er,
                    mass: 1,
                    luminosity: 0,
                    color: "#7f7f7f"
                }
            }

            const body = new Body(
                this, position, "Unnamed Body",
                type, properties, null
            );

            this.bodies.push(body);
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