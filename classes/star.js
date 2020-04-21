class Star
{
    constructor(
        /** @type {Chunk} */ chunk,
        /** @type {Vector2} */ position,
        /** @type {string} */ name,
        parentBody,
        id
    ){
        
        /** @type {Chunk} */
        this.chunk = chunk;

        /** @type {string} */ 
        this.name = name;

        this.type = Body.type.STAR;

        this.id = id.toString();
        
        this.seed = this.chunk.seed + Utils.stringHash(this.id);
        
        this.parentBody = {
            object: parentBody,
            distanceTo: null,
        };

        /** @type {Vector2} */
        this.position = position;
        /** @type {Vector2} */
        this.worldPosition = this.getWorldPos();

        this.properties = this.generateProperties();

        /** @type {Planet[]} */
        this.childrens = [];
        this.childCount = Math.floor(Utils.lerp(0, 10, new Math.seedrandom(
            this.seed + Utils.stringHash("childCount")
        )()));
        this.renderChildrens = false;
        
    }

    generateProperties(){
        const properties = {
            spectralType: null,
            radius: null,
            mass: null,
            temperature: null,
            luminosity: null,
            color: "#ffffff"
        };

        const rng = new Math.seedrandom(this.seed + Utils.stringHash("properties"));

        properties.spectralType = Utils.choseFromObjectWithRarity(
            Body.type.STAR.classification.spectralTypes, rng
        );

        const sld = rng();

        properties.temperature = Utils.lerp(
            properties.spectralType.temperature.min,
            properties.spectralType.temperature.max,
            sld
        );

        properties.radius = Body.type.STAR.classification.getRadius(rng);
            
        properties.luminosity = Body.type.STAR.classification.getLuminosity(
            properties.radius, properties.temperature
        );

        // properties.mass = Utils.lerp(
        //     properties.spectralType.mass.min,
        //     properties.spectralType.mass.max,
        //     sld
        // );
        const exp = 6;
        properties.mass = Math.pow(
            Math.pow(Measure.mass.Sm, exp) * properties.luminosity,
            1 / exp
        );
        
        properties.color = properties.spectralType.color;

        return properties;
    }

    generateChildrens(){
        const rng = new Math.seedrandom(this.seed);

        for (let i = 0; i < this.childCount; i++){
            const planet = new Planet(
                this.chunk, Vector2.zero, "Unnamed Planet", this, i
            );
            // planet.parentBody.distanceTo = Utils.clamp(
            //     Math.pow(50, rng() - 1.75), 0, 1
            // ) * Measure.length.AU * (25 / 2) * 
            // this.properties.radius / Measure.length.Sr +
            // this.properties.radius;
            const distRange = Utils.choseFromObjectWithRarity(
                Body.type.PLANET.classification.distances
            );
            planet.parentBody.distanceTo = Utils.lerp(
                distRange.min * (this.properties.radius / Measure.length.Sr),
                distRange.max * (this.properties.radius / Measure.length.Sr),
                rng()
            );
            planet.parentBody.startAngle = Utils.lerp(0, 2 * Math.PI, rng());
            this.childrens.push(planet);
        }
    }
    
    /** @type {void} */ 
    getWorldPos(){
        return this.chunk.position.add(this.position).scale(this.chunk.world.properties.chunkSize);
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
            Time.elapsedTime / 1000 / (this.parentBody.distanceTo / 1000)
        ));

        this.position = position;
        this.worldPosition = this.getWorldPos();

    }

    drawThis(){
        this.updateOrbit();
        this.chunk.world.camera.drawStar(this);
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
            }
            this.renderChildrens = true;
        } else {
            this.renderChildrens = false;
        }
    }

    drawChildrens(){
        if (this.renderChildrens){
            for (let body of this.childrens){
                body.drawThis();
            }
        }
    }

}