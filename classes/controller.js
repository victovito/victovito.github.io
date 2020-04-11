class Controller
{
    static moveSpeed = 10;
    static rotationSpeed = 0.9;

    static selectedBody = null;

    static controllCamera(/** @type {Camera} */ camera){

        let moveOffset = new Vector2(
            InputListener.right && InputListener.left ? 0 :
            InputListener.right ? 1 :
            InputListener.left ? -1 :
            0,
            InputListener.up && InputListener.down ? 0 :
            InputListener.up ? 1 :
            InputListener.down ? -1 :
            0
        );
        moveOffset = moveOffset.normalized();
        camera.translate(moveOffset.scale(this.moveSpeed * camera.size));

        if (InputListener.mouse1) {
            if (!InputListener.mouse1click){
                camera.translate(InputListener.mouseOffset.scale(-camera.size));
            }
        }
        
        if (!InputListener.mouse3){
            const multiplier = 1 - InputListener.scrollOffset / 10;
            camera.applyZoom(multiplier);
            if (InputListener.scrollOffset != 0){
                camera.position = Vector2.lerp(
                    camera.position,
                    camera.screenPointToWorldPos(
                        InputListener.mousePosition.invertY()
                    ),
                    InputListener.scrollOffset / 9
                );
            }
        } else {
            camera.applyZoom(1 - InputListener.mouseOffset.y / 100)
        }
        
        if (!InputListener.mouse2){
            let rotation = (
                InputListener.turnLeft && InputListener.turnRight ? 0 :
                InputListener.turnRight ? this.rotationSpeed : 
                InputListener.turnLeft ? -this.rotationSpeed :
                0
            ) * Math.PI / 180;
            camera.rotate(-rotation);
        } else {
            if (!InputListener.mouse1click){
                camera.rotate(InputListener.mouseOffset.x * Math.PI / 180 / 2);
            }
        }

        if (InputListener.mouse1click){
            this.selectedBody = camera.getBodyByScreenPoint(InputListener.mousePosition);
            console.log(this.selectedBody);
        }
    }
}