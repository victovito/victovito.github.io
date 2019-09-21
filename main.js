
var world;
var camera;

var blockSelected;

var deltaTime = 0;
var lastUpdate = Date.now();
var start = Date.now();
var time = 0;

function Run(){
    InitGame();
    
    CreateInputs(left = "a", right = "d");
    
    world = new World();
    camera = new Camera();
    
    let randomXpos = Math.floor((Math.random() * 200) - 100) + 0.5;
    world.GenerateRecursiveWorld(randomXpos, world.renderChunksDistance);
    
    new Player(new Vector2(randomXpos, world.chunks[0].GetTerrainHeight(randomXpos)));
    
    blockSelected = BLOCK.STONE;
    
    Update();
    
}

function Update(){
    time = Date.now() - start;
    let now = Date.now();
    deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;

    world.GenerateRecursiveWorld(playerList[0].position.x, world.renderChunksDistance);
    world.RemoveFarChunks(playerList[0].position.x);
    UpdatePlayers();
    playerPositionX = camera.position.x;
    camera.position = playerList[0].position;
    camera.Render();

    window.requestAnimationFrame(Update);
}

window.onload = Run;
