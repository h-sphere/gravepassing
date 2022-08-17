import { Texture } from "./Texture";

export class Image implements Texture {
    private canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    private isGenerated: boolean = false;
    protected repeat = 'no-repeat';
    constructor(public width: number, public height: number) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d')!;
    }

    protected generate() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.width / 4, this.height / 4, this.width / 2, this.height / 2);
    }


    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): string | CanvasGradient | CanvasPattern {
        if (!this.isGenerated) {
            this.generate()
            this.isGenerated = true;
        }
        const pattern = this.ctx.createPattern(this.canvas, this.repeat)!;
        const matrix = new DOMMatrix();
        const width = (x2 - x1) / this.width;
        const height = (y2 - y1) / this.height;
        pattern.setTransform(matrix.translate(x1, y1).scale(width, height));
        return pattern;
    }
}

export class Ground extends Image {
    protected repeat: string = 'repeat';
    protected generate(): void {
        this.ctx.fillStyle = 'rgb(30, 50, 30)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = 'rgb(20, 80, 20)';
        this.ctx.lineWidth = 10;
        this.ctx.moveTo(this.width / 4, this.height / 4);
        this.ctx.lineTo(this.width / 4 + 10, this.height / 2);
        this.ctx.stroke();
    }
}

export class PlayerTexture extends Image {
    protected generate(): void {
        const ctx = this.ctx;
        ctx.fillStyle = 'black';
        ctx.fillRect(this.width / 4, this.height / 4, this.width / 2, this.height / 2);
        ctx.fillRect(this.width / 4 + this.width / 6, this.height / 2, this.width / 6, this.height / 2);
    }
}

// export class VariationMap extends Image {
//     constructor()
//     protected generate(): void {
        
//     }
// }