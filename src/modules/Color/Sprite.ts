import { Image as ImageTexture, SIZE } from "./Image";
import { Color } from "./Color";
import { NewTexture, Texture } from "./Texture";
import { withLight } from "../GameObjects/mixins";
import { Point, Rectangle } from "../Primitives";
import { Directional, E } from "../Assets/Emojis";
import { SceneSettings } from "../Scene/Scene";
import { Game } from "../Game";
import { TAG } from "../constants/tags";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Enemy } from "../GameObjects/Enemy";

// export interface EmojiSettings {
//     emoji: string,
//     size: number,
//     pos: number[]
// }

export class DirectionableTexture implements NewTexture {
    private direction ='left';

    constructor(public dir: Directional) {

    }

    getEmoji() {
        switch (this.direction) {
            case 'right': return this.dir.right;
            case 'down': return this.dir.down;
            case 'up': return this.dir.up;
            default: return this.dir.left;
        }
    }

    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        return this.getEmoji().newRender(ctx, x, y, w, h);
    }

    collisionBoundingBox(): Rectangle {
        return this.getEmoji().collisionBoundingBox();
    }

    setDirection(d: string, len: number) {
        this.direction = d;
        const e = this.getEmoji();
        if (e instanceof AnimatedEmoji) {
            if (len) {
                e.start();
            } else {
                e.stop();
            }
        }
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
    hueShift?: number;
}

export class CombinedEmoji implements NewTexture {
    constructor(private emojis: EmojiSet[], private scale: number = 1, private color = 'white') {
        // super(SIZE*scale, SIZE*scale);
        this.generate();
        // setTimeout(() => {
        //     // hack to make inherited classes have time to set constructor variables.
        //     this.generate();
        // });
    }
    canvas;
    bmp;
    _boundingBox: Rectangle;


    protected postProcessing() {
        
    }

    protected generate(...props: any[]): void {

        const c = document.createElement('canvas');
        c.width = this.scale * SIZE;
        c.height = this.scale * SIZE;
        const ct = c.getContext('2d')!;
        let p1, p2;
        const ZOOM_FACTOR = 1/16; // FIXME: is that alright?
        const div = document.createElement('div');

        this.emojis.forEach(e => {
            div.style.fontSize=e.size + 'px';
            div.innerText = e.emoji;


            ct.font = `${e.size}px Arial`
            ct.fillStyle = this.color;
            ct.textBaseline = "top";
            // ct.fillRect(0, 0, c.width, c.height);
            // const t = this.ctx.measureText(e.emoji);
            // ct.fillRect(0, 0, c.width, c.height);
            ct.filter = 'hue-rotate('+(e.hueShift||0) + 'deg)';
            const x = ct.measureText(e.emoji)
            if (!p1 || !p2) {
                p1 = new Point(e.pos[0], e.pos[1]);
                p2 = new Point(e.pos[0] + x.width, e.pos[1] + x.actualBoundingBoxDescent).mul(1/16);
            } else {
                p1 = new Point(Math.min(e.pos[0], p1.x), Math.min(e.pos[1], p1.y));
                p2 = new Point(Math.max(e.pos[0] + x.width, p2.x), Math.max(e.pos[1] + x.actualBoundingBoxAscent, p2.y)).mul(1/16);
            }

            ct.fillText(e.emoji, e.pos[0], e.pos[1]);
            ct.filter = '';
        });
        this._boundingBox = new Rectangle(p1, p2);
        this.canvas = c;
        this.postProcessing();

        // OMFG, why does this help?
        createImageBitmap(ct.getImageData(0, 0, c.width, c.height))
        .then(b => this.bmp = b);
    }

