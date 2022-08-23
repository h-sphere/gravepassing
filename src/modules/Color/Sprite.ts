import { Image as ImageTexture, SIZE } from "./Image";
import image from "../../sprite.png";
import { Color } from "./Color";
import { NewTexture, Texture } from "./Texture";
import { withLight } from "../GameObjects/mixins";
import { Rectangle } from "../Primitives";
import { Directional } from "../Assets/Emojis";

// export interface EmojiSettings {
//     emoji: string,
//     size: number,
//     pos: number[]
// }

export class DirectionableTexture implements NewTexture {
    private direction ='left';

    constructor(public dir: Directional) {

    }
    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        switch (this.direction) {
            case 'right': return this.dir.right.newRender(ctx, x, y, w, h);
            case 'down': return this.dir.down.newRender(ctx, x, y, w, h);
            case 'up': return this.dir.up.newRender(ctx, x, y, w, h);
            default: return this.dir.left.newRender(ctx, x, y, w, h);
        }
    }

    setDirection(d: string) {
        this.direction = d;
    }

    // render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
    //     switch (this.direction) {
    //         case 'left': return this.left.render(ctx, x1, y1, x2, y2);
    //         case 'down': return this.down.render(ctx, x1, y1, x2, y2);
    //         case 'up': return this.up.render(ctx, x1, y1, x2, y2);
    //         default: return this.left.render(ctx, x1, y1, x2, y2);
    //     }
    // }

}

// export class CombinedEmoji extends ImageTexture {
//     constructor (private settings: EmojiSettings[], scale = 1) {
//         super(SIZE * scale, SIZE * scale);
//         this.generate();
//     }

//     protected generate() {
//         this.ctx.textBaseline = "top";
//         this.ctx.fillStyle = "white";
//         this.settings.forEach((e) => {
//             const size = e.size || 10;
//             this.ctx.font = `${size}px Arial`;
//             this.ctx.fillText(e.emoji, this.pos[0] + e.pos[0], this.pos[1] + e.pos[1])
//         })
//     }
// }

export interface EmojiSet {
    emoji: string;
    size: number;
    pos: number[];
}

export class CombinedEmoji implements NewTexture {
    constructor(private emojis: EmojiSet[], private scale: number = 1, private color = 'white') {
        // super(SIZE*scale, SIZE*scale);
        this.generate();
    }
    canvas;
    bmp;
    protected generate(): void {

        const c = document.createElement('canvas');
        c.width = this.scale * SIZE;
        c.height = this.scale * SIZE;
        const ct = c.getContext('2d')!;

        this.emojis.forEach(e => {
            console.log(e);

            ct.font = `${e.size}px Arial`
            ct.fillStyle = this.color;
            ct.textBaseline = "top";
            // ct.fillRect(0, 0, c.width, c.height);
            // const t = this.ctx.measureText(e.emoji);
            // ct.fillRect(0, 0, c.width, c.height);
            ct.fillText(e.emoji, e.pos[0], e.pos[1]);
        });
        this.canvas = c;

        // OMFG, why does this help?
        createImageBitmap(ct.getImageData(0, 0, c.width, c.height))
        .then(b => this.bmp = b);
    }

    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

        try {
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w, h);
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    // render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
    //     return 'red';
    //     // this.generate();

    //     // // console.log(this.imageData)
    //     // // ctx.putImageData(this.imageData, x1, x2);
    //     // ctx.drawImage(this.canvas, 
    //     // return 'red';

    //     // const pattern = this.ctx.createPattern(this.bmp, this.repeat)!;
        
    //     // // Can be probably done with create image bitmap.
    //     // const matrix = new DOMMatrix();
    //     // const width = (x2 - x1) / this.w;
    //     // const height = (y2 - y1) / this.h;
    //     // let m = matrix
    //     //     .translate(x1, y1)
    //     //     .scale(width, height);
    //     // if (this.flip) {
    //     //     m = m.translate(this.w / 2, this.h / 2)
    //     //     .scale(-1, 1)
    //     //     .translate(-this.w / 2, -this.h / 2);
    //     // }
    //     // pattern.setTransform(m);
    //     // return pattern;
    // }
}

export class Emoji extends CombinedEmoji {
    constructor(e: string, size: number, scale: number, x = 0, y = 0) {
        super([{emoji: e, size: size, pos: [x, y]}], scale, 'white');
    }
}

// export class EmojiWithLight extends withLight(Emoji) { }



const D_STEP = 11;

