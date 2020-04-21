class Time
{

    static startTime = Date.now();
    static deltaTime = 0;
    static elapsedTime = 0;
    static lastFrame = this.startTime;

    static timeScale = 1;

    static framesPerSecond = 0;
    static frames = 0;

    static update(){
        this.frames++;

        const now = Date.now();
        this.deltaTime = (now - this.lastFrame) / 1000;
        this.lastFrame = now;

        this.framesPerSecond = 1 / this.deltaTime;

        this.elapsedTime += this.deltaTime * 1000 * this.timeScale; 
    }

}