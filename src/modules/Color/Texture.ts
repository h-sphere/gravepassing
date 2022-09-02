export abstract class NewTexture {
    abstract render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
    optimise(ctx: CanvasRenderingContext2D) {
        createImageBitmap(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))
    }
};
