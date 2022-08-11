import { Point } from "../modules/Primitives";
const interpolate = (a0, a1, w) =>{
    /* // You may want clamping by inserting:
     * if (0.0 > w) return a0;
     * if (1.0 < w) return a1;
     */
    return (a1 - a0) * w + a0;
}
export class Perlin {
    constructor() {

    }

    randomGradient(ix: number, iy: number) {
        const w = 8 * 4;
        const s = w / 2;
        let a = ix;
        let b = iy;
        a *= 3284157443; b ^= a << s | a >> w-s;
        b *= 1911520717; a ^= b << s | b >> w-s;
        a *= 2048419325;
        const random = a;
        return new Point(Math.cos(random), Math.sin(random));
    }

    dotGridGradient(ix, iy, x, y) {
        const gradient = this.randomGradient(ix, iy);
        const dx = x - ix;
        const dy = y - iy;
        return dx * gradient.x + dy * gradient.y;
    }

    get(x: number, y: number) {
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;
        const sx = x - x0;
        const sy = y - y0;

        let n0 = this.dotGridGradient(x0, y0, x, y);
        let n1 = this.dotGridGradient(x1, y0, x, y);
        let ix0 = interpolate(n0, n1, sx);

        n0 = this.dotGridGradient(n0, y1, x, y);
        n1 = this.dotGridGradient(x1, y1, x, y);
        let ix1 = interpolate(n0, n1, sx);
        return interpolate(ix0, ix1, sy);
    }
}