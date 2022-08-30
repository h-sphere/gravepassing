import { Directional } from "../Assets/Emojis";
import { DirectionableTexture } from "../Color/Sprite";
import { Point, Rectangle } from "../Primitives";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Light } from "./Light";
import { withMovement, withRotation } from "./mixins";
import { RectangleObject } from "./Rectangle";

class SimpleHumanoidPref extends GameObjectGroup {
    center: Point;
    selected = 0;

    protected sprite: RectangleObject;
    protected light: Light;

    // public xp: number = 0;

    protected isSelectionDirty = false;
    protected fireCooldown: number = 0;
    constructor(d: Directional, distance: number = 4, intensity = 0.5) {
        super();
        this.center = new Point(0, 0);

        this.sprite = new RectangleObject(this.center, new DirectionableTexture(d));


        this.light = new Light(
            this.center,
            intensity,
            distance
        )
        this.light.parentBBExclude = true;

        this.add(this.sprite);
        this.add(this.light);
    }
    zIndex?: number | undefined;

    private _obstacles: GameObject[] = [];
    get obstacles(): GameObject[] {
        return this._obstacles;
    }


    // getRenderInstructions(): Renderable[] {
    //     return [
    //     ]
    // }

    update(dt: number, container: GameObjectsContainer) {
        // Move movement functions here.
    }

    getBoundingBox(): Rectangle {
        const bb = super.getBoundingBox();
        const w = bb.width;
        return bb.moveBy(new Point(w / 3, 0)).scale(1/3, 1)
    }


    public lastX: number = 0;
    public lastY: number = 1;

}

export class SimpleHumanoid extends withRotation(withMovement(SimpleHumanoidPref)) {
    value = 0;
    move(dt: number, direction: Point, speed: number, container: GameObjectsContainer): boolean {
        const moved = super.move(dt, direction, speed, container);
        this.sprite.rectangle.moveTo(this.center);
        if (direction.x || direction.y) {
            this.lastX = direction.x;
            this.lastY = direction.y;
        }
        let d = 'down';
        if (this.lastY !== 0) {
            d = this.lastY < 0 ? 'up' : 'down'
        } else {
            d = this.lastX < 0 ? 'left' : 'right';
            // ((this.go.texture as DirectionableTexture).left as Sprite).flip = this.lastX > 0;

        }
        (this.sprite.texture as DirectionableTexture).setDirection(
            d, direction.distanceFromOrigin()
        );
        this.light.center = this.sprite.rectangle.center;

        return moved;
    }

    die(container: GameObjectsContainer) {

    }

    life: number = 5;

    getHit(container: GameObjectsContainer) {
        console.log("GET HIT CONTAINER", container);
        this.life--;
        if (this.life <= 0) {
            console.log("I AM DED");
            this.die(container);
        }
    }

    isGlobal = false;
    
}