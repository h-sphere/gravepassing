import { getLinesIntersection } from "../../utils/math";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { KeyboardController } from "../Controller/KeyboardController";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, Renderable, RenderableLine, RenderablePoint } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Light, TargetLight } from "./Light";
import { EmptyClass, Rotation, withMovement, withRotation, withTags } from "./mixins";
import { ConicRenderableSquaredPoint } from "./SquaredPoint";


const MOVEMENT_VELOCITY = 0.01;
const ROTATION_VELOCITY = Math.PI;

class SimplePlayer extends withTags(EmptyClass) implements GameObject {
    center: Point;
    constructor() {
        super();
        this.center = new Point(0, 0);
    }
    getBoundingBox(): Rectangle {
        return Rectangle.fromPoint(this.center);
    }

    private _obstacles: GameObject[] = [];
    get obstacles(): GameObject[] {
        return this._obstacles;
    }


    getRenderInstructions(): Renderable[] {
        return [
            RenderablePoint.fromPoint(this.center, 0.2, Color.GREEN)
        ]
    }

    update(dt: number, container: GameObjectsContainer) {
        // Move movement functions here.
    }

    isGlobal = false;
    
}

export class Player extends withRotation(withMovement(SimplePlayer)) implements Rotation {
    public light: TargetLight;
    private controller: KeyboardController;
    constructor() {
        super();
        this.controller = new KeyboardController();

        this.light = new TargetLight(
            this.center,
            0.8,
            5,
            Color.WHITE,
            Math.PI/ 3,
            0,
        )
    }

    set rotation(v: number) {
        this._rotation = v;
        this.light.direction = v;
    }

    get rotation() {
        return this._rotation;
    }


    update(dt: number, container: GameObjectsContainer) {
        const p = new Point(
            this.controller.x,
            this.controller.y,
        )
        this.rotation += dt * ROTATION_VELOCITY * this.controller.rotation / 1000;
        this.move(dt, p, MOVEMENT_VELOCITY, container);
        this.light.center = this.center;
    }
    
    isGlobal = false;

    

    getRenderInstructions() {
        return [
            ...super.getRenderInstructions(),
            // ...this.light.getRenderInstructions(),
            // ...this.getVisionRays(Math.PI / 3).map(r => RenderableLine.fromLine(r, 0.2, Color.BLUE))
        ]
    }
}