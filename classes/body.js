class Body
{
    constructor(
        /** @type {Chunk} */ chunk,
        /** @type {Vector2} */ position,
        /** @type {string} */ name,
        /** @type {Body.type} */ type,
        /** @type {object} */ properties,
        /** @type {Body} */ parentBody
    ){
        
        /** @type {Chunk} */
        this.chunk = chunk;

        /** @type {string} */ 
        this.name = name;
        
        /** @type {Body} */
        this.parentBody = parentBody;

        this.type = type;

        this.properties = properties;
        // this.properties = {
        //     classification,
        //     radius,
        //     mass,
        //     temperature,
        //     luminosity,
        //     color
        // };
        
        /** @type {Vector2} */
        this.position = position;
        /** @type {Vector2} */
        this.worldPosition = this.getWorldPos();

        // if (
        //     this.properties.spectralType == Body.type.STAR.classification.spectralTypes.V
        // ){
        //     Controller.selectedBody = this;
        //     console.log(this);
        // }
        
    }
    
    /** @type {void} */ 
    getWorldPos(){
        return this.chunk.position.add(this.position).scale(this.chunk.world.properties.chunkSize);
    }

    static type = {
        GENERIC: {
            name: "Generic",
            index: 0
        },
        ASTEROID: {
            name: "Asteroid",
            index: 1
        },
        MOON: {
            name: "Moon",
            index: 2
        },
        PLANET: {
            name: "Planet",
            index: 3
        },
        STAR: {
            name: "Star",
            index: 4,
            classification: {
                getLuminosity: function (radius, temperature){
                    return (
                        4 * Math.PI * Math.pow(radius * 1000, 2) *
                        5.67e-8 * Math.pow(temperature, 4)
                    ) * Measure.luminosity.units.W.value;
                },
                getRadius: function (rng){
                    let value = rng() * Object.keys(
                        Body.type.STAR.classification.radiuses
                    ).reduce(
                        (a, b) => a + Body.type.STAR.classification.radiuses[b].rarity, 0
                    );
                    let radiusRange;
                    for (let c of Object.keys(Body.type.STAR.classification.radiuses)){
                        if (value < Body.type.STAR.classification.radiuses[c].rarity){
                            radiusRange = Body.type.STAR.classification.radiuses[c];
                            break;
                        }
                        value -= Body.type.STAR.classification.radiuses[c].rarity;
                    }
                    return Utils.lerp(radiusRange.min, radiusRange.max, rng());
                },
                radiuses: {
                    0: {
                        min: 0.1 * Measure.length.Sr, max: 0.7 * Measure.length.Sr,
                        rarity: 30
                    },
                    1: {
                        min: 0.7 * Measure.length.Sr, max: 3 * Measure.length.Sr,
                        rarity: 30
                    },
                    2: {
                        min: 3 * Measure.length.Sr, max: 60 * Measure.length.Sr,
                        rarity: 10
                    },
                    3: {
                        min: 60 * Measure.length.Sr, max: 1500 * Measure.length.Sr,
                        rarity: 5
                    },
                    4: {
                        min: 1500 * Measure.length.Sr, max: 3000 * Measure.length.Sr,
                        rarity: 0.1
                    }
                },
                spectralTypes: {
                    V: {
                        name: "V-type (this is an easter egg)",
                        color: "#f5fff9",
                        temperature: { min: 40000, max: 100000 },
                        rarity: 0.01
                    },
                    O: {
                        name: "O-type",
                        color: "#66ccff",
                        temperature: { min: 25000, max: 40000 },
                        rarity: 3
                    },
                    B: {
                        name: "B-type",
                        color: "#a6e0f8",
                        temperature: { min: 10000, max: 25000 },
                        rarity: 7
                    },
                    A: {
                        name: "A-type",
                        color: "#f0f7fd",
                        temperature: { min: 7500, max: 10000 },
                        rarity: 10
                    },
                    F: {
                        name: "F-type",
                        color: "#fffcd6",
                        temperature: { min: 6000, max: 7500 },
                        rarity: 15
                    },
                    G: {
                        name: "G-type",
                        color: "#ffed84",
                        temperature: { min: 5000, max: 6000 },
                        rarity: 20
                    },
                    K: {
                        name: "K-type",
                        color: "#f9a76f",
                        temperature: { min: 3500, max: 5000 },
                        rarity: 30
                    },
                    M: {
                        name: "M-type",
                        color: "#e34424",
                        temperature: { min: 1000, max: 3500 },
                        rarity: 50
                    },
                }
            },
            /** @returns {Object} */
            generateProperties: function(rng){
                const properties = {
                    spectralType: null,
                    radius: null,
                    mass: null,
                    temperature: null,
                    luminosity: null,
                    color: "#ffffff"
                };

                properties.spectralType = Utils.choseFromObjectWithRarity(
                    Body.type.STAR.classification.spectralTypes
                );

                properties.temperature = Utils.lerp(
                    properties.spectralType.temperature.min,
                    properties.spectralType.temperature.max,
                    rng()
                );

                properties.radius = Body.type.STAR.classification.getRadius(rng);

                properties.mass = 1;
                    
                properties.luminosity = Body.type.STAR.classification.getLuminosity(
                    properties.radius, properties.temperature
                );
                
                properties.color = properties.spectralType.color;

                return properties;
            }
        },
        BLACKHOLE: {
            name: "Black Hole",
            index: 5
        }
    }

}