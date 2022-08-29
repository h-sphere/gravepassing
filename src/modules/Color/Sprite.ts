import { Image as ImageTexture, SIZE } from "./Image";
import { Color } from "./Color";
import { NewTexture } from "./Texture";
import { Point, Rectangle } from "../Primitives";
import { Directional, E } from "../Assets/Emojis";
import { SceneSettings } from "../Scene/Scene";
import { Game } from "../Game";
import { TAG } from "../constants/tags";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Enemy } from "../GameObjects/Enemy";

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

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        return this.getEmoji().render(ctx, x, y, w, h);
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

}

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

    toGameObject(p: Point): RectangleObject {
        return new RectangleObject(p, this);
    }


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

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

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

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
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



const D_STEP = 11;

const c = (n, steps) => Math.round(n * (steps - 1))
export class Dither implements NewTexture {

    static generateDithers(steps: number = D_STEP, color: number[] = [44, 100, 94]) {
        const dithers: Dither[] = [];
        for(let i=0;i<=steps;i++) {
            const d = new Dither(i / steps, steps, color);
            dithers.push(d);
        }
        return (n: number) => dithers[c(n, steps)];
    }

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    private constructor(private l: number, private s: number, private c: number[]) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = SIZE;
        this.canvas.height = SIZE;
        this.ctx = this.canvas.getContext('2d')!;
        this.generate();
        // document.body.appendChild(this.canvas);
    }
    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        // ctx.fillStyle = "red"; 
        // ctx.fillRect(x,y,w,h);
        try {
            ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w, h);
        } catch (e) {
            console.log("ERROR", e);
        }
    }
    protected generateBmp() {
        createImageBitmap(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
    }
    protected generate(): void {
        console.log("GENERATE", this.l);
        this.ctx.clearRect(0, 0, SIZE, SIZE);
        this.ctx.fillStyle = 'rgb('+this.c.join(',') + ', ' + (1-this.l/1.2-0.2) + ')';
        console.log(this.ctx.fillStyle);
        this.ctx.fillRect(0,0, 2, 2);
        this.generateBmp();
        if (this.l > 0.95) {
            return;
        }
        for(let i=0;i<SIZE;i++) { 
            for(let j=0;j<SIZE;j++) {
                if ((c(Math.abs(i*i + j*j), this.s) % (this.s)) >= c(this.l, this.s)) {
                    this.ctx.fillRect(i, j, 1, 1);
                }
            }
        }
    }
}

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
            ctx.fillRect(oX*m, oY*m, m, m);

            this.emojis.forEach(e => {
                if (p > e.range[0] && p < e.range[1]) {
                    if (!e.asGameObject) {
                        e.emoji.render(ctx, oX *m, oY *m, m, m);
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