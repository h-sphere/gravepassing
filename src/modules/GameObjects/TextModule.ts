import { SIZE } from "../Color/Image";
import { CombinedEmoji } from "../Color/Sprite";
import { NewTexture } from "../Color/Texture";
import { Point, Rectangle } from "../Primitives";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { RectangleObject } from "./Rectangle";


export class TextTexture implements NewTexture {
    canvas
    constructor(protected text: string[], protected w: number ,protected h: number) {
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
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'white';
        ctx.textAlign = "start";
        // ctx.scale(1, 3);
        ctx.font = "6px Verdana";
        // FIXME: measure somehow the padding required.
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
    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, x, y, w , h);
        ctx.globalAlpha = 1;
    }

    opacity = 1;

    setOpacity(o: number) {
        this.opacity = o;
    }
}

export class TextGameObject extends RectangleObject {
    isGlobal: boolean = true;
    
    autoHide = 2000;

    constructor(text: string[], p: Point, private w: number, private h: number, private autoremove: boolean = false) {
        super(p, new TextTexture(text, w, h));
        this.rectangle = new Rectangle(p, p.add(w, h));
    }

    update(dt: number, container: GameObjectsContainer): void {
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
            this.texture.setOpacity(Math.floor(opacity*5)/5);
        }
    }
}