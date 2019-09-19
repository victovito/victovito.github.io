class Camera
{
    constructor(ctx, position = new Vector2(0, 110), zoom = 50){
        this.ctx = ctx;

        this.position = position;
        this.zoom = zoom;

        this.target = null;
    }

    Render(){
        this.DrawBackground(this.ctx);
        world.DrawWorld();
    }

    RenderBlock(block){

        if (block.type == BLOCK.AIR){
            if (block.backgroundBlock != BLOCK.AIR){
                let c = block.parentChunk;
                let ctx = c.ctx;
                let bgTexture = GetBlockTexture(BLOCK.properties[block.backgroundBlock].backGroundTexture);
                let relativePos = block.position.Sub(c.position);
                let size = this.WorldLengthToScreenLenght(1);
                let canvasPos = relativePos.Scale(size);
                canvasPos.y = c.chunkCanvas.clientHeight - canvasPos.y;
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.drawImage(bgTexture, canvasPos.x, canvasPos.y, size, -size);
                ctx.globalCompositeOperation = "source-atop";
                ctx.globalAlpha = 1 - Math.min(block.luminosity, 1);
                ctx.drawImage(document.getElementById("luminosity0"), canvasPos.x, canvasPos.y, size, -size);
                return;
            } else {
                return;
            }
        }

        if (BLOCK.properties[block.type].isTransparent){
            let c = block.parentChunk;
            let ctx = c.ctx;
            let texture = GetBlockTexture(BLOCK.properties[block.type].texture);
            let relativePos = block.position.Sub(c.position);
            let size = this.WorldLengthToScreenLenght(1);
            let canvasPos = relativePos.Scale(size);
            canvasPos.y = c.chunkCanvas.clientHeight - canvasPos.y;
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            if (block.backgroundBlock != BLOCK.AIR){
                let bgTexture = GetBlockTexture(BLOCK.properties[block.backgroundBlock].backGroundTexture);
                ctx.drawImage(bgTexture, canvasPos.x, canvasPos.y, size, -size);
            }
            ctx.drawImage(texture, canvasPos.x, canvasPos.y, size, -size);
            ctx.globalCompositeOperation = "source-atop";
            ctx.globalAlpha = 1 - Math.min(block.luminosity, 1);
            ctx.drawImage(document.getElementById("luminosity0"), canvasPos.x, canvasPos.y, size, -size);
            return;
        }

        let c = block.parentChunk;
        let ctx = c.ctx;
        let texture = GetBlockTexture(BLOCK.properties[block.type].texture);
        let relativePos = block.position.Sub(c.position);
        let size = this.WorldLengthToScreenLenght(1);
        let canvasPos = relativePos.Scale(size);
        canvasPos.y = c.chunkCanvas.clientHeight - canvasPos.y;
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.drawImage(texture, canvasPos.x, canvasPos.y, size, -size);
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = 1 - Math.min(block.luminosity, 1);
        ctx.drawImage(document.getElementById("luminosity0"), canvasPos.x, canvasPos.y, size, -size);
    }

    ResizeChunkCanvas(canvas){
        let x = Math.max(Math.floor(this.WorldLengthToScreenLenght(world.chunkSizeX)), 1);
        let y = Math.max(Math.floor(this.WorldLengthToScreenLenght(world.chunkSizeY)), 1);
        canvas.width = x;
        canvas.height = y;
        canvas.style.width = `${x + 1}px`
        canvas.style.height = `${y}px`
    }

    PostionChunkCanvas(chunk){
        let screenPos = this.WorldPosToScreenPoint(chunk.position.ToVector2()).ToVector2Int();
        chunk.chunkCanvas.style.left = `${screenPos.x}px`;
        chunk.chunkCanvas.style.top = `${screenPos.y - this.WorldLengthToScreenLenght(world.chunkSizeY)}px`;
    }

    DrawBackground(ctx) {
        var sky = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
        sky.addColorStop(0.6, "#CCDAF1");
        sky.addColorStop(0, "#70A1EC");
        ctx.fillStyle = sky;
        ctx.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);
    }

    WorldPosToScreenPoint(position){
        position = position.InvertY();
        return position.Sub(this.position.InvertY()).Scale(this.zoom)
        .Add(new Vector2(canvas.clientWidth / 2, canvas.clientHeight / 2));
    }

    ScreenPointToWorldPos(point){
        try {point = point.ToVector2();} catch{}
        point = point.Sub(new Vector2(canvas.clientWidth / 2, canvas.clientHeight / 2));
        return this.position.InvertY().Add(point.Scale(1/this.zoom)).InvertY();
    }

    WorldLengthToScreenLenght(length){
        return length * this.zoom;
    }

}