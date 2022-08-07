import { distance } from "../../utils/math";

export class Point {
    constructor(public x: number, public y: number) { }
    copy() {
        return new Point(this.x, this.y);
    }

    add(x: number, y: number) {
        return new Point(this.x + x, this.y + y);
    }

    static get ORIGIN() {
        return new Point(0, 0);
    }

    distanceFromOrigin() {
        return (new Line(Point.ORIGIN, this)).length;
    }
}

export class Line {
    constructor(public p1: Point, public p2: Point) { }

    getMidpoint(location: number = 0.5) {
        return new Point(
            (this.p1.x * (1-location) + this.p2.x * location) / 2,
            (this.p1.y * (1-location) + this.p2.y * location) / 2,
        );
    }

    get length() {
        return distance(this.p1, this.p2);
    }
}