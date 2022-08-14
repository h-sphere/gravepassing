import { Point, Rectangle } from "../Primitives";
import { Texture } from "./Texture";
import { perlin2, seed } from "../../utils/perlin";

const PERLIN_RANGE = Math.sqrt(2/4);

export class PerlinTexture implements Texture {
    constructor(private rect: Rectangle) {

    }

    private imageData: ImageData;

    generateData(x1: number, y1: number, x2: number, y2: number) {
        // compute step
        const xStep = x2 - x1;
        const yStep = y2 - y1;
        const pX = this.rect.width / xStep;
        const pY = this.rect.height / yStep;
        seed(12);
        for (let i=0;i<xStep;i++) {
            for(let j=0;j<yStep;j++) {
                const x = this.rect.p1.x + i * pX;
                const y = this.rect.p1.y + i * pY;
                let v = perlin2(x, y);
                // scale
                v = (v+PERLIN_RANGE) / 2 * PERLIN_RANGE;
                this.imageData[4*(i*xStep+j)] = 255;
                this.imageData[4*(i*xStep+j)+1] = 255; //v * 255;
                this.imageData[4*(i*xStep+j)+2] = 255; //v * 255;
                this.imageData[4*(i*xStep+j)+3] = 128;
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
        if (!this.imageData) {
            this.imageData = ctx.createImageData(x2-x1, y2-y1);
        }
        this.generateData(x1, y1, x2, y2);
        ctx.putImageData(this.imageData, x1, x2);
        return "red";
    }
    
}