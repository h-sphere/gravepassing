import { BombAudioEffect } from "../Audio/AudioEffect";
import { AudioManager } from "../Audio/AudioManager";
import { Emoji } from "../Color/Sprite";
import { Point } from "../Primitives";
import { UsableItem } from "./Bullet";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { Light } from "./Light";
import { RectangleObject } from "./Rectangle";

export class Bomb extends UsableItem {
    isHidden = false;
    private o: RectangleObject;
    explosionTime = 900;
    exploded = false;
    constructor(p: Point, private lifeSpan = 1000, private targetTag: string) {
        super();
        this.center = p;
        this.o = new RectangleObject(p, new Emoji("💣", 8, 1, 4, 4));
        this.add(this.o);

        // FIXME: remove duplication
        this.o.rectangle.moveTo(this.center);
        AudioManager.get().bomb.play(false);
    }

    update(dt: number, container: GameObjectsContainer): void {

        // Check collision
        this.lifeSpan -= dt;
        if (this.lifeSpan <= 0 && !this.exploded) {
            this.exploded = true;
            // EXPLODE.
            AudioManager.get().bomb.play(true);

            const l = new Light(
                this.center,
                0.3,
                3,
                "#FF0")
            // Add light
            this.add(l);
            container.add(l);

            // KILLING HERE.
            const bb = l.getBoundingBox();
            container.getObjectsInArea(bb, this.targetTag).forEach(target => {
                if (target instanceof SimpleHumanoid) {
                    target.getHit(container);
                    if (target.life <= 0) {
                        container.remove(target);
                        this.hit(target);
                    }
                }
            })

            // container.remove(this);
        }
        if (this.lifeSpan + this.explosionTime <= 0) {
            container.remove(this);
        }
    }
}