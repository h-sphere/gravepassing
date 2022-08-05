import { getLinesIntersection } from "../../utils/math";
import { Color } from "../Color/Color";
import { Line, Point } from "../Primitives";
import { GameObject, Renderable, RenderableLine, RenderablePoint } from "./GameObject";
import { EmptyClass, Rotation, withRotation, withTags } from "./mixins";

class SimplePlayer extends withTags(EmptyClass) implements GameObject {
    center: Point;
    constructor() {
        super();
        this.center = new Point(0, 0);
    }

    private _obstacles: GameObject[] = [];
    get obstacles(): GameObject[] {
        return this._obstacles;
    }
    updateObstacles(go: GameObject[]) {
        this._obstacles = go;
    }


    getRenderInstructions(): Renderable[] {
        return [
            RenderablePoint.fromPoint(this.center, 0.2, Color.GREEN)
        ]
    }

    update() {
        // Move movement functions here.
    }
    
}

export class Player extends withRotation(SimplePlayer) implements Rotation {
    getRenderInstructions() {
        return [
            ...super.getRenderInstructions(),
            ...this.getVisionRays(Math.PI / 3).map(r => RenderableLine.fromLine(r, 0.2, Color.BLUE))
        ]
    }
}