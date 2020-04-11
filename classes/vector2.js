class Vector2
{
    constructor (x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
    
    static up = new Vector2(0, 1);
    static down = new Vector2(0, -1);
    static right = new Vector2(1, 0);
    static left = new Vector2(-1, 0);

    static zero = new Vector2();
    static half = new Vector2(0.5, 0.5);
    static one = new Vector2(1, 1);

    /** @type {Vector2} */
    static screenCenter(){
        return new Vector2(window.innerWidth, window.innerHeight).scale(0.5);
    }

    /**
     * 
     * @param {Vector2} a (starting vector)
     * @param {Vector2} n (ending vector)
     * @param {number} amount (amount)
     * 
     * @returns {Vector2}
     * */
    static lerp(a, b, amount){
        return new Vector2(
            Utils.lerp(a.x, b.x, amount),
            Utils.lerp(a.y, b.y, amount)
        );
    }

    /** @type {Vector2} */
    add(/** @type {Vector2} */ vector2){
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }

    /** @type {Vector2} */
    sub(/** @type {Vector2} */ vector2){
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }
    
    /** @type {Vector2} */
    scale(/** @type {number} */ f){
        return new Vector2(this.x * f, this.y * f);
    }

    /** @type {Vector2} */
    rotate(/** @type {number} */ angle, /** @type {Vector2} */ pivot = Vector2.zero){
        let point = this.sub(pivot);
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return pivot.add(
            new Vector2(
                point.x * c - point.y * s,
                point.y * c + point.x * s
            )
        );
    }

    /** @type {number} */
    magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2));
    }

    /** @type {Vector2} */
    normalized(){
        if (this.magnitude() == 0){
            return Vector2.zero
        }
        return this.scale(1 / this.magnitude());
    }

    /** @type {number} */
    distanceTo(vector2){
        return Math.sqrt(
            Math.pow(this.x - vector2.x, 2) + Math.pow(this.y - vector2.y,2)
        );
    }

    /** @type {Vector2} */
    invertY(){
        return new Vector2(this.x, window.innerHeight - this.y);
    }

    /** @type {Vector2} */
    floorValues(){
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    /** @type {Vector2} */
    ceilValues(){
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    /** @type {bool} */
    isEqual(/** @type {Vector2} */ vector){
        return this.x == vector.x && this.y == vector.y;
    }

    /** @type {string} */
    toString(){
        return `Vector2 [${this.x}, ${this.y}]`;
    }
    
    static getPBEquation(point1, point2){
        const mediumPoint = point1.add(point2).scale(0.5);
        const m = (point2.y - point1.y) / (point2.x - point1.x);
        const s = -(1 / m);
        const b = -(s * mediumPoint.x) + mediumPoint.y;
        return [s, -1, b];
    }
}