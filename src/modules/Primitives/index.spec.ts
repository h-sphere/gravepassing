import { Line, Point, Rectangle } from ".";

describe("Primitives", () => {
    describe("Point", () => {
        it("should properly instantiate point", () => {
            const point = new Point(50, 30);
            expect(point.x).toEqual(50);
            expect(point.y).toEqual(30);
        })
    });

    describe("Line", () => {
        it("should properly instantiate line", () => {
            const line = new Line(Point.ORIGIN, new Point(40, 40));
            expect(line.p1).toEqual(Point.ORIGIN);
            expect(line.p2).toEqual(Point.ORIGIN.add(40, 40));
            expect(line.length).toBeCloseTo(56.5685);
        });
    });

    describe("Rectangle", () => {
        it("should properly instantiate rectangle", () => {
            const r = new Rectangle(Point.ORIGIN, Point.ORIGIN.add(50, 40));
            expect(r.p1).toEqual(Point.ORIGIN);
            expect(r.p2.x).toEqual(50);
            expect(r.p2.y).toEqual(40);
        });

        it("should properly change points if neccessary", () => {
            const r = new Rectangle(Point.ORIGIN, Point.ORIGIN.add(-50, 30));
            expect(r.p1).toEqual(new Point(-50, 0));
            expect(r.p2).toEqual(new Point(0, 30));
        });

        it("should intersect properly", () => {
            const r = new Rectangle(Point.ORIGIN, Point.ORIGIN.add(50, 50));
            const r2 = new Rectangle(new Point(-1000, -1000), new Point(1000, 1000));
            expect(r2.isIntersectingRectangle(r)).toBeTruthy();
        });

        it("should intersect properly 2", () => {
            const r1 = new Rectangle(new Point(-75, -43.1), new Point(75.46, 75.46));
            const r2 = new Rectangle(new Point(-10, -50), new Point(10, 50));
            expect(r1.isIntersectingRectangle(r2)).toBeTruthy();
            expect(r2.isIntersectingRectangle(r1)).toBeTruthy();
        });

        it("should intersect properly 3", () => {
            const r1 = new Rectangle(
                Point.ORIGIN,
                Point.ORIGIN.add(-35, 125));

            const r2 = new Rectangle(
                new Point(-3.999, 124.999), new Point(-35.01, 125.01)
            );

            expect(r1.isIntersectingRectangle(r2)).toBeTruthy();
            expect(r2.isIntersectingRectangle(r1)).toBeTruthy();

            expect(r1.isIntersectingRectangle(r1)).toBeTruthy();
        });
    })
})