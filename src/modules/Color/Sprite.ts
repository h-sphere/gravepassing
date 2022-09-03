import { Directional } from "../Assets/Emojis";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Point, Rectangle } from "../Primitives";
import { convertEmoji } from "./EmojiUtils";
import { SIZE } from "./Image";
import { NewTexture } from "./Texture";

export class DirectionableTexture extends NewTexture {
    private direction ='left';

    constructor(public dir: Directional) {
        super();
    }

    getEmoji() {
        switch (this.direction) {
            case 'right': return this.dir.r;
            case 'down': return this.dir.d;
            case 'up': return this.dir.u;
            default: return this.dir.l;
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        return this.getEmoji().render(ctx, x, y, w, h);
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
    e: string;
    size: number;
    pos: number[];
    hueShift?: number;
    brightness?: number;
    color?: string;
}

export class CombinedEmoji extends NewTexture {
    constructor(private emojis: EmojiSet[], public scale: number = 1, private color = 'white') {
        super();
        this.generate()
    }
    canvas!: HTMLCanvasElement;
    _boundingBox!: Rectangle;
    toGameObject(p: Point, scale: number = 1): RectangleObject {
        return new RectangleObject(p, this, [], scale);
    }
    isGenerated = false;

    protected generate(..._: any[]): void {
        this.isGenerated = true;
        const c = document.createElement('canvas');
        c.width = this.scale * SIZE;
        c.height = this.scale * SIZE;
        const ct = c.getContext('2d')!;
        // let p1: Point, p2: Point;
        this.emojis.forEach(e => {
            e = convertEmoji(e);
            ct.font = `${e.size}px Arial`
            ct.fillStyle = e.color || this.color;
            ct.textBaseline = "top";
            ct.filter = `hue-rotate(${e.hueShift||0}deg) brightness(${e.brightness||100}%)`;
            ct.fillText(e.e, e.pos[0], e.pos[1]);
            ct.filter = '';
        });
        this.canvas = c;
        this.optimise(ct);
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        !this.isGenerated && this.generate();
        try {
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w, h);
        } catch (e) {
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
            this.optimise(ctx);
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
        }
    }

    private _n: number = 0;
    setFrame(n: number) {
        this._n = n % this.steps;
    }
}

export class Emoji extends CombinedEmoji {
    constructor(e: string, size: number, scale: number, x = 0, y = 0, color: string = 'white', hueShift: number = 0, brightness: number = 100) {
        super([{e: e, size: size, pos: [x, y], hueShift, brightness}], scale, color);
        this.generate();
    }
}



const D_STEP = 11;

const c = (n: number, steps: number) => Math.round(n * (steps - 1))
export class Dither extends NewTexture {

    static generateDithers(steps: number = D_STEP, color: number[] = [44, 100, 94]) {
        const dithers: Dither[] = [];
        for(let i=0;i<=steps;i++) {
            const d = this.gD(steps, i, color);
            dithers.push(d);
        }
        return (n: number) => dithers[c(n, steps)];
    }

    static gD(s: number, l: number, col: number[]) {
        return new Dither(l/s,s,col);
    }

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    private constructor(private l: number, private s: number, private c: number[]) {
        super();
        this.canvas = document.createElement('canvas');
        this.canvas.width = SIZE;
        this.canvas.height = SIZE;
        this.ctx = this.canvas.getContext('2d')!;
        this.generate();
    }
    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        try {
            ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w, h);
        } catch (e) {
        }
    }
    protected generate(): void {
        const ct = this.ctx;
        ct.clearRect(0, 0, SIZE, SIZE);
        ct.fillStyle = 'rgb('+this.c.join(',') + ', ' + (1-this.l/1.2-0.2) + ')';
        if (this.l > 0.95) {
            return;
        }
        for(let i=0;i<SIZE;i++) { 
            for(let j=0;j<SIZE;j++) {
                if ((c(Math.abs(i*i + j*j), this.s) % (this.s)) >= c(this.l, this.s)) {
                    ct.fillRect(i, j, 1, 1);
                }
            }
        }
        this.optimise(ct);
    }
}