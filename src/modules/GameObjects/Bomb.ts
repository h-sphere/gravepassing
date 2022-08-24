import { Emoji } from "../Color/Sprite";
import { Point } from "../Primitives";
import { UsableItem } from "./Bullet";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { withMovement } from "./mixins";
import { RectangleObject } from "./Rectangle";

type Callback = (t: GameObject) => void;

export class Bomb extends UsableItem {
    private o: RectangleObject;
    constructor(p: Point, private lifeSpan = 200, private targetTag: string) {
        super();
        this.center = p;
        this.o = new RectangleObject(p, new Emoji("💣", 8, 1, 8, 8));
        this.add(this.o);

        // FIXME: add coloured light around it.

        // FIXME: remove duplication
        this.o.rectangle.moveTo(this.center);
    }

    update(dt: number, container: GameObjectsContainer): void {

        // Check collision
        this.lifeSpan -= dt;
        if (this.lifeSpan <= 0) {
            // EXPLODE.
            console.log("EXPLODING");
            container.remove(this);
        }
    }
}