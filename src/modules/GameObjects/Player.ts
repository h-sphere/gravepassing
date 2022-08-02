import { getLinesIntersection } from "../../utils/math";
import { Line, Point } from "../Primitives";
import { GameObject } from "./GameObject";
import { EmptyClass, Rotation, withRotation, withTags } from "./mixins";
import { gradientLineInstruction, lineInstruction, pointInstruction, RenderInstruction } from "./RenderInstruction";

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


    getRenderInstructions(): RenderInstruction[] {
        return [
            pointInstruction(this.center, 0.2, "white")
        ]
    }
    
}

export class Player extends withRotation(SimplePlayer) implements Rotation {
    getRenderInstructions(): RenderInstruction[] {
        return [
            ...super.getRenderInstructions(),
            ...this.getVisionRays(Math.PI / 3).map(r => gradientLineInstruction(r.p1, r.p2, 0.5, 'yellow', 'black'))
        ]
    }
}