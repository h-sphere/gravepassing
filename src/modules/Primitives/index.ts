import { distance } from "../../utils/math";
import { SIZE } from "../Color/Image";

export class Point {

    static get UNIT_UP() {
        return Point.ORIGIN.add(0, -1);
    }

    static get UNIT_DOWN() {
        return Point.ORIGIN.add(0, 1);
    }

    static get UNIT_LEFT() {
        return Point.ORIGIN.add(-1, 0);
    }

    static get UNIT_RIGHT() {
        return Point.ORIGIN.add(1, 0);
    }

    constructor(public x: number, public y: number) { }
    copy() {
        return new Point(this.x, this.y);
    }

    neg() {
        return new Point(-this.x, -this.y);
    }

    normalize(): Point {
        if (!this.distanceFromOrigin()) {
            return this; 
        }
        return new Point(
            this.x / this.distanceFromOrigin(),
            this.y / this.distanceFromOrigin(),
        );
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

    toPoint() {
        return new Point(this.p2.x-this.p1.x,this.p2.y-this.p1.y);
    }

    get length() {
        return distance(this.p1, this.p2);
    }
}


export class Rectangle extends Line {

    static get UNIT() {
        return new Rectangle(Point.ORIGIN, Point.ORIGIN);
    }

    static boundingBox(r1: Rectangle, r2: Rectangle): Rectangle {
        return new Rectangle(
            new Point(
                Math.min(r1.p1.x, r2.p1.x),
                Math.min(r1.p1.y, r2.p1.y)
            ),
            new Point(
                Math.max(r1.p2.x, r2.p2.x),
                Math.max(r1.p2.y, r2.p2.y)
            )
        );
    }

    expand(n: number) {
        return new Rectangle(this.p1.add(-n, -n), this.p2.add(n, n));
    }

    toLines(): Line[] {
        return [
            new Line(this.p1, this.p1.add(this.width, 0)),
            new Line(this.p1.add(this.width, 0), this.p2),
            new Line(this.p2, this.p1.add(0, this.height)),
            new Line(this.p1, this.p1.add(0, this.height))
        ];
    }

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

    moveBy(p: Point) {
        return new Rectangle(
            this.p1.add(p.x, p.y),
            this.p2.add(p.x, p.y),
        );
    }

    forEachCell(fn: (x: number, y: number, oX: number, oY: number) => void): void {
        for(let i=this.p1.x;i<this.p2.x;i++) {
            for(let j=this.p1.y;j<this.p2.y;j++) {
                fn(i,j, (i-this.p1.x), (j-this.p1.y));
            }
        }
    }

    scale(x: number, y: number) {
        const p2 = new Point(this.p2.x - this.width*(1-x), this.p2.y - this.height*(1-y));
        return new Rectangle(this.p1, p2);
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