class Hud
{
    constructor(/** @type {Canvas} */ canvas){

        /** @type {Canvas} */ 
        this.canvas = canvas;
        this.canvas.canvasElement.style.pointerEvents = "none";
        
        /** @type {Camera} */ 
        this.camera;

        /** @type {CanvasRenderingContext2D} */ 
        this.ctx = this.canvas.ctx;

        this.properties = {
            drawSystemLabelDist: 750000000000,
            font: "sans-serif",
            screenMargin: 20,
        }

        /** @type {Body[]} */
        this.labelsToDraw = [];

        this.scaleMarker = {
            maxLenght: 250,
            currentScale: null,
            currentMeasure: null,
            currentValue: null,
            staticValues: [1, 10, 100, 1000],
            measures: {
                0: {
                    measure: Measure.length.units.M,
                    multiplier: 1,
                    prefix: ""
                },
                1: {
                    measure: Measure.length.units.KM,
                    multiplier: 1,
                    prefix: ""
                },
                2: {
                    measure: Measure.length.units.KM,
                    multiplier: 1000,
                    prefix: "K"
                },
                3: {
                    measure: Measure.length.units.KM,
                    multiplier: 1000000,
                    prefix: "M"
                },
                4: {
                    measure: Measure.length.units.AU,
                    multiplier: 1,
                    prefix: ""
                },
                5: {
                    measure: Measure.length.units.AU,
                    multiplier: 1000,
                    prefix: "K"
                },
                6: {
                    measure: Measure.length.units.LY,
                    multiplier: 1,
                    prefix: ""
                }
            }
        }

    }

    enqueueLabel(/** @type {Body} */ body){
        this.labelsToDraw.push(body);
    }

    drawLabel(/** @type {Body} */ body){

        if (!body){
            return;
        }

        const screenPoint = this.camera.worldPosToScreenPoint(body.worldPosition);
        const screenLenght = this.camera.worldLengthToScreenLength(body.properties.radius);

        const circleFadeMagStart = 2;
        const circleFadeMagEnd = 20;

        this.ctx.beginPath();
        this.ctx.strokeStyle = screenLenght > circleFadeMagStart ? `rgb(255,255,255,${
            Utils.lerp(0, 1, Utils.clamp(
                1 - (screenLenght - circleFadeMagStart) /
                (circleFadeMagEnd - circleFadeMagStart), 0, 1
            ))
        })` : "white";
        this.ctx.lineWidth = 1;
        this.ctx.arc(screenPoint.x, screenPoint.y, screenLenght + 5, 0, 7);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = `10px ${this.properties.font}`;
        this.ctx.fillText(body.name, screenPoint.x, screenPoint.y + screenLenght + 15);
        this.ctx.fillStyle = "gray";
        this.ctx.font = `8px ${this.properties.font}`;
        this.ctx.fillText(body.type.name, screenPoint.x, screenPoint.y + screenLenght + 25);
    }

    drawInfo(/** @type {Body} */ body){

        if (!body){
            return;
        }

        const screenPos = new Vector2(
            this.properties.screenMargin,
            this.properties.screenMargin
        );

        const infoToDraw = [
            ``,
            `Spectral type: ${body.properties.spectralType?.name}`,
            `Suface temperature: ${
                Math.round(body.properties.temperature).toLocaleString()
            } ${Measure.temperature.units.K.symbol}`,
            `Luminosity: ${
                (body.properties.luminosity).toLocaleString(
                    "en-US", { 
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 8,
                    }
                )
            } ${Measure.luminosity.units.SL.symbol}`,
            `Radius: ${
                (body.properties.radius).toLocaleString(
                    "en-US", { 
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }
                )
            } ${Measure.length.units.KM.symbol} (${
                Math.round((body.properties.radius / Measure.length.Sr) * 10e2) / 10e2
            } ${Measure.length.units.SR.symbol})`,
            `Mass: ${Math.round(body.properties.mass)} ${Measure.mass.units.KG.symbol} (${
                body.properties.mass / Measure.mass.Sm
            } ${Measure.mass.units.SM.symbol})`,
            ``,
            `Aparent size: ${this.camera.worldLengthToScreenLength(body.properties.radius)}`,
            `Distance to screen center: ${
                Math.max(
                    body.worldPosition.distanceTo(this.camera.position) - body.properties.radius,
                    0
                ).toLocaleString(
                    "en-US", { 
                        minimumIntegerDigits: 1,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }
                )
            } ${Measure.length.units.KM.symbol}`
        ];

        const lineHeight = 12;

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        
        this.ctx.fillStyle = "white";
        this.ctx.font = `12px ${this.properties.font}`;
        this.ctx.fillText(`${body.name}`, screenPos.x, screenPos.y);
        this.ctx.fillStyle = "gray";
        this.ctx.fillText(`${body.type.name}`, screenPos.x, screenPos.y + lineHeight);
        
        this.ctx.font = `10px ${this.properties.font}`;
        for (let i = 0; i < infoToDraw.length; i++){
            this.ctx.fillText(infoToDraw[i], screenPos.x, screenPos.y + lineHeight * (i + 2));
        }

    }

