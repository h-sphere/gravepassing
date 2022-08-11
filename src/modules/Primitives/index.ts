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


export class Rectangle extends Line {
    constructor(p1: Point, p2: Point) {
        super(
            new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
            new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
        );
    }

    static fromPoint(p: Point) {
        return new Rectangle(p.copy(), p.copy());
    }

    get width() {
        return Math.abs(this.p2.x - this.p1.x);
    }

    get height() {
        return Math.abs(this.p2.y - this.p1.y);
    }

    get center() {
        return new Point(this.p1.x + this.width / 2, this.p1.y + this.height / 2);
    }

    isPointWithin(p: Point): boolean {
        return (
            this.p1.x <= p.x && this.p2.x >= p.x &&
            this.p1.y <= p.y && this.p2.y >= p.y
        );
    }
    
    isIntersectingRectangle(r: Rectangle): boolean {
        const noOverlap = (
            this.p1.x > r.p2.x ||
            this.p2.x < r.p1.x ||
            this.p1.y > r.p2.y ||
            this.p2.y < r.p1.y
        );
        return !noOverlap;
    }

    toString() {
        return `▭((${this.p1.x}, ${this.p1.y}), (${this.p2.x}, ${this.p2.y}))`;
    }
}