import { distance } from "../../utils/math";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObject, Renderable, RenderablePoint } from "./GameObject";
import { EmptyClass, WithCenter, withTags } from "./mixins";
import { ColorGradient } from "../Color/Gradient";
import { ConicRenderableSquaredPoint, RenderableSquaredPoint } from "./SquaredPoint";

export class Light extends withTags(EmptyClass) implements GameObject, WithCenter, Renderable {
    protected _center: Point;

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
    getRenderInstructions(): Renderable[] {
        const grd = new ColorGradient();
        grd.addStop(0, this.color.withAlpha(this.intensity));
        grd.addStop(1, this.color.withAlpha(0));
        return [RenderableSquaredPoint.fromPoint(this.center, this.distance, grd)];
    }

    getIntensityAtPoint(p: Point): number {
        const d = distance(this.center, p);
        if (d > this.distance) {
            return 0;
        }
        return this.intensity * (1 - (d / this.distance));
    }

    update(t: number) {}
}

export class TargetLight extends Light {
    constructor(center: Point, intensity, distance, color: Color = Color.WHITE, public angle: number = Math.PI * 2 / 3, public direction: number = 0) {
        super(center, intensity, distance, color);
    }

    getRenderInstructions(): Renderable[] {
        const grd = ColorGradient.fromColorToTransparent(this.color.withAlpha(this.intensity));
        return [
            ConicRenderableSquaredPoint.fromPoint(this.center, this.distance, grd, this.angle, this.direction)
        ]
    }
}

export class AmbientLight extends Light {
    constructor(intensity: number) {
        super(Point.ORIGIN, intensity, Infinity);
    }

    getIntensityAtPoint(p: Point): number {
        return this.intensity;
    }

    getRenderInstructions(): Renderable[] {
        return [];
    }
}