    updateScaleMarker(){
        this.scaleMarker.currentScale = this.camera.screenLengthToWorldLength(
            this.scaleMarker.maxLenght
        );

        this.scaleMarker.currentMeasure = null;
        const measuresLength = Object.keys(this.scaleMarker.measures).length;
        for (let i = 0; i < measuresLength; i++){
            const measure = this.scaleMarker.measures[i];
            // console.log(
            //     measure.measure.value * measure.multiplier
            // );
            if (this.scaleMarker.currentScale < measure.measure.value * measure.multiplier){
                this.scaleMarker.currentMeasure = this.scaleMarker.measures[
                    Math.max(0, i - 1)
                ];
                break;
            }
        }
        if (!this.scaleMarker.currentMeasure){
            this.scaleMarker.currentMeasure = this.scaleMarker.measures[measuresLength - 1];
        }

        this.scaleMarker.currentValue = null;
        for (let i = 0; i < this.scaleMarker.staticValues.length; i++){
            if (
                this.scaleMarker.currentScale / (this.scaleMarker.currentMeasure.measure.value *
                this.scaleMarker.currentMeasure.multiplier) < this.scaleMarker.staticValues[i]
            ){
                this.scaleMarker.currentValue = this.scaleMarker.staticValues[
                    Math.max(0, i - 1)
                ];
                break;
            }
        }
        if (!this.scaleMarker.currentValue){
            this.scaleMarker.currentValue = this.scaleMarker.staticValues[
                this.scaleMarker.staticValues.length - 1
            ];
        }
    }

    drawScaleMarker(){
        this.updateScaleMarker();

        const lineWidth = 5;
        
        const screenPos = new Vector2(
            window.innerWidth - this.properties.screenMargin,
            window.innerHeight - this.properties.screenMargin
        );
        
        const size = this.camera.worldLengthToScreenLength(
            this.scaleMarker.currentValue * this.scaleMarker.currentMeasure.measure.value *
            this.scaleMarker.currentMeasure.multiplier
        );
        
        this.ctx.beginPath();
            
        this.ctx.moveTo(screenPos.x, screenPos.y - 20);
        this.ctx.lineTo(screenPos.x - size, screenPos.y - 20);

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.font = `14px ${this.properties.font}`;
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(
            `${
                this.scaleMarker.currentValue
            }${
                this.scaleMarker.currentMeasure.prefix
            } ${
                this.scaleMarker.currentValue == 1 &&
                this.scaleMarker.currentMeasure.multiplier == 1 ?
                this.scaleMarker.currentMeasure.measure.uname :
                this.scaleMarker.currentMeasure.measure.name
            }`, screenPos.x, screenPos.y - 10 - lineWidth - 20
        );

        this.ctx.beginPath();

        this.ctx.moveTo(screenPos.x, screenPos.y - 10 - lineWidth);
        this.ctx.lineTo(screenPos.x - this.scaleMarker.maxLenght, screenPos.y - 10 - lineWidth);

        this.ctx.strokeStyle = "gray";
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();

        this.ctx.fillStyle = "gray";
        this.ctx.font = "14px sans-serif";
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(
            `${
                Math.round(
                    this.scaleMarker.currentScale / (this.scaleMarker.currentMeasure.measure.value *
                    this.scaleMarker.currentMeasure.multiplier) * 100
                ) / 100
            }${
                this.scaleMarker.currentMeasure.prefix
            } ${
                this.scaleMarker.currentMeasure.measure.symbol
            }`, screenPos.x, screenPos.y
        );
        
        if (InputListener.mouse3){
            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgb(255,255,255,0.1)";
            this.ctx.lineWidth = 2;
            this.ctx.arc(window.innerWidth / 2, window.innerHeight / 2,
                size / 2,
                0, 7
            );
            this.ctx.stroke();
        }

    }

    draw(){
        this.canvas.fitScreen();
        this.canvas.clear();
        
        this.drawScaleMarker();
        this.drawLabel(Controller.selectedBody);
        this.drawInfo(Controller.selectedBody);
        
        this.labelsToDraw = [];
    }
}