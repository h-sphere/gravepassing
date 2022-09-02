import { distance } from "../../utils/math";
import { Point, Rectangle } from "../Primitives";
import { GameObject, Renderable } from "./GameObject";
import { EmptyClass, WithCenter, withTags } from "./mixins";

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
    constructor(center: Point, public intensity: number, public distance: number, public color: string = "#FFF") {
        super();
        this._center = center;
        this._tags.push("l");
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
        if (d > this.distance) {
            return 0;
        }
        return this.intensity * (1 - (d / this.distance)*(d / this.distance));
    }

    update(t: number) {}

    isGlobal = false;
}


// FIXME: instead of this we can have minimal light set in dither.
export class AmbientLight extends Light {
    constructor(intensity: number) {
        super(Point.ORIGIN, intensity, Infinity);
    }

    getIntensityAtPoint(p: Point): number {
        return this.intensity;
    }

    isGlobal = true;
}