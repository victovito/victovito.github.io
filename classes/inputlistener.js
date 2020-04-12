class InputListener
{
    
    /** @type {Vector2} */
    static mouseOffset = new Vector2();
    /** @type {Vector2} */
    static mousePosition = new Vector2();
    static mouseStopTimer;

    static scrollOffset = 0;
    static lastScroll = 0;
    static lastScrollMousePos = Vector2.zero;

    static mouse1 = false;
    static mouse2 = false;
    static mouse3 = false;

    static mouse1click = false;
    static mouse1clickStart = 0;
    static mouse2click = false;
    static mouse2clickStart = 0;

    static up = false;
    static down = false;
    static left = false;
    static right = false;
    
    static turnRight = false;
    static turnLeft = false;

    static addListeners(){
        document.addEventListener("mousemove", function(e){
            InputListener.mouseOffset = InputListener.mouseOffset.add(
                new Vector2(e.movementX, -e.movementY)
            );
            InputListener.mousePosition = new Vector2(e.x, e.y);
        });

        document.addEventListener("mousedown", function(e) {
            if (e.button == 0){
                InputListener.mouse1 = true;
                InputListener.mouse1clickStart = Date.now();
            }
            if (e.button == 2){
                InputListener.mouse2 = true;
                InputListener.mouse2clickStart = Date.now();
            }
            if (e.button == 1){
                InputListener.mouse3 = true;
            }
        });
        document.addEventListener("mouseup", function(e){
            if (e.button == 0){
                InputListener.mouse1 = false;
            }
            if (e.button == 2){
                InputListener.mouse2 = false;
            }
            if (e.button == 1){
                InputListener.mouse3 = false;
            }
        });
        document.addEventListener("contextmenu", function(e){
            e.preventDefault();
            if (Date.now() - InputListener.mouse2clickStart < 200){
                InputListener.mouse2click = true;
            }
        });
        document.addEventListener("click", function(e){
            if (Date.now() - InputListener.mouse1clickStart < 200){
                InputListener.mouse1click = true;
            }
        })

        document.addEventListener("wheel", function(e){
            InputListener.scrollOffset = e.wheelDeltaY > 0 ? 1 : -1;
            InputListener.lastScroll = Date.now();
            InputListener.lastScrollMousePos = InputListener.mousePosition;
        })

        document.addEventListener("keydown", function(e){
            if (e.key == "w" || e.key == "ArrowUp"){
                InputListener.up = true;
            }
            if (e.key == "s" || e.key == "ArrowDown"){
                InputListener.down = true;
            }
            if (e.key == "a" || e.key == "ArrowLeft"){
                InputListener.left = true;
            }
            if (e.key == "d" || e.key == "ArrowRight"){
                InputListener.right = true;
            }
            if (e.key == "q"){
                InputListener.turnRight = true;
            }
            if (e.key == "e"){
                InputListener.turnLeft = true;
            }
        });
        document.addEventListener("keyup", function(e){
            if (e.key == "w" || e.key == "ArrowUp"){
                InputListener.up = false;
            }
            if (e.key == "s" || e.key == "ArrowDown"){
                InputListener.down = false;
            }
            if (e.key == "a" || e.key == "ArrowLeft"){
                InputListener.left = false;
            }
            if (e.key == "d" || e.key == "ArrowRight"){
                InputListener.right = false;
            }
            if (e.key == "q"){
                InputListener.turnRight = false;
            }
            if (e.key == "e"){
                InputListener.turnLeft = false;
            }
        });
    }

    static resetPerFrameInputs(){
        InputListener.mouseOffset = Vector2.zero;
        InputListener.scrollOffset = 0;
        InputListener.mouse1click = false;
        InputListener.mouse2click = false;
    }
}