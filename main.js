
var world;
var camera;

var blockSelected;

var bg_canvas;
var bg;

var oito = 8;

var Input = {
    left: false,
    right: false,
    up: false,
    down: false,
};

function Run(){
    bg_canvas = InitCanvas();
    bg = bg_canvas.getContext("2d");
    
    CreateInputs(left = "a", right = "d");
    
    world = new World();
    camera = new Camera(bg);
    blockSelected = BLOCK.STONE;

    Update();

}
function Update(){
    Tst_movePlayer();
    world.GenerateRecursiveWorld(playerPositionX, world.renderChunksDistance);
    world.RemoveFarChunks(playerPositionX);
    camera.Render(bg);
    playerPositionX = camera.position.x;

    window.requestAnimationFrame(Update);
}

function CreateInputs(
    left = "a",
    right = "d",
    up = "w",
    down = "s"
){
    window.addEventListener("keydown", function(e){
        if (e.key == left){
            Input.left = true;
        }
        if (e.key == right){
            Input.right = true;
        }
        if (e.key == up){
            Input.up = true;
        }
        if (e.key == down){
            Input.down = true;
        }
    });
    window.addEventListener("keyup", function(e){
        if (e.key == left){
            Input.left = false;
        }
        if (e.key == right){
            Input.right = false;
        }
        if (e.key == up){
            Input.up = false;
        }
        if (e.key == down){
            Input.down = false;
        }
    });
}

window.onload = Run;
