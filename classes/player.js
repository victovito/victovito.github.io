var playerList = []
class Player
{
    constructor(position = new Vector2(0, 110)){
        playerList.push(this);
        this.id = `player_${playerList.indexOf(this) + 1}`;
        
        this.position = position

        this.health = 100;
        
        this.speed = 6;
        this.jumpForce = 10;

        this.size = new Vector2(0.75, 1.6);

        this.velocity = new Vector2();
        this.inGround = false;

        this.entityCanvas = document.createElement("canvas");
        document.body.appendChild(this.entityCanvas);
        this.entityCanvas.id = this.id;
        this.entityCanvas.style.zIndex = 3;
        this.ctx = this.entityCanvas.getContext("2d");
        
        camera.PostionEntityCanvas(this);
        camera.ResizeEntityCanvas(this);
    }

    UpdatePlayer(){
        this.Draw();
        
        let movement = new Vector2();
        if (Input.right){
            movement.x += 1;
        }
        if (Input.left){
            movement.x -= 1;
        }

        if (this.inGround){
            if (Input.jump){
                this.velocity.y = 0.15;
            }
        }

        this.position = this.position.Add(movement.Scale(this.speed * deltaTime));
        this.UpdateVelocity();

    }

    GetFallAmount(){

        let contactPoints = [this.position.x - this.size.x/2, this.position.x, this.position.x + this.size.x / 2];
        let dists = [];
        
        for (let cp of contactPoints){
            for (let y = this.position.y; true; --y){
                if (y < 0){
                    break;
                }
                let block = world.GetBlockAt(new Vector2Int(cp, y));
                if (block == undefined){
                    continue;
                }
                if (BLOCK.properties[block.type].isSolid){
                    dists.push(-(this.position.y - block.position.y - 1));
                    break;
                } else {
                    continue;
                }
            }
        }
        let fallAmount = Math.max.apply(Math, dists);
        if (fallAmount >= 0){
            if (!this.inGround){
                this.velocity = new Vector2();
            }
            this.inGround = true;
        } else {
            this.inGround = false;
        }
        return Math.max(fallAmount, this.velocity.y);
    }

    UpdateVelocity(){
        if (!this.inGround){
            this.velocity = this.velocity.Sub(new Vector2(0, world.gravity / 1000));
        }
        this.position = this.position.Add(new Vector2(0, this.GetFallAmount()));
    }

    Draw(){
        camera.PostionEntityCanvas(this);
        let block = world.GetBlockAt(this.position);
        let blockIlum = 0;
        if (block != undefined){
            blockIlum = block.luminosity;
        }
        this.ctx.fillStyle = `rgb(${blockIlum * 255},${blockIlum * 255},${blockIlum * 255})`;
        this.ctx.fillRect(0, 0, 1000, 1000);
    }

}

function UpdatePlayers(){
    for (let player of playerList){
        player.UpdatePlayer();
    }
}
