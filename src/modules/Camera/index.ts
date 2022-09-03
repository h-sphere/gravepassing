import { WithCenter } from "../GameObjects/mixins";
import { Line, Point, Rectangle } from "../Primitives";

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D) {}
    private following?: WithCenter;

    public prevCamera?: Point;

    get center() {
        if (!this.following) {
            return Point.ORIGIN;
        }
        let p = Point.ORIGIN;
        if (this.prevCamera) {
            p = this.prevCamera;
        }
        let c = this.following.center.mul(1/10, 1/7).round().mul(10, 7).add(0, 2);

        // Rounding camera to the grid
        const m =  (new Line(p, c)).getMidpoint(0.1).snapToGrid();
        this.prevCamera = m;
        return m;
    }

    get rawCenter() {
        if (!this.following) {
            return Point.ORIGIN;
        }
        return this.following.center.mul(1/10, 1/7).round().mul(10, 7).add(0, 2);
    }

    follow(go: WithCenter) {
        this.following = go;
    }
}