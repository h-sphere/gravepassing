import { Emoji } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { RectangleObject } from "./Rectangle";

const SPEED = 0.0005;

export class Enemy extends RectangleObject {
    constructor(e: Emoji, p: Point) {
        super(p, e, TAG.ENEMY, 1);
    }


    update(dt: number, container: GameObjectsContainer): void {

        const p = this.rectangle.p1.add(0, SPEED * dt);

        // FIXME: obstacles

        this.rectangle.moveTo(p);
    }
}