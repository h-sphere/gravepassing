import { SIZE } from "../Color/Image";
import { NewTexture } from "../Color/Texture";
import { KeyboardController } from "../Controller/KeyboardController";
import { Game } from "../Game";
import { Interruptable } from "../Interruptor/Interruptor";
import { Point, Rectangle } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { RectangleObject } from "./Rectangle";


export class TextTexture implements NewTexture {
    canvas!: HTMLCanvasElement;
    constructor(protected text: string[], public w: number , public h: number, private bg?: string , private txtcol: string = '#FFF') {
        this.generate();
    }

    updateTexts(text: string[]) {
        this.text = text;
        this.generate();
    }

    generate() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.letterSpacing = "44px";
        const w = this.w*SIZE;
        const h = this.h*SIZE;
        this.canvas.width = w;
        this.canvas.height = h;
        const ctx = this.canvas.getContext('2d')!;
        ctx.fillStyle = this.bg || '#0000';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = this.txtcol;
        ctx.textAlign = "start";
        ctx.font = "7px 'papyrus'";
        ctx.textBaseline = "top"
        ctx.imageSmoothingEnabled = false;
        this.text.forEach((text, i) => {
            ctx.fillText(text.toUpperCase().split('').join(String.fromCharCode(8202)), 2, 2+i*9);
        });
        // HACK HERE.
        // OMFG, why does this help?
        createImageBitmap(ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
        // .then(b => this.bmp = b);

    }
    render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        // FIXME: move bg drawing here so it's easier to change in menu items.
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w , h);
        ctx.globalAlpha = 1;
    }

    opacity = 1;

    setOpacity(o: number) {
        this.opacity = o;
    }
}

export class TextGameObject extends RectangleObject implements Interruptable {
    isGlobal: boolean = true;
    
    autoHide = 2000;

    res?: () => void;

    constructor(text: string[], p: Point, private w: number, private h: number, private autoremove: boolean = false, bg: string = "black", textcolor: string = 'white') {
        super(p, new TextTexture(text, 2*w, 2*h, bg, textcolor));
        this.rectangle = new Rectangle(p, p.add(w, h));
    }
    onResolution(fn: () => void): void {
        this.res = fn;
    }
    controller!: KeyboardController;
    game!: Game;
    isStartedAsInterrutable: boolean = false;
    start(controller: KeyboardController, game: Game): void {
        this.isStartedAsInterrutable = true;
        this.controller = controller;
        this.game = game;
    }
    hasEnded: boolean = false;

    cooloff = 500;
    update(dt: number, container: GameObjectsContainer): void {
        if (this.isStartedAsInterrutable) {
            this.cooloff -= dt;
            if (this.controller.fire && this.cooloff < 0) {
                this.hasEnded = true;
                this.res && this.res();
            }
            return;
        }
        if (!this.autoremove) {
            return;
        }
        this.autoHide -=dt
        if (this.autoHide <= 0) {
            const opacity = 1 + (this.autoHide / 500);
            if (opacity < 0) {
                container.remove(this);
                return;
            }
            (this.texture as TextTexture).setOpacity(Math.floor(opacity*5)/5);
        }
    }
}

export class InGameTextGO extends TextGameObject {
    constructor(text: string, p: Point, w: number, h: number, color: string) {
        super([text], p, w, h, true, "rgba(0,0,0,0)", color);
    }
    isGlobal: boolean = false;
    autoHide = 1000;
    update(dt: number, container: GameObjectsContainer) {
        super.update(dt, container);
        this.rectangle = this.rectangle.moveBy(new Point(0, -dt*0.2/1000));
    }
}

export class TextModal extends TextGameObject {
    constructor(t: string[]) {
        const textBlock = Point.ORIGIN.add(0.5, 5.5);
        super(t, textBlock, 9 ,2)
    }
}