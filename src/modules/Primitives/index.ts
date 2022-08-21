import { distance } from "../../utils/math";
import { SIZE } from "../Color/Image";

export class Point {
    constructor(public x: number, public y: number) { }
    copy() {
        return new Point(this.x, this.y);
    }

    add(x: number, y: number) {
        return new Point(this.x + x, this.y + y);
    }
    
    addVec(p: Point) {
        return new Point(this.x + p.x, this.y + p.y);
    }

    diffVec(p: Point) {
        return new Point(this.x - p.x, this.y - p.y);
    }

    mul(n: number, m: number | undefined = undefined) {
        return new Point(this.x * n, this.y * (m || n));
    }

    round() {
        return new Point(Math.round(this.x), Math.round(this.y));
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
            (this.p1.x * (1-location) + this.p2.x * location),
            (this.p1.y * (1-location) + this.p2.y * location),
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

    moveTo(p: Point) {
        const w = this.width;
        const h = this.height;
        this.p1 = p.copy();
        this.p2 = p.add(w, h);
    }

    forEachCell(fn: (x: number, y: number, oX: number, oY: number) => void): void {
        for(let i=this.p1.x;i<this.p2.x;i++) {
            for(let j=this.p1.y;j<this.p2.y;j++) {
                fn(i,j, (i-this.p1.x), (j-this.p1.y));
            }
        }
    }

    static fromPoint(p: Point) {
        return new Rectangle(p.copy(), p.copy());
    }
    
    static withPointCenter(p: Point, width: number, height: number): Rectangle {
        return new Rectangle(
            new Point(p.x - width / 2,
            p.y - height / 2),
            new Point(p.x + width / 2, p.y + height / 2)
        )
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