const c = (n) => Math.round(n * (D_STEP - 1))
export class Dither extends ImageTexture {
    
    private static d;

    static getDither(n: number): Dither {
        return this.d[c(n)];
    }

    static generateDithers() {
        if (this.d) {
            return;
        }
        this.d = {};
        for(let i=0;i<=D_STEP;i++) {
            const d = new Dither();
            d.setLight(i / D_STEP);
            this.d[i] = d;
        }
    }

    private l: number = 0.55;
    private constructor() {
        super();
        // setInterval(() => {
        //     this.l = this.l + 0.02;
        //     if (this.l > 1) {
        //         this.l = 0;
        //     }
        //     this.generate();
        // }, 100);
    }
    setLight(l: number) {
        this.l = l;
        this.generate();
    }
    protected generate(): void {
        this.ctx.clearRect(this.pos[0], this.pos[1], SIZE, SIZE);
        this.ctx.fillStyle = 'rgb(44, 100, 94, ' + (1-this.l/1.2-0.2) + ')';
        // if (this.l > 0.95) {
        //     return;
        // }
        for(let i=0;i<SIZE;i++) {
            for(let j=0;j<SIZE;j++) {
                const p = j + i * SIZE;
                if ((c(Math.abs(i*i + j*j)) % (D_STEP)) >= c(this.l)) {
                    this.ctx.fillRect(this.pos[0] + i, this.pos[1] + j, 1, 1);
                }
            }
        }
    }
}
Dither.generateDithers();

export class Sprite extends ImageTexture {
    static img: HTMLImageElement;
    static loaded: boolean = false;


    static getImage(): HTMLImageElement {
        if (this.img) {
            return this.img;
        }
        this.img = new Image();
        this.img.src = image;
        this.img.onload = () => this.loaded = true;
        return this.img;
    }

    constructor(protected x: number, protected y: number) {
        super();
        Sprite.getImage();
    }

    protected generate(): void {
        this.ctx.drawImage(Sprite.getImage(), this.x * SIZE, this.y * SIZE, SIZE, SIZE, this.pos[0], this.pos[1], SIZE, SIZE);
    }

    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
        if(!Sprite.loaded) {
            return 'red';
        }
        return super.render(ctx, x1, y1, x2, y2);
    }

}

export class SpriteWithLight extends withLight(Sprite) {
}

// seed(23);

const FN = (x, y, S) => (Math.sin(432.432*S + x * y - 3*y+Math.cos(x-y))+1)/2;

export class Ground {
    private color = new Color(173,39,0.47);
    private grass = new Emoji("🌱", 4, 1);
    private grave = new Emoji("🪦", 12, 1);
    private cross = new Emoji("✝", 16, 1);
    private directions = new Emoji("🪨", 10, 1);
    constructor() {
        // this.grass.gen();
    }
    render(ctx: CanvasRenderingContext2D, bb: Rectangle): void {
        const m = SIZE * 5; // FIXME: PROPER DATA HERE
        bb.forEachCell((x, y, oX, oY) => {
            // console.log(oX, oY);
            const p = FN(x,y, 231);
            ctx.fillStyle = 'hsla(173,39%,47%)';
            // if (x*x+y*y - 9 < 1) {
            //     ctx.fillStyle = "red";
            // }
            ctx.strokeStyle = "red";
            // FIXME: real proportions here
            ctx.fillRect(oX*m, oY*m, m, m);
            if (p > 0.30 && p < 0.31) {
                this.grass.newRender(ctx, oX*m, oY*m, m, m);
            }
            if (p > 0.5 && p < 0.65) {
                this.grass.newRender(ctx, oX*m+4, oY*m+9, m, m);
            }

            if (p > 0.999) {
                this.grave.newRender(ctx, oX*m, oY*m, m, m);
            }

            if (p > 0.645 && p < 0.6823) {
                this.cross.newRender(ctx, oX*m, oY*m, m, m);
            }

            if(p > 0.3 && p < 0.31) {
                this.directions.newRender(ctx, oX*m, oY*m, m, m);
            }
            // if (p < 0.2) {
            //     const bmp = this.grass.getBitmap();
            //     if (!bmp) {
            //         return;
            //     }
            //     ctx.drawImage(bmp, oX*m, oY*m);
            // }
            // ctx.strokeRect(oX*m, oY*m, m, m);
        });
    }

    // protected generate(): void {
    //     super.generate()
    //     // this.setLight(0.4, 0.4);
    // }
    // protected repeat: string = 'repeat';
}