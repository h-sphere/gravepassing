import { WithCenter } from "../GameObjects/mixins";
import { Line, Point, Rectangle } from "../Primitives";

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D) {}
    private following?: WithCenter;

    private prevCamera?: Point;

    get center() {
        if (!this.following) {
            return Point.ORIGIN;
        }
        let p = Point.ORIGIN;
        if (this.prevCamera) {
            p = this.prevCamera;
        }
        const c = this.following.center.mul(1/10, 1/7).round().mul(10, 7).add(0, 2);
        const m =  (new Line(p, c)).getMidpoint(0.1);
        const integered = new Point(Math.round(m.x), Math.round(m.y));
        this.prevCamera = m;
        return integered;
    }

    follow(go: WithCenter) {
        this.following = go;
    }
}