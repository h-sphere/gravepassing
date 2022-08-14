import { QuadTree } from "../../utils/QuadTree";
import { Point, Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";

export class QuadTreeContainer implements GameObjectsContainer {

    private objects: Set<GameObject> = new Set();
    private globalObjects: Set<GameObject> = new Set();
    private quadTree: QuadTree;
    private limit = 40;

    constructor() {
        this.update();
    }

    getBoundaries() {
        const p1 = Point.ORIGIN;
        const p2 = Point.ORIGIN;
        this.objects.forEach(obj => {
            const bb = obj.getBoundingBox();
            p1.x = Math.min(p1.x, bb.p1.x);
            p1.y = Math.min(p1.y, bb.p1.y);
            p2.x = Math.max(p2.x, bb.p2.x);
            p2.y = Math.max(p2.y, bb.p2.y);
        });
        return new Rectangle(p1, p2);
    }

    update() {
        const bb = this.getBoundaries();
        this.quadTree = new QuadTree(bb, this.limit);
        this.objects.forEach(o => this.quadTree.add(o));
    }

    getObjectsInArea(rectangle: Rectangle, t: string | undefined = undefined): GameObject[] {
        const obj = [...this.globalObjects, ...this.quadTree.getInArea(rectangle)];
        if (t) {
            return obj.filter(o => o.hasTag(t));
        }
        return obj;
    }
    add(obj: GameObject) {
        if (obj.isGlobal) {
            this.globalObjects.add(obj);
            return;
        }
        this.objects.add(obj);
        this.quadTree && this.quadTree.add(obj);
    }
    getAll(): GameObject[] {
        return [...this.globalObjects, ...this.objects];
    }

    get tree() {
        return this.quadTree;
    }
    
}