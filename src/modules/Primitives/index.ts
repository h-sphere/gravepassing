export class Point {
    constructor(public x: number, public y: number) { }
    copy() {
        return new Point(this.x, this.y);
    }

    static get ORIGIN() {
        return new Point(0, 0);
    }
}

export class Line {
    constructor(public p1: Point, public p2: Point) { }
}