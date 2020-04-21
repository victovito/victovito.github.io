/** @type {Camera} */
let camera;
/** @type {Hud} */
let hud;
/** @type {World} */
let world;

const urlParams = new URLSearchParams(window.location.search);

function start(){
    console.log("Started");
    
    hud = new Hud(
        new Canvas(document.getElementById("hudCanvas"))
    );
    camera = new Camera(
        new Canvas(document.getElementById("mainCanvas")), hud
    );
    world = new World(camera, urlParams.get("seed"));

    camera.position = new Vector2(
        world.properties.chunkSize, world.properties.chunkSize
    ).scale(0.5);
    
    InputListener.addListeners();

    requestAnimationFrame(update);
}

function update(){

    Time.update();
    
    Controller.controllCamera(camera);
    
    world.manageChunks();
    
    camera.draw();
    hud.draw();

    InputListener.resetPerFrameInputs();
    requestAnimationFrame(update);
}

// function easterEggLOL(){
//     if (world.stringSeed == "lucas"){
//         const rng = new Math.seedrandom("lucas");
        
//         const properties = Body.type.STAR.getProperties(
//             Body.type.STAR.classification.spectralTypes.G, rng
//         );
//         properties.radius = (rng() * 1500 + 1500) * Measure.length.Sr * 100000;
//         properties.temperature = rng() * 10000 + 10000;
//         properties.luminosity = Body.type.STAR.classification.getLuminosity(
//             properties.radius, properties.temperature
//         );

//         const body = new Body(
//             world.loadedChunks[0],
//             new Vector2(rng(), rng()),
//             "Lucas",
//             Body.type.STAR,
//             properties,
//             null
//         );

//         world.loadedChunks[0].bodies.push(body);
//         Controller.selectedBody = body;
//         camera.position = body.worldPosition;
//     }
// }
