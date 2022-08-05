import { distance } from "../../utils/math";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObject, Renderable, RenderablePoint } from "./GameObject";
import { EmptyClass, WithCenter, withTags } from "./mixins";

export class Light extends withTags(EmptyClass) implements GameObject, WithCenter, Renderable {
    constructor(public center: Point, public intensity: number, public distance: number, public color: Color = Color.WHITE) {
        super();
        this._tags.push(TAG.LIGHT);
    }
    getRenderInstructions(): Renderable[] {
        // FIXME: reneder circle with gradient.
        return [RenderablePoint.fromPoint(this.center, this.distance, this.color)];
    }

    getIntensityAtPoint(p: Point): number {
        const d = distance(this.center, p);
        if (d > this.distance) {
            return 0;
        }
        return this.intensity * (1 - (d / this.distance));
    }

    update() {}
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