    collisionBoundingBox(): Rectangle {
        return this._boundingBox;
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

export class AnimatedEmoji extends CombinedEmoji {
    constructor(emojis, scale, color, private steps: number = 3, private stepFn: (step: number, steps: number, canvas: HTMLCanvasElement) => void) {
        super(emojis, scale, color);
        setTimeout(() => {
            // hack to make inherited classes have time to set constructor variables.
            this.generate(steps);
        });
    }

    private canvases: HTMLCanvasElement[] = [];

    protected generate(steps: number): void {
        if (!this.steps) {
            return;
        }
        super.generate();
        for(let i=0;i<steps;i++) {
            // copy context here.
            const canvas = document.createElement('canvas');
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
            this.stepFn(i, steps, canvas);
            this.canvases.push(canvas);

            // OMFG, why does this help?
            createImageBitmap(ctx.getImageData(0, 0, canvas.width, canvas.height))
            .then(b => this.bmp = b);
            
            // FIXME: Optimisation here.
        }
    }
    private isStarted = false;
    private h: any = null;
    start() {
        if (this.isStarted) {
            return;
        }
        this.isStarted = true;
        this.h = setInterval(() => {
            this.setFrame(this._n + 1);
        }, 25);
    }

    stop() {
        if (this.h) {
            clearInterval(this.h);
            this.isStarted = false;
            this._n = 0;
        }
    }

    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        const c = this.canvases[this._n];
        try {
            ctx.drawImage(c, 0, 0, c.width, c.height, x, y, w, h);
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    private _n: number = 0;
    setFrame(n: number) {
        this._n = n % this.steps;
    }
}

export class Emoji extends CombinedEmoji {
    constructor(e: string, size: number, scale: number, x = 0, y = 0, color: string = 'white', hueShift: number = 0) {
        super([{emoji: e, size: size, pos: [x, y], hueShift}], scale, color);
        this.generate();
    }
}

// export class EmojiWithLight extends withLight(Emoji) { }



const D_STEP = 11;

const c = (n, steps) => Math.round(n * (steps - 1))
export class Dither extends ImageTexture {
    
    // private static d;

    // static getDither(n: number): Dither {
    //     return this.d[c(n)];
    // }

    static generateDithers(steps: number = D_STEP, color: number[] = [44, 100, 94]) {
        const dithers: Dither[] = [];
        for(let i=0;i<=steps;i++) {
            const d = new Dither(i / steps, steps, color);
            dithers.push(d);
        }
        return (n: number) => dithers[c(n, steps)];
    }

    private constructor(private l: number, private s: number, private c: number[]) {
        super();
        this.generate();
    }
    protected generate(): void {
        this.ctx.clearRect(this.pos[0], this.pos[1], SIZE, SIZE);
        this.ctx.fillStyle = 'rgb('+this.c.join(',') + ', ' + (1-this.l/1.2-0.2) + ')';
        // if (this.l > 0.95) {
        //     return;
        // }
        for(let i=0;i<SIZE;i++) {
            for(let j=0;j<SIZE;j++) {
                if ((c(Math.abs(i*i + j*j), this.s) % (this.s)) >= c(this.l, this.s)) {
                    this.ctx.fillRect(this.pos[0] + i, this.pos[1] + j, 1, 1);
                }
            }
        }
    }
}
// Dither.generateDithers();

// export class Sprite extends ImageTexture {
//     static img: HTMLImageElement;
//     static loaded: boolean = false;


//     static getImage(): HTMLImageElement {
//         if (this.img) {
//             return this.img;
//         }
//         this.img = new Image();
//         this.img.src = image;
//         this.img.onload = () => this.loaded = true;
//         return this.img;
//     }

//     constructor(protected x: number, protected y: number) {
//         super();
//         Sprite.getImage();
//     }

//     protected generate(): void {
//         this.ctx.drawImage(Sprite.getImage(), this.x * SIZE, this.y * SIZE, SIZE, SIZE, this.pos[0], this.pos[1], SIZE, SIZE);
//     }

//     render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
//         if(!Sprite.loaded) {
//             return 'red';
//         }
//         return super.render(ctx, x1, y1, x2, y2);
//     }

// }

// export class SpriteWithLight extends withLight(Sprite) {
// }


const FN = (x, y, S) => (Math.sin(432.432*S + x * y - 3*y+Math.cos(x-y))+1)/2;

export interface EmojiList {
    emoji: Emoji,
    range: [number, number],
    asGameObject?: boolean,
}

export class Ground {
    private color = new Color(173,39,0.47);
    private grass = new Emoji("🌱", 4, 1);
    private grave = new Emoji("🪦", 12, 1);
    private cross = new Emoji("✝", 16, 1);
    private directions = new Emoji("🪨", 10, 1);
    constructor(private emojis: EmojiList[] = [], private seed: number) {
    }
    render(ctx: CanvasRenderingContext2D, bb: Rectangle, s: SceneSettings, game: Game): void {
        // Check if there are already generated obstacles in the area.
        const areGenerated = !!game.gameObjects.getObjectsInArea(bb, TAG.GENERATED).length;

        let generatedAnything = false;
        const m = SIZE * game.MULTIPLIER;
        bb.forEachCell((x, y, oX, oY) => {
            const p = FN(x,y, this.seed || 231);
            ctx.fillStyle = s.backgroundColor || 'hsla(173,39%,47%)';
            ctx.strokeStyle = "red";
            ctx.fillRect(oX*m, oY*m, m, m);

            this.emojis.forEach(e => {
                if (p > e.range[0] && p < e.range[1]) {
                    if (!e.asGameObject) {
                        e.emoji.newRender(ctx, oX *m, oY *m, m, m);
                    } else {
                        if (!areGenerated) {
                            console.log("TAG GEN")
                            const obj = new RectangleObject(new Point(x, y), e.emoji, [TAG.GENERATED, TAG.OBSTACLE]);
                            game.gameObjects.add(obj);           
                            generatedAnything = true;                 
                        }
                    }
                }
            });
        });

        // GENERATE GAME OBJECTS IF NEEDED.
        if (generatedAnything) { // making sure we don't generate infinitly enemies on empty patches.
            const g = FN(bb.p1.x+0.424, bb.p1.y+0.2, this.seed+4324);
            console.log("G", g);
            const generatingNr = Math.round(g * 5);
            console.log("GENERATING", generatingNr);
            for(let i=0;i<generatingNr;i++) {
                const p = bb.p1.add(Math.random()*bb.width, Math.random()*bb.height);
                game.gameObjects.add(new Enemy(
                    Math.random() < 0.2 ? E.robot : (Math.random() > 0.5) ? E.cowMan : E.frogMan,
                100, p));
            }
        }
    }
}