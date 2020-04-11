class World
{
    constructor(/** @type {Canvas} */ camera, seed = null){
        /** @type {Camera} */
        this.camera = camera;
        /** @type {World} */
        this.camera.world = this;

        this.properties = {
            chunkSize: 100 * Measure.length.LY,
            loadRadius: 4
        }

        this.seed = World.getSeed(seed);
        this.stringSeed = seed ? seed : this.seed;

        /** @type {Chunk[]} */ 
        this.loadedChunks = [];
        /** @type {string[]} */ 
        this.visibleChunks = [];

        this.update = false;
    }

    /** @returns {any} */ 
    static getSeed(/** @type {string} */ seedEntry){
        let prng;
        if (seedEntry !== null && seedEntry.length > 0 && !isNaN(seedEntry)){
            seedEntry = parseInt(seedEntry);
        }
        switch (typeof seedEntry) {
            case "string":
                prng = new Math.seedrandom(seedEntry);
                break;
            case "number":
                return seedEntry;
            default:
                prng = new Math.seedrandom();
                break;
        }
        return prng.int32();
    }
    
    /** @returns {Chunk} */ 
    findChunkById(id){
        for (let chunk of this.loadedChunks){
            if (chunk.id == id){
                return chunk;
            }
        } return null;
    }

    /** @returns {Chunk} */ 
    getChunkByChunkPos(/** @type {Vector2} */ chunkPosition){
        const id = Chunk.getChunkId(chunkPosition);
        for (let chunk of this.loadedChunks){
            if (chunk.id == id){
                return chunk;
            }
        } return null;
    }

    chunkIsVisible(id){
        for (let chunkId of this.visibleChunks){
            if (chunkId == id){
                return true;
            }
        } return false;
    }

    /** @type {Vector2} */
    worldPosToChunkPos(/** @type {Vector2} */ position){
        return position.scale(1 / this.properties.chunkSize).floorValues();
    }

    manageChunks(){
        if (
            !(this.worldPosToChunkPos(camera.position).isEqual(camera.currentChunkPos) &&
            this.loadedChunks.length > 0)
        ){
            this.update = true;
        }

        if (!this.update){
            return;
        }

        this.update = false;

        camera.currentChunkPos = this.worldPosToChunkPos(camera.position);

        // const radius = Math.ceil(
        //     (this.camera.screenLengthToWorldLength(window.innerWidth) +
        //     this.camera.screenLengthToWorldLength(window.innerHeight)) /
        //     this.properties.chunkSize / 2 + 2
        // );
        const radius = Math.max(
            Math.min(
                Math.sqrt(
                    Math.pow(this.camera.screenLengthToWorldLength(window.innerWidth) /
                        this.properties.chunkSize + 1, 2
                    ) + 
                    Math.pow(this.camera.screenLengthToWorldLength(window.innerHeight) /
                        this.properties.chunkSize + 1, 2
                    )
                ),
                5
            ),
            3
        );

        this.visibleChunks = [];
        this.loadRecursively(radius, camera.currentChunkPos
        );
        this.deleteFarChunks();
    }

    /** @type {void} */ 
    loadRecursively(step, chunkPosition){
        if (step < 1){
            return;
        }
        
        if (this.findChunkById(Chunk.getChunkId(chunkPosition)) == null){
            const chunk = new Chunk(chunkPosition, this);
            this.loadedChunks.push(chunk);
        }

        const id = Chunk.getChunkId(chunkPosition);
        if (this.visibleChunks.indexOf(id) == -1){
            this.visibleChunks.push(id);
        }

        this.loadRecursively(step - 1, chunkPosition.add(Vector2.up));
        this.loadRecursively(step - 1, chunkPosition.add(Vector2.down));
        this.loadRecursively(step - 1, chunkPosition.add(Vector2.right));
        this.loadRecursively(step - 1, chunkPosition.add(Vector2.left));

    }

    /** @type {void} */ 
    deleteFarChunks(){
        let newList = [];
        for (let id of this.visibleChunks){
            const chunk = this.findChunkById(id);
            if (chunk){
                newList.push(chunk);
            }
        }
        this.loadedChunks = newList;
    }
    
}