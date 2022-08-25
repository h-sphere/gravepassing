import { AudioManager } from "../Audio/AudioManager";
import { Emoji } from "../Color/Sprite";
import { Point } from "../Primitives";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { withMovement } from "./mixins";
import { RectangleObject } from "./Rectangle";

const BULLET_SPEED = 0.04;

type Callback = (t: SimpleHumanoid) => void;

export class UsableItem extends withMovement(GameObjectGroup) {
    private _cb: Callback[] = [];
    onHit(cb: Callback) {
        this._cb.push(cb);
    }
    protected hit(t: SimpleHumanoid) {
        this._cb.forEach(c => c(t));
    }

}

export class Bullet extends UsableItem {
    private o: RectangleObject;
    constructor(p: Point, private direction: Point, private lifeSpan = 200, private targetTag: string) {
        super();
        this.center = p;
        this.o = new RectangleObject(p, new Emoji("🔅", 5, 1, 8, 8));
        this.add(this.o);

        // FIXME: remove duplication
        this.o.rectangle.moveTo(this.center);
        AudioManager.get().shot();
    }

    update(dt: number, container: GameObjectsContainer): void {

        // Check collision
        const enemiesHit = container
            .getObjectsInArea(this.o.getBoundingBox(), this.targetTag)
            .filter(obj => obj.getBoundingBox().isIntersectingRectangle(this.o.getBoundingBox())); // FIXME: this can be optimised
        if (enemiesHit.length) {
            // hit only first
            console.log('HIT', enemiesHit[0].getBoundingBox(), this.o.getBoundingBox());
            const enemy = enemiesHit[0];
            if (enemy instanceof SimpleHumanoid) {
            this.hit(enemy);
            // FIXME: add enemies health here.
            container.remove(enemiesHit[0]);
            this.lifeSpan = 0;
            } else {
                console.log("UNKNOWN ENEMY TYPE", enemy);
            }
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