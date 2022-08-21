import { getLinesIntersection } from "../../utils/math";
import { E } from "../Assets/Emojis";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { PlayerTexture } from "../Color/Image";
import { DirectionableTexture, Emoji, Sprite } from "../Color/Sprite";
import { KeyboardController } from "../Controller/KeyboardController";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, Renderable, RenderableLine, RenderablePoint } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Light, TargetLight } from "./Light";
import { EmptyClass, Rotation, withMovement, withRotation, withTags } from "./mixins";
import { RectangleObject } from "./Rectangle";
import { ConicRenderableSquaredPoint } from "./SquaredPoint";


const MOVEMENT_VELOCITY = 0.005;
const ROTATION_VELOCITY = Math.PI;

class SimplePlayer extends withTags(EmptyClass) implements GameObject {
    center: Point;
    go: RectangleObject;
    items: Emoji[];
    selected = 0;

    protected isSelectionDirty = false;
    constructor() {
        super();
        this.center = new Point(0, 0);
        this.go = new RectangleObject(this.center, new DirectionableTexture(
            E.player_left,
            E.player_right,
            E.player_down,
            E.player_top,
        ));
        this.items = [
            E.item2,
            E.item,
            E.item,
        ]
    }
    zIndex?: number | undefined;
    toLines(): Line[] {
        return [
            new Line(this.center, this.center.add(1, 0))
        ]
    }
    getBoundingBox(): Rectangle {
        return this.go.getBoundingBox();
    }

    private _obstacles: GameObject[] = [];
    get obstacles(): GameObject[] {
        return this._obstacles;
    }


    getRenderInstructions(): Renderable[] {
        return [
        ]
    }

    update(dt: number, container: GameObjectsContainer) {
        // Move movement functions here.
    }

    isGlobal = false;
    
}

export class Player extends withRotation(withMovement(SimplePlayer)) implements Rotation {
    public light: Light;
    private controller: KeyboardController;

    private lastX: number = 0;
    private lastY: number = 0;

    constructor() {
        super();
        this.controller = new KeyboardController();

        this.light = new Light(
            this.center,
            1,
            4,
            Color.WHITE,
            // Math.PI/ 3,
            // 0,
        )
    }

    set rotation(v: number) {
        this._rotation = v;
        // this.light.direction = v;
    }

    get rotation() {
        return this._rotation;
    }


    update(dt: number, container: GameObjectsContainer) {
        const p = new Point(
            this.controller.x,
            this.controller.y,
        )

        if (!this.controller.selection) {
            this.isSelectionDirty = false;
        } else if (!this.isSelectionDirty) {
            this.selected = this.selected + this.controller.selection;
            if (this.selected < 0) {
                this.selected = this.items.length - 1;
            }
            this.isSelectionDirty = true;
        }


        this.selected = Math.max(0, this.selected % this.items.length);

        // this.rotation += dt * ROTATION_VELOCITY * this.controller.rotation / 1000;
        this.move(dt, p, MOVEMENT_VELOCITY, container);
        this.go.rectangle.moveTo(this.center);
        if (this.controller.x || this.controller.y) {
            this.lastX = this.controller.x;
            this.lastY = this.controller.y;
        }
        const x = this.controller.x;
        let d = 'down';
        if (this.lastY !== 0) {
            d = this.lastY < 0 ? 'up' : 'down'
        } else {
            d = this.lastX < 0 ? 'left' : 'right';
            // ((this.go.texture as DirectionableTexture).left as Sprite).flip = this.lastX > 0;

        }
        (this.go.texture as DirectionableTexture).setDirection(
            d
        );
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