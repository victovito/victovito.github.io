class Utils
{
    /**
     * A linear interpolator for hex colors.
     *
     * Based on:
     * https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
     *
     * @param {string} a  (hex color start val)
     * @param {string} b  (hex color end val)
     * @param {Number} amount  (the amount to fade from a to b)
     *
     * @example
     * lerpColor("#000000", "#ffffff", 0.5);
     * // returns "#7f7f7f"
     *
     * @returns {Number}
     */
    static lerpColor(a, b, amount) {

        a = parseInt(a.replace("#", "0x"), 16);
        b = parseInt(b.replace("#", "0x"), 16);

        const ar = a >> 16,
            ag = a >> 8 & 0xff,
            ab = a & 0xff,

            br = b >> 16,
            bg = b >> 8 & 0xff,
            bb = b & 0xff,

            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return "#" + ((rr << 16) + (rg << 8) + (rb | 0)).toString(16);
    };

    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(` +
          `${parseInt(result[1], 16)},` +
          `${parseInt(result[2], 16)},` +
          `${parseInt(result[3], 16)})` : null;
    }

    static rgbToHex(r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    static clamp(value, min, max){
        return Math.min(
            max,
            Math.max(
                value, min
            )
        );
    }

    /**
     * 
     * @param {number} start 
     * @param {number} end 
     * @param {number} amount 
     * 
     * @example
     * lerp(10, 30, 0.5);
     * //returns 20
     * 
     * @returns {number}
     */
    static lerp(start, end, amount) {
        return (1-amount)*start+amount*end;
    }

    /**
     * @param {string} str  (string)
     *
     * @example
     * stringHash("Hello World!");
     * // returns -969099747
     *
     * @returns {Number}
     */
    static stringHash(str){
        let h;
        for(let i = 0; i < str.length; i++){
            h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        }
        return h;
    }
}