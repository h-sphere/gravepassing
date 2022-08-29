import { WithCenter } from "../GameObjects/mixins";
import { Point } from "../Primitives";

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D) {}
    private following?: WithCenter;

    get center() {
        if (!this.following) {
            return Point.ORIGIN;
        }
        return this.following.center.mul(1/10, 1/7).round().mul(10, 7).add(0, 2);
    }

    follow(go: WithCenter) {
        this.following = go;
    }
}