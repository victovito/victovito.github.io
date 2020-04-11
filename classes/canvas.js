class Canvas
{
    constructor(canvasElement){
        /** @type {HTMLCanvasElement} */ 
        this.canvasElement = canvasElement;
        /** @type {CanvasRenderingContext2D} */ 
        this.ctx = this.canvasElement.getContext("2d");

        this.fitScreen();
    }

    fitScreen(){
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
        this.canvasElement.style.left = "0px";
        this.canvasElement.style.bottom = "0px";
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

}