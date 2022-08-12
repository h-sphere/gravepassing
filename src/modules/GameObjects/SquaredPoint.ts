import { getLinesIntersection } from "../../utils/math";
import { Color } from "../Color/Color";
import { Texture } from "../Color/Texture";
import { Line, Point, Rectangle } from "../Primitives";
import { RenderablePoint } from "./GameObject";

const POINTS_AMOUNT = 360;

export class RenderableSquaredPoint extends RenderablePoint {
    static fromPoint(p: Point, radius: number = 0.1, color: Texture = Color.RED) {
        return new this(p.x, p.y, radius, color);
    }

    protected _getPolygonPoints(gameObjects: Line[], angle: number, direction: number) {
        const points: Point[] = []
        for(let i=0;i<POINTS_AMOUNT;i++) {
            const ang = direction + i * angle / (POINTS_AMOUNT) - angle / 2;
            const p = new Point(
                this.x + this.radius * Math.sin(ang),
                this.y + this.radius * Math.cos(ang),
            );
            const line = new Line(this, p);
            gameObjects && gameObjects.forEach(l => {
                const i = getLinesIntersection(line, l);
                if (i) {
                    line.p2 = i;
                }
            });


            points.push(line.p2);
        }
        if (angle < 2 * Math.PI) {
            points.push(new Point(this.x, this.y));
        }
        return points;
    }

    getPolygonPoints(gameObjects: Line[]): Point[] {
        return this._getPolygonPoints(gameObjects, 2 * Math.PI, 0);
    }
}

export class ConicRenderableSquaredPoint extends RenderableSquaredPoint {
    constructor(x: number, y: number, radius: number, color: Texture, public angle: number, public direction: number = 0) {
        super(x, y, radius, color);
    }

    static fromPoint(p: Point, radius: number = 0.1, color: Texture = Color.RED, angle: number = Math.PI * 2 / 3, direction: number = 0) {
        return new this(p.x, p.y, radius, color, angle, direction);
    }

    getPolygonPoints(gameObjects: Line[]): Point[] {
        return this._getPolygonPoints(gameObjects, this.angle, this.direction);
    }
}