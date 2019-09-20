
var Input = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
};

function CreateInputs(
    left = "a",
    right = "d",
    up = "w",
    down = "s",
    jump = " "
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
        if (e.key == jump){
            Input.jump = true;
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
        if (e.key == jump){
            Input.jump = false;
        }
    });
}
