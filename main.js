
var world;
var camera;

var blockSelected;

var bg_canvas;
var bg;

function Run(){
    bg_canvas = InitCanvas();
    bg = bg_canvas.getContext("2d");
    
    CreateInputs(left = "a", right = "d");
    
    world = new World();
    camera = new Camera(bg);
    
    let randomXpos = Math.floor((Math.random() * 200) - 100) + 0.5;
    world.GenerateRecursiveWorld(randomXpos, world.renderChunksDistance);
    
    new Player(new Vector2(randomXpos, world.chunks[0].GetTerrainHeight(randomXpos)));
    
    blockSelected = BLOCK.STONE;
    
    Update();
    
}

function Update(){
    world.GenerateRecursiveWorld(playerList[0].position.x, world.renderChunksDistance);
    world.RemoveFarChunks(playerList[0].position.x);
    UpdatePlayers();
    camera.Render(bg);
    playerPositionX = camera.position.x;
    camera.position = playerList[0].position;

    window.requestAnimationFrame(Update);
}

window.onload = Run;
