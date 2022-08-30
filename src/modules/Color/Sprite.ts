import { NewTexture } from "./Texture";
import { Point, Rectangle } from "../Primitives";
import { Directional, E } from "../Assets/Emojis";
import { SceneSettings } from "../Scene/Scene";
import { Game } from "../Game";
import { TAG } from "../constants/tags";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Enemy } from "../GameObjects/Enemy";
import { SIZE } from "./Image";

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
        this.generate()
    }
    canvas!: HTMLCanvasElement;
    bmp!: ImageBitmap;
    _boundingBox!: Rectangle;

    doNotRenderOnGlobalCanvas = false;

    toGameObject(p: Point, scale: number = 1): RectangleObject {
        return new RectangleObject(p, this, [], scale);
    }

    static lastX = 0;

    static getGlobalCanvasPos(width: number) {
        const x = this.lastX;
        this.lastX += width;
        return x;
    }

    private globalCanvasPosition = -1;
    renderOnGlobalCanvas() {
        if (this.doNotRenderOnGlobalCanvas) {
            return;
        }
        if (this.globalCanvasPosition < 0) { 
            this.globalCanvasPosition = CombinedEmoji.getGlobalCanvasPos(SIZE*this.scale);
        }
        console.log("RENDERING ON", this.globalCanvasPosition);
        const globalCanvas = document.querySelector<HTMLCanvasElement>('#emojiMap');
        const ctx = globalCanvas!.getContext('2d')!;
        ctx.drawImage(this.canvas, this.globalCanvasPosition, 0);
        
    }


    protected postProcessing() {
        
    }
    isGenerated = false;

    protected generate(...props: any[]): void {
        this.isGenerated = true;
        const c = document.createElement('canvas');
        c.width = this.scale * SIZE;
        c.height = this.scale * SIZE;
        const ct = c.getContext('2d')!;
        let p1: Point, p2: Point;
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
                p2 = new Point(e.pos[0] + x.width, e.pos[1] + x.actualBoundingBoxDescent).mul(1/SIZE);
            } else {
                p1 = new Point(Math.min(e.pos[0], p1.x), Math.min(e.pos[1], p1.y));
                p2 = new Point(Math.max(e.pos[0] + x.width, p2.x), Math.max(e.pos[1] + x.actualBoundingBoxAscent, p2.y)).mul(1/16);
            }

            ct.fillText(e.emoji, e.pos[0], e.pos[1]);
            ct.filter = '';
        });
        this._boundingBox = new Rectangle(p1!, p2!);
        this.canvas = c;
        this.postProcessing();

        // OMFG, why does this help?
        createImageBitmap(ct.getImageData(0, 0, c.width, c.height))
        .then(b => this.bmp = b);
        this.renderOnGlobalCanvas();
    }

    collisionBoundingBox(): Rectangle {
        return this._boundingBox;
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        !this.isGenerated && this.generate();
        try {
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w, h);
        } catch (e) {
            console.log("ERROR", e);
        }
    }
}

export class AnimatedEmoji extends CombinedEmoji {
    constructor(emojis: EmojiSet[], scale: number, color: string, private steps: number = 3, private stepFn: (step: number, steps: number, canvas: HTMLCanvasElement) => void) {
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
            const canvas = document.createElement('canvas');
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
            this.stepFn(i, steps, canvas);
            this.canvases.push(canvas);
            createImageBitmap(ctx.getImageData(0, 0, canvas.width, canvas.height))
            .then(b => this.bmp = b);
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

const c = (n: number, steps: number) => Math.round(n * (steps - 1))
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
        this.ctx.clearRect(0, 0, SIZE, SIZE);
        this.ctx.fillStyle = 'rgb('+this.c.join(',') + ', ' + (1-this.l/1.2-0.2) + ')';
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
    private color = "#49A79C";
    constructor(private emojis: EmojiList[] = [], private seed: number) {
    }
    render(ctx: CanvasRenderingContext2D, bb: Rectangle, s: SceneSettings, game: Game): void {
        // Check if there are already generated obstacles in the area.
        const areGenerated = !!game.gameObjects.getObjectsInArea(bb, TAG.GENERATED).length;

        let generatedAnything = false;
        const m = SIZE * game.MULTIPLIER;
        bb.forEachCell((x, y, oX, oY) => {
            const p = FN(x,y, this.seed || 231);
            ctx.fillStyle = s.backgroundColor || color;
            ctx.fillRect(oX*m, oY*m, m, m);

            this.emojis.forEach(e => {
                if (p > e.range[0] && p < e.range[1]) {
                    if (!e.asGameObject) {
                        e.emoji.render(ctx, oX *m, oY *m, m, m);
                    } else {
                        if (!areGenerated) {
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
            const generatingNr = Math.round(g * 5);
            for(let i=0;i<generatingNr;i++) {
                const s = game.settings;
                
                // Base on difficulty
                const value = s.difficulty * 50+50;
                let lifes = s.difficulty + 1;
                if (Math.random() < s.difficulty * 0.1) {
                    lifes++;
                }

                const p = bb.p1.add(Math.random()*bb.width, Math.random()*bb.height);
                game.gameObjects.add(new Enemy(
                    Math.random() < 0.2 ? E.robot : (Math.random() > 0.5) ? E.cowMan : E.frogMan,
                    value, p, lifes));
            }
        }
    }
}