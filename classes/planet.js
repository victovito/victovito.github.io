class Planet
{
    constructor(
        /** @type {Chunk} */ chunk,
        /** @type {Vector2} */ position,
        /** @type {string} */ name,
        /** @type {Star} */ parentBody,
        id
    ){
        
        /** @type {Chunk} */
        this.chunk = chunk;

        /** @type {string} */ 
        this.name = name;

        this.type = Body.type.PLANET;

        this.id = id.toString();
        
        
        this.parentBody = {
            object: parentBody,
            distanceTo: Measure.length.AU / 10,
            angle: 0,
            startAngle: 0
        };

        this.seed = this.parentBody.object.seed + Utils.stringHash(this.id);
        
        this.properties = this.generateProperties();

        this.childrens = [];
        this.childCount = Math.floor(Utils.lerp(0, 10, new Math.seedrandom(
            this.seed + Utils.stringHash("childCount")
        )()));
        this.renderChildrens = false;
        
        /** @type {Vector2} */
        this.position = position;
        /** @type {Vector2} */
        this.worldPosition = this.getWorldPos();
        
    }

    /** @type {void} */ 
    getWorldPos(){
        return this.chunk.position.add(this.position).scale(this.chunk.world.properties.chunkSize);
    }

    generateProperties(){
        const properties = {
            radius: Measure.length.Er,
            mass: Measure.mass.Em,
            temperature: null,
            color: "#ffffff"
        };

        return properties;
    }

    generateChildrens(){
        const rng = new Math.seedrandom(this.seed);

        return;
    }

    updateOrbit(){
        let pivotPosition;
        if (this.parentBody.object != null){
            if (this.parentBody.object instanceof Star){
                pivotPosition = this.parentBody.object.position;
            } else
            if (this.parentBody.object instanceof Vector2){
                pivotPosition = this.parentBody.object;
            } else {
                return;
            }
        } else {
            return;
        }

        const position = pivotPosition.add(Vector2.right.scale(
            this.parentBody.distanceTo
        ).scale(1 / this.chunk.world.properties.chunkSize).rotate(
            Time.elapsedTime / 1000 / (this.parentBody.distanceTo / 1000) +
            this.parentBody.startAngle
        ));

        this.position = position;
        this.worldPosition = this.getWorldPos();

    }

    drawThis(){
        this.updateOrbit();
        this.chunk.world.camera.drawPlanet(this);
        if (
            this.chunk.world.camera.worldLengthToScreenLength(this.properties.radius) >
            this.chunk.world.camera.properties.bodies.minMagnitudeToDraw &&
            this.chunk.world.camera.isOnScreen(
                this.worldPosition,
                this.chunk.world.camera.worldLengthToScreenLength(
                    Measure.length.AU * 100
                )
            )
        ){
            if (this.childrens.length == 0){
                this.generateChildrens();
                this.renderChildrens = true;
            }
        } else {
            this.renderChildrens = false;
        }
    }

    drawChildrens(){
        if (this.renderChildrens){
            for (let body of this.childrens){
                this.chunk.world.camera.drawPlanet(body);
            }
        }
    }

}