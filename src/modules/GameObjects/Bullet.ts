import { Emoji } from "../Color/Sprite";
import { Point } from "../Primitives";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { withMovement } from "./mixins";
import { RectangleObject } from "./Rectangle";

const BULLET_SPEED = 0.04;

type Callback = (t: GameObject) => void;

export class Bullet extends withMovement(GameObjectGroup) {
    private o: RectangleObject;
    private _cb: Callback[] = [];
    constructor(p: Point, private direction: Point, private lifeSpan = 200, private targetTag: string) {
        super();
        this.center = p;
        this.o = new RectangleObject(p, new Emoji("🔅", 5, 1, 8, 8));
        this.add(this.o);

        // FIXME: remove duplication
        this.o.rectangle.moveTo(this.center);
    }

    onHit(cb: Callback) {
        this._cb.push(cb);
    }

    update(dt: number, container: GameObjectsContainer): void {

        // Check collision
        const enemiesHit = container.getObjectsInArea(this.o.getBoundingBox(), this.targetTag);
        if (enemiesHit.length) {
            // hit only first
            console.log('HIT', enemiesHit[0]);
            const enemy = enemiesHit[0];
            // if (enemy instanceof Enemy) {
            this._cb.forEach(c => c(enemy))
            // FIXME: add enemies health here.
            container.remove(enemiesHit[0]);
            this.lifeSpan = 0;
            // } else {
            //     console.log("UNKNOWN ENEMY TYPE", enemy);
            // }
        }

        this.lifeSpan -= dt;
        if (this.lifeSpan <= 0) {
            // DIE.
            container.remove(this);
        }
        this.move(dt, this.direction, BULLET_SPEED, container);
        this.o.rectangle.moveTo(this.center);
    }
}