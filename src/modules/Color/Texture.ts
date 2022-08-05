export interface Texture {
    render(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): typeof CanvasRenderingContext2D.prototype.fillStyle;
}