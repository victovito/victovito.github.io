class Camera
{
    constructor(/** @type {Canvas} */ canvas, /** @type {Hud} */ hud){
        /** @type {Vector2} */
        this.position = new Vector2();
        this.orientation = 0;
        // this.size = 3e3;
        this.size = 5000000000000;

        /** @type {World} */
        this.world;

        /** @type {Canvas} */ 
        this.canvas = canvas;
        this.canvas.canvasElement.style.zIndex = 1
        /** @type {CanvasRenderingContext2D} */ 
        this.ctx = this.canvas.ctx;

        /** @type {Hud} */ 
        this.hud = hud;
        this.hud.camera = this;
        this.hud.canvas.canvasElement.style.zIndex = parseInt(
            this.canvas.canvasElement.style.zIndex
        ) + 1;

        this.backgroundColor = "#000000";

        this.properties = {
            limitSize: true,
            maxSize: (Measure.length.LY * 100) / this.hud.scaleMarker.maxLenght,
            minSize: 1 / this.hud.scaleMarker.maxLenght,
            drawChunkBorder: false,
            chunkDebugMode: false,
            bodies: {
                minMagnitudeToDraw: 0.05,
                starBrightTransparency: 0.15
            }
        }

        /** @type {Body[]} */
        this.seenBodies = [];

        this.currentChunkPos = new Vector2();
    }

    /** @type {void} */
    translate(/** @type {Vector2} */ offset, global = false){
        this.position = this.position.add(offset.rotate(global ? 0 : -this.orientation));
    }

    /** @type {void} */
    rotate(/** @type {number} */ rad){
        this.orientation += rad;
    }
    
    /** @type {void} */
    applyZoom(/** @type {number} */ percent){
        if (percent != 1){
            this.world.update = true;
        }
        
        if (this.properties.limitSize){
            this.size = Math.min(
                Math.max(
                    this.size * percent, this.properties.minSize
                ), this.properties.maxSize
            );
        } else {
            this.size *= percent;
        }
    }

    /** @type {bool} */
    isOnScreen(/** @type {Vector2} */ position, margin = 0){
        const point = this.worldPosToScreenPoint(position);
        return point.x > 0 - margin && point.x < window.innerWidth + margin &&
            point.y > 0 - margin && point.y < window.innerHeight + margin;
    }

    /** @returns {Vector2} */
    worldPosToScreenPoint(/** @type {Vector2} */position){
        let result = position.sub(this.position).scale(1 / this.size).add(Vector2.screenCenter());
        return result.rotate(this.orientation, Vector2.screenCenter()).invertY();
    }

    /** @type {Vector2} */
    screenPointToWorldPos(point){
        point = point.invertY().rotate(this.orientation, Vector2.screenCenter()).invertY();
        let result = point.sub(Vector2.screenCenter()).scale(this.size).add(this.position);
        return result;
    }

    /** @type {number} */
    worldLengthToScreenLength(length){
        return length / this.size;
    }

    /** @type {number} */
    screenLengthToWorldLength(length){
        return length * this.size;
    }

    /** @type {void} */
    drawBackground(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    /** @returns {Body} */
    getBodyByScreenPoint(/** @type {Vector2} */ point){
        let result;
        for (let body of this.seenBodies){
            const distance = this.worldPosToScreenPoint(
                body.worldPosition
            ).distanceTo(point);
            if (!result){
                if (distance < 10 + this.worldLengthToScreenLength(body.properties.radius)){
                    result = [body, distance];
                }
            }
            if (distance < 10 && distance < result[1]){
                result = [body, distance];
            }
        }
        if (result){
            return result[0];
        } else {
            return null;
        }
    }

    /** @type {void} */
    drawBody(/** @type {Body} */ body){
        if (body.type == Body.type.STAR){
            this.drawStar(body);
        }
        switch (body.type) {
            case Body.type.STAR:
                this.drawStar(body);
                break;
        
            default:
                this.drawGeneric(body);
                break;
        }
    }

    drawGeneric(body){
        const bodyRadius = this.worldLengthToScreenLength(body.properties.radius);
        const bodyPos = this.worldPosToScreenPoint(body.worldPosition);
        const onScreen = this.isOnScreen(
            body.worldPosition,
            bodyRadius
        );

        if (!onScreen){
            return;
        }

        if (bodyRadius < this.properties.bodies.minMagnitudeToDraw){
            return;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = body.properties.color;
        this.ctx.arc(bodyPos.x, bodyPos.y, bodyRadius, 0, 7);
        this.ctx.fill();
    }

    drawStar(/** @type {Star} */ star){
        const bodyRadius = this.worldLengthToScreenLength(star.properties.radius);
        const bodyPos = this.worldPosToScreenPoint(star.worldPosition);
        const onScreen = this.isOnScreen(
            star.worldPosition,
            bodyRadius
        );
        
        star.drawChildrens();

        if (!onScreen){
            return;
        }

        {this.seenBodies.push(star);}
        
        const brightRadius = bodyRadius + this.worldLengthToScreenLength(
            star.properties.luminosity * star.properties.radius
            + ((Math.sin(Time.elapsedTime / 1000) + 1) / 2) * (star.properties.radius / 5) *
            Math.min(1, star.properties.luminosity * 100)
        );
        if (brightRadius > this.properties.bodies.minMagnitudeToDraw) {
            const transp = Math.min(
                this.properties.bodies.starBrightTransparency,
                Utils.lerp(
                    0, this.properties.bodies.starBrightTransparency,
                    bodyRadius * 5
                )
            );
            this.ctx.beginPath();
            const grd = this.ctx.createRadialGradient(
                bodyPos.x, bodyPos.y, bodyRadius, bodyPos.x, bodyPos.y, brightRadius
            );
            const color = Utils.hexToRgb(star.properties.color);
            grd.addColorStop(
                0, color.replace(
                    ")", `, ${transp})`
                )
            );
            grd.addColorStop(
                0.5, color.replace(
                    ")", `, ${transp / 2})`
                )
            )
            grd.addColorStop(
                1, color.replace(
                    ")", `, ${0})`
                )
            )
            this.ctx.fillStyle = grd;
            // this.ctx.arc(
            //     bodyPos.x, bodyPos.y,
            //     Math.min(brightRadius, window.innerWidth * 10), 0, 7
            // );
            this.ctx.fillRect(
                0, 0, window.innerWidth, window.innerHeight
            );
            this.ctx.fill();
        }
        
        this.ctx.beginPath();
        this.ctx.fillStyle = bodyRadius < this.properties.bodies.minMagnitudeToDraw ? 
            "white" : star.properties.color;
        this.ctx.arc(
            bodyPos.x, bodyPos.y,
            Math.max(
                Utils.lerp(
                    0, 0.75,
                    Utils.clamp(star.properties.luminosity / (this.size / 1e10), 0.075, 0.75)
                ),
                this.properties.bodies.minMagnitudeToDraw,
                bodyRadius
            ),
            0, 7
        );
        this.ctx.fill();

    }

    drawPlanet(planet){
        const bodyRadius = this.worldLengthToScreenLength(planet.properties.radius);
        const bodyPos = this.worldPosToScreenPoint(planet.worldPosition);
        const starPos = this.worldPosToScreenPoint(planet.parentBody.object.worldPosition);
        const onScreen = this.isOnScreen(
            planet.worldPosition,
            bodyRadius
        );

        {this.seenBodies.push(planet);}

        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgb(255, 255, 255, 0.25)`;
        this.ctx.lineWidth = 1;
        this.ctx.arc(
            starPos.x, starPos.y,
            this.worldLengthToScreenLength(planet.parentBody.distanceTo)
            , 0, 7
        );
        this.ctx.stroke();

        if (!onScreen){
            return;
        }

        if (bodyRadius < this.properties.bodies.minMagnitudeToDraw){
            return;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = planet.properties.color;
        this.ctx.arc(bodyPos.x, bodyPos.y, bodyRadius, 0, 7);
        this.ctx.fill();
    }

    /** @type {void} */
    drawChunk(/** @type {Chunk} */ chunk){
        
        chunk.drawBodies();


        if (this.properties.drawChunkBorder){
            const chunkCorner0 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.zero).scale(this.world.properties.chunkSize)
            );
            const chunkCorner1 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.right).scale(this.world.properties.chunkSize)
            );
            const chunkCorner2 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.one).scale(this.world.properties.chunkSize)
            );
            const chunkCorner3 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.up).scale(this.world.properties.chunkSize)
            );
            this.ctx.beginPath();
            this.ctx.moveTo(chunkCorner0.x, chunkCorner0.y);
            this.ctx.lineTo(chunkCorner1.x, chunkCorner1.y);
            this.ctx.lineTo(chunkCorner2.x, chunkCorner2.y);
            this.ctx.lineTo(chunkCorner3.x, chunkCorner3.y);
            this.ctx.lineTo(chunkCorner0.x, chunkCorner0.y);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "white";
            this.ctx.stroke();
        }
        if (this.properties.chunkDebugMode){
            const chunkCorner0 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.zero).scale(this.world.properties.chunkSize)
            );
            const chunkCorner1 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.right).scale(this.world.properties.chunkSize)
            );
            const chunkCorner2 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.one).scale(this.world.properties.chunkSize)
            );
            const chunkCorner3 = this.worldPosToScreenPoint(
                chunk.position.add(Vector2.up).scale(this.world.properties.chunkSize)
            );
            this.ctx.beginPath();
            this.ctx.moveTo(chunkCorner0.x, chunkCorner0.y);
            this.ctx.lineTo(chunkCorner1.x, chunkCorner1.y);
            this.ctx.lineTo(chunkCorner2.x, chunkCorner2.y);
            this.ctx.lineTo(chunkCorner3.x, chunkCorner3.y);
            this.ctx.lineTo(chunkCorner0.x, chunkCorner0.y);
            this.ctx.fillStyle = "#ff000022";
            this.ctx.fill();
        }
    }

    /** @type {void} */
    draw(){
        this.seenBodies = [];

        this.canvas.fitScreen();
        this.canvas.clear();
        this.drawBackground();

        for (let chunk of this.world.loadedChunks){
            this.drawChunk(chunk);
        }

        if (Controller.selectedBody){
            Controller.selectedBody.updateOrbit();
        }
    }
}
