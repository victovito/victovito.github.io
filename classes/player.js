var playerList = []
class Player
{
    constructor(position = new Vector2(0, 110)){
        playerList.push(this);
        this.id = `player_${playerList.indexOf(this) + 1}`;
        
        this.position = position
        this.velocity = new Vector2();

        this.health = 100;
        
        this.speed = 7;
        this.jumpForce = 21;

        this.size = new Vector2(0.75, 1.6);
        this.maxVerticalVelocity = 2;
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
        
        this.velocity.x = 0;
        if (Input.right){
            this.velocity.x += this.speed * deltaTime;
        }
        if (Input.left){
            this.velocity.x -= this.speed * deltaTime;
        }

        if (this.inGround){
            if (Input.jump){
                this.velocity.y = this.jumpForce / 100;
            }
        }
        this.position = this.position.Add(new Vector2(this.GetMoveAmountX(), this.GetMoveAmountY()));
        this.GravityForce();

    }

    GetMoveAmountX(){
        let contactPoints = [
            this.position.y,
            this.position.y + this.size.y / 2,
            this.position.y + this.size.y
        ]
        let dists = [];
        if (this.velocity.x > 0){
            for (let cp of contactPoints){
                for (let x = this.position.x + this.size.x/2; true; x++){
                    let block = world.GetBlockAt(new Vector2Int(x, cp));
                    if (block == undefined){
                        break;
                    }
                    if (BLOCK.properties[block.type].isSolid){
                        dists.push(block.position.x - (this.position.x + this.size.x/2) - 0.01);
                        break;
                    }
                }
            }
            let moveAmount = Math.min.apply(Math, dists);
            return Math.min(moveAmount, this.velocity.x);
        }
        else if (this.velocity.x < 0){
            for (let cp of contactPoints){
                for (let x = this.position.x - this.size.x/2; true; x--){
                    let block = world.GetBlockAt(new Vector2Int(x, cp));
                    if (block == undefined){
                        break;
                    }
                    if (BLOCK.properties[block.type].isSolid){
                        dists.push(block.position.x + 1 - (this.position.x - this.size.x/2) + 0.01);
                        break;
                    }
                }
            }
            let moveAmount = Math.max.apply(Math, dists);
            return Math.max(moveAmount, this.velocity.x);
        }
        else {
            return 0;
        }
    }

    GetMoveAmountY(){
        if (this.velocity.y <= 0){
            let contactPoints = [this.position.x - this.size.x / 2,
                this.position.x, this.position.x + this.size.x / 2];
            let dists = [];
            for (let cp of contactPoints){
                for (let y = this.position.y; true; y--){
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
            let moveAmount = Math.max.apply(Math, dists);
            if (moveAmount >= 0){
                if (!this.inGround){
                    this.velocity.y = 0;
                }
                this.inGround = true;
            } else {
                this.inGround = false;
            }
            return Math.max(moveAmount, this.velocity.y);
        } else {
            this.inGround = false;
            let contactPoints = [this.position.x - this.size.x/2, this.position.x, this.position.x + this.size.x / 2];
            let dists = [];
            for (let cp of contactPoints){
                for (let y = this.position.y + this.size.y; true; y++){
                    if (y > world.chunkSizeY){
                        break;
                    }
                    let block = world.GetBlockAt(new Vector2Int(cp, y));
                    if (block == undefined){
                        continue;
                    }
                    if (BLOCK.properties[block.type].isSolid){
                        dists.push(block.position.y - (this.position.y + this.size.y) - 0.01);
                        break;
                    } else {
                        continue;
                    }
                }
            }
            let moveAmount = Math.min.apply(Math, dists);
            if (moveAmount <= 0.01){
                this.velocity.y = 0;
            }
            return Math.min(moveAmount, this.velocity.y);
        }
    }

    GravityForce(){
        if (!this.inGround){
            this.velocity = this.velocity.Sub(new Vector2(0, world.gravity / 10).Scale(deltaTime));
        }
        this.velocity.y = Math.max(Math.min(this.velocity.y, this.maxVerticalVelocity), -this.maxVerticalVelocity);
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
