import { Color } from "../Color/Color";
import { Light } from "../GameObjects/Light";
import { Point } from "../Primitives";

export class MovingLight extends Light {
    private t: number;
    constructor(center: Point, intensity: number, distance: number, color: Color, public movementDiff: Point, public speed: number) {
        super(center, intensity, distance, color);
        this._center = center;
        this.t = 0;
    }
    update(t: number) {
        this.t += t;
    }
    
    get center() {
        return this._center.add(
            Math.sin(this.t / 1000 * this.speed / this.movementDiff.distanceFromOrigin()) * this.movementDiff.x,
            Math.cos(this.t / 1000 * this.speed / this.movementDiff.distanceFromOrigin()) * this.movementDiff.y
        );
    }
}