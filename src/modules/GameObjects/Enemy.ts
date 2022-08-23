import { Directional } from "../Assets/Emojis";
import { Emoji } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { RectangleObject } from "./Rectangle";

const SPEED = 0.001;

export class Enemy extends SimpleHumanoid {
    private p = Point.UNIT_DOWN;
    private changeTimedown = 0;
    constructor(d: Directional, public value: number = 100) {
        super(d, 3, 0.5);
        this.addTag(TAG.ENEMY);
    }


    update(dt: number, container: GameObjectsContainer): void {
        this.changeTimedown -= dt;

        if (this.changeTimedown < 0) {
            const rand = Math.random();
            if (rand < 0.25) {
                this.p = Point.UNIT_UP;
            } else if (rand < 0.5) {
                this.p = Point.UNIT_DOWN;
            } else if (rand < 0.75) {
                this.p = Point.UNIT_LEFT;
            } else {
                this.p = Point.UNIT_RIGHT;
            }
            this.changeTimedown = 2000 + 1000 * Math.random(); // 2s?
        }

        this.move(dt, this.p, SPEED, container);

        // FIXME: obstacles

        // this.rectangle.moveTo(p);
    }
}