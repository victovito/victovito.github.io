
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
            passLightAmount: 14, emitLightAmount: 0, isSolid: false},

        1: {name: "Water", texture: "water", isTransparent: true,
            passLightAmount: 12, emitLightAmount: 0, isSolid: false},

        2: {name: "Dirt", texture: "dirt", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "dirt_bg",
            isSolid: true},

        3: {name: "Grass", texture: "grass", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "grass_bg",
            isSolid: true},

        4: {name: "Stone", texture: "stone", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, backGroundTexture: "stone_bg",
            isSolid: true},

        5: {name: "Sand", texture: "sand", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, isSolid: true},

        6: {name: "Leaves", texture: "leaves", isTransparent: true,
            passLightAmount: 10, emitLightAmount: 0, isSolid: true},

        7: {name: "Glowstone", texture: "glowstone", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 1, isSolid: true},
        
        8: {name: "Log", texture: "log", isTransparent: false,
            passLightAmount: 0, emitLightAmount: 0, isSolid: true},

    }
};
