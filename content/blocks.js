
var BLOCK = {
    AIR: 0,
    WATER: 1,
    DIRT: 2,
    GRASS: 3,
    STONE: 4,
    SAND: 5,
    LEAVES: 6,
    GLOWSTONE: 7,
    LOG: 8,
    properties: {
        0: {name: "Air", texture: null, isTransparent: true,
            passLightAmount: 12, emitLightAmount: 0},

        1: {name: "Water", texture: "water", isTransparent: true,
            passLightAmount: 8, emitLightAmount: 0},

        2: {name: "Dirt", texture: "dirt", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "dirt_bg"},

        3: {name: "Grass", texture: "grass", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "grass_bg"},

        4: {name: "Stone", texture: "stone", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "stone_bg"},

        5: {name: "Sand", texture: "sand", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0},

        6: {name: "Leaves", texture: "leaves", isTransparent: true,
            passLightAmount: 6, emitLightAmount: 0},

        7: {name: "Glowstone", texture: "glowstone", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 4},
        
        8: {name: "Log", texture: "log", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0},

    }
};
