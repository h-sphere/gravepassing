import { distance } from "../../utils/math";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObject } from "./GameObject";
import { EmptyClass, WithCenter, withTags } from "./mixins";
import { pointInstruction, RenderInstruction } from "./RenderInstruction";

export class Light extends withTags(EmptyClass) implements GameObject, WithCenter {
    constructor(public center: Point, public intensity: number, public distance: number) {
        super();
        this._tags.push(TAG.LIGHT);
    }
    getRenderInstructions(): RenderInstruction[] {
        // FIXME: reneder circle with gradient.
        return [pointInstruction(this.center, this.distance, Color.RED.mixWithColor(Color.BLUE, 0.5))];
    }

    getIntensityAtPoint(p: Point): number {
        const d = distance(this.center, p);
        if (d > this.distance) {
            return 0;
        }
        return 1 - (d / this.distance);
    }
}

export class AmbientLight extends Light {
    constructor(intensity: number) {
        super(Point.ORIGIN, intensity, Infinity);
    }

    getIntensityAtPoint(p: Point): number {
        return this.intensity;
    }

    getRenderInstructions(): RenderInstruction[] {
        return [];
    }
}