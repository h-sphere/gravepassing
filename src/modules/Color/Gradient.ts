import { Color } from "./Color";
import { Texture } from "./Texture";

export class ColorGradient implements Texture {
    private stops: [number, Color][] = [];
    constructor() {

    }

    addStop(n: number, color: Color) {
        this.stops.push([n, color]);
    }

    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
        const grd = ctx.createLinearGradient(x1, y1, x2, y2);
        this.stops.forEach(([n, color]) => {
            grd.addColorStop(n, color.toString());
        });
        return grd;
    }

    renderCircular(ctx: CanvasRenderingContext2D, x1: number, y1: number, r: number) {
        const grd = ctx.createRadialGradient(x1, y1, 0, x1, y1, r);
        this.stops.forEach(([n, color]) => {
            grd.addColorStop(n, color.toString());
        });
        return grd;
    }

    static fromColorToTransparent(color: Color): ColorGradient {
        const grd =  new this();
        grd.addStop(0, color);
        grd.addStop(1, color.withAlpha(0));
        return grd;
    }
}