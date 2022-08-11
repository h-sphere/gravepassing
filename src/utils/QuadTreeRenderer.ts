import { Point, Rectangle } from "../modules/Primitives";
import { QuadTree } from "./QuadTree";

export class QuadTreeRenderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private outerBoundary: Rectangle;
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    toCanvasCoordinates(p: Point): [number, number] {
        return [
            (p.x - this.outerBoundary.p1.x) / this.outerBoundary.width * this.width,
            (p.y - this.outerBoundary.p1.y) / this.outerBoundary.width * this.height
        ];
    }

    private _renderQuadtree(qt: QuadTree) {
        const p1 = this.toCanvasCoordinates(qt.boundary.p1);
        const p2 = this.toCanvasCoordinates(qt.boundary.p2);
        this.ctx.beginPath()
        this.ctx.rect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
        this.ctx.stroke();
        if (qt.subTrees.length) {
            qt.subTrees.forEach(st => {
                this._renderQuadtree(st);
            });
        }
    }

    renderQuadtree(qt: QuadTree,) {
        this.outerBoundary = qt.boundary;
        this.ctx.lineWidth = 0.05;
        this.ctx.strokeStyle = "#FFF";
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        return this._renderQuadtree(qt);
    }
}