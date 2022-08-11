import { GameObject } from "../modules/GameObjects/GameObject";
import { Rectangle } from "../modules/Primitives";

export class QuadTree {
    objects: Set<GameObject> = new Set();
    subtrees: QuadTree[] = [];
    constructor(private _boundary: Rectangle, private limit: number = 10) {
        // console.log('QUAD', _boundary.toString());
    }

    get boundary() {
        return this._boundary;
    }

    get subTrees() {
        return this.subtrees;
    }

    private subdivide() {
        const p1 = this.boundary.p1;
        const p2 = this.boundary.p2;
        const mid = this.boundary.center;
        const w = this.boundary.width;
        const h = this.boundary.height;
        this.subtrees = [
            new QuadTree(new Rectangle(p1, mid), this.limit),
            new QuadTree(new Rectangle(p1.add(w/2, 0), mid.add(w/2, 0)), this.limit),
            new QuadTree(new Rectangle(p1.add(0, h/2), mid.add(0, h/2)), this.limit),
            new QuadTree(new Rectangle(p1.add(w/2, h/2), mid.add(w/2, h/2)), this.limit),
        ];
        
        // we need to add all exisitng points now
        this.objects.forEach(o => {
            this.subtrees.forEach(t =>
                t.add(o)
            )
        })
    }

    add(obj: GameObject) {
        if (!this.boundary.isIntersectingRectangle(obj.getBoundingBox())) {
            return;
        }

        if (this.objects.size + 1 < this.limit || this.boundary.width < 10 || this.boundary.height < 10) {
            this.objects.add(obj);
        } else {
            if (!this.subtrees.length) {
                this.subdivide();
            }
            this.subtrees.forEach(t => {
               t.add(obj); 
            });
        }
    }

    getInArea(boundary: Rectangle): Set<GameObject> {
        // console.log("Getting in area", boundary.toString(), `Quad: `, this.boundary.toString());
        if (!this.boundary.isIntersectingRectangle(boundary)) {
            // console.log("Not Found");
            return new Set();
        }
        if (this.subtrees.length) {
            // console.log("Getting from subtree");
            const s = new Set<GameObject>();
            for (const tree of this.subTrees) {
                tree.getInArea(boundary).forEach(obj => s.add(obj));
            }
            return s;
        }

        // console.log("Leaf");

        const points = new Set<GameObject>();
        this.objects.forEach(obj => {
            if (boundary.isIntersectingRectangle(obj.getBoundingBox())) {
                points.add(obj);
            }
        });
        return points;
    }
}