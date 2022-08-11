import { RenderableLine } from "../modules/GameObjects/GameObject";
import { Point, Rectangle } from "../modules/Primitives";
import { QuadTree } from "./QuadTree";

describe("Quad Tree", () => {
    it("should properly instantiate quad tree", () => {
        const boundary = new Rectangle(
            new Point(-100, -100),
            new Point(100, 100)
        );
        const qt = new QuadTree(boundary);
        qt.add(new RenderableLine(
            Point.ORIGIN,
            Point.ORIGIN.add(-35, 15),
        ));

        expect([...qt.getInArea(boundary)]).toHaveLength(1);
        expect([...qt.getInArea(new Rectangle(new Point(-23, 0), new Point(-1, 1)))]).toHaveLength(1);
        expect([...qt.getInArea(new Rectangle(new Point(-3.999, 12.999), new Point(-35.01, 15.01)))]).toHaveLength(1);
    });
})