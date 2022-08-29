import { distance, getAngularDistance, isAngleInRange } from "../../utils/math";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, Renderable, RenderablePoint } from "./GameObject";
import { EmptyClass, WithCenter, withTags } from "./mixins";
import { ColorGradient } from "../Color/Gradient";
import { ConicRenderableSquaredPoint, RenderableSquaredPoint } from "./SquaredPoint";

export class Light extends withTags(EmptyClass) implements GameObject, WithCenter, Renderable {
    zIndex = 1;
    protected _center: Point;
    isHidden = false;

    get center() {
        return this._center;
    }

    set center(v: Point) {
        this._center = v;
    }
    constructor(center: Point, public intensity: number, public distance: number, public color: Color = Color.WHITE) {
        super();
        this._center = center;
        this._tags.push(TAG.LIGHT);
    }
    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle): void {
        // empty.
    }
    parentBBExclude: boolean = false;
    getBoundingBox(): Rectangle {
        return new Rectangle(
            this.center.add(-this.distance, -this.distance),
            this.center.add(this.distance, this.distance),
        );
    }

    getIntensityAtPoint(p: Point): number {
        const d = distance(this.center, p);
        // console.log(this.distance);
        if (d > this.distance) {
            return 0;
        }
        return this.intensity * (1 - (d / this.distance)*(d / this.distance));
    }

    update(t: number) {}

    isGlobal = false;
}

export class TargetLight extends Light {
    constructor(center: Point, intensity, distance, color: Color = Color.WHITE, public angle: number = Math.PI * 2 / 3, public direction: number = 0) {
        super(center, intensity, distance, color);
    }

    getBoundingBox(): Rectangle {
        return new Rectangle(
            this.center.add(-this.distance, -this.distance),
            this.center.add(this.distance, this.distance),
        );
    }

    // getIntensityAtPoint(p: Point) {
    //     const angle = Math.atan2(p.y - this.center.y, p.x - this.center.x);
    //     if (Math.abs(getAngularDistance(this.direction, angle)) < this.angle / 2) {
    //         return super.getIntensityAtPoint(p);
    //     }
    //     return 0;
    // }


    isGlobal = false;
}

export class AmbientLight extends Light {
    constructor(intensity: number) {
        super(Point.ORIGIN, intensity, Infinity);
    }

    getIntensityAtPoint(p: Point): number {
        return this.intensity;
    }

    isGlobal = true;

    // getBoundingBox(): Rectangle {
    //     return new Rectangle(new Point(-10000, -10000), new Point(10000, 10000));
    // }
}