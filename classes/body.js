class Body
{
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
            index: 3,
            classification: {
                distances: {
                    0: {
                        min: 0.25 * Measure.length.AU, max: 2 * Measure.length.AU,
                        rarity: 30
                    },
                    1: {
                        min: 2 * Measure.length.AU, max: 15 * Measure.length.AU,
                        rarity: 30
                    },
                    2: {
                        min: 15 * Measure.length.AU, max: 40 * Measure.length.AU,
                        rarity: 30
                    },
                }
            }
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
                        rarity: 50
                    },
                    1: {
                        min: 0.7 * Measure.length.Sr, max: 2 * Measure.length.Sr,
                        rarity: 30
                    },
                    2: {
                        min: 2 * Measure.length.Sr, max: 60 * Measure.length.Sr,
                        rarity: 7
                    },
                    3: {
                        min: 60 * Measure.length.Sr, max: 1500 * Measure.length.Sr,
                        rarity: 3
                    },
                    4: {
                        min: 1500 * Measure.length.Sr, max: 3000 * Measure.length.Sr,
                        rarity: 0.01
                    }
                },
                spectralTypes: {
                    V: {
                        name: "V-type (this is an easter egg)",
                        color: "#f5fff9",
                        temperature: { min: 40000, max: 100000 },
                        mass: { min: 1, max: 2 },
                        rarity: 0.01
                    },
                    O: {
                        name: "O-type",
                        color: "#66ccff",
                        temperature: { min: 25000, max: 40000 },
                        mass: { min: 6.6 * Measure.mass.Sm, max: 15 * Measure.mass.Sm },
                        rarity: 2
                    },
                    B: {
                        name: "B-type",
                        color: "#a6e0f8",
                        temperature: { min: 10000, max: 25000 },
                        mass: { min: 1.8 * Measure.mass.Sm, max: 6.6 * Measure.mass.Sm },
                        rarity: 5
                    },
                    A: {
                        name: "A-type",
                        color: "#f0f7fd",
                        temperature: { min: 7500, max: 10000 },
                        mass: { min: 1.4 * Measure.mass.Sm, max: 2.2 * Measure.mass.Sm },
                        rarity: 8
                    },
                    F: {
                        name: "F-type",
                        color: "#fffcd6",
                        temperature: { min: 6000, max: 7500 },
                        mass: { min: 1.15 * Measure.mass.Sm, max: 1.4 * Measure.mass.Sm },
                        rarity: 15
                    },
                    G: {
                        name: "G-type",
                        color: "#ffed84",
                        temperature: { min: 5000, max: 6000 },
                        mass: { min: 0.9 * Measure.mass.Sm, max: 1.15 * Measure.mass.Sm },
                        rarity: 20
                    },
                    K: {
                        name: "K-type",
                        color: "#f9a76f",
                        temperature: { min: 3500, max: 5000 },
                        mass: { min: 0.45 * Measure.mass.Sm, max: 0.9 * Measure.mass.Sm },
                        rarity: 30
                    },
                    M: {
                        name: "M-type",
                        color: "#e34424",
                        temperature: { min: 2500, max: 3500 },
                        mass: { min: 0.08 * Measure.mass.Sm, max: 0.45 * Measure.mass.Sm },
                        rarity: 50
                    },
                }
            }
        },
        BLACKHOLE: {
            name: "Black Hole",
            index: 5
        }
    }

}
