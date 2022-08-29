import { NewTexture } from "./Texture";

export const SIZE = 16;
// FIXME: probably can be removed all together.
export class Image implements NewTexture {
    protected static canvas: HTMLCanvasElement;
    protected static _ctx: CanvasRenderingContext2D;
    protected static pointer: [number, number] = [0, 0];
    protected static maxH = 0;
    protected isGenerated: boolean = false;
    protected repeat = 'no-repeat';

    public flip: boolean = false;

    protected bmp?: ImageBitmap;

    protected pos: [number, number];

    static getSpriteSpot(w: number, h: number): [number, number] {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = SIZE * 6;
            this.canvas.height = SIZE * 20;
            this._ctx = this.canvas.getContext('2d')!;
            document.body.appendChild(this.canvas);
        }

        // "book" spot on sprite canvas
        // this._ctx.fillStyle = "red";
        // console.log(w, h);
        // this._ctx.fillRect(0, this.pointer + h, w, h);
        if (this.pointer[0] + w <= this.canvas.width) {
            this.pointer[0] += w;
            this.maxH = Math.max(this.maxH, this.pointer[1] + h);
            return [this.pointer[0] - w, this.pointer[1]];
        }
        this.pointer[1] = this.maxH;
        this.maxH = this.maxH + h;
        this.pointer[0] = w;
        return [this.pointer[0]-w, this.pointer[1]];
    }

    get ctx() {
        return Image._ctx;
    }

    constructor(protected w: number = SIZE, protected h: number = SIZE) {
        this.pos = Image.getSpriteSpot(w, h);

    }

    protected generate() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, SIZE, SIZE);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(SIZE / 4, SIZE / 4, SIZE / 2, SIZE / 2);
    }

    protected generateBmp() {
        createImageBitmap(this.ctx.getImageData(this.pos[0], this.pos[1], this.w, this.h))
        .then(b => {
            this.bmp = b;
        })
    }

    public gen() {
        if (!this.isGenerated) {
            // can be generated
            this.generate()
            this.generateBmp()
            this.isGenerated = true;
        }
    }


    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, w: number, h: number): string | CanvasGradient | CanvasPattern {
        // THIS IS STILL BEING USED AS OLD RENDER!
        this.gen();
        if (!this.bmp) {
            return 'transparent';
        }
        const pattern = this.ctx.createPattern(this.bmp, this.repeat)!;
        
        // Can be probably done with create image bitmap.
        const matrix = new DOMMatrix();
        let m = matrix
            .translate(x1, y1)
            .scale(w / this.w, h / this.h);
        if (this.flip) {
            m = m.translate(this.w / 2, this.h / 2)
            .scale(-1, 1)
            .translate(-this.w / 2, -this.h / 2);
        }
        pattern.setTransform(m);
        return pattern;
    }
}

export class PlayerTexture extends Image {
    constructor() {
        super(SIZE, SIZE);
    }
    protected generate(): void {
        const ctx = this.ctx;
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = 'black';
        ctx.fillRect(SIZE / 4, SIZE / 4, SIZE / 2, SIZE / 2);
        ctx.fillRect(SIZE / 4 + SIZE / 6, SIZE / 2, SIZE / 6, SIZE / 2);
    }
}

// export class VariationMap extends Image {
//     constructor()
//     protected generate(): void {
        
//     }
// }