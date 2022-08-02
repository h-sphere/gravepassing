export class Point {
    constructor(public x: number, public y: number) { }
    copy() {
        return new Point(this.x, this.y);
    }
}

export class Line {
    constructor(public p1: Point, public p2: Point) { }
}