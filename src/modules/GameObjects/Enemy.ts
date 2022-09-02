import { getLinesIntersection, rnd } from "../../utils/math";
import { Directional, E } from "../Assets/Emojis";
import { AnimatedEmoji, Emoji, EmojiSet } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Line, Point } from "../Primitives";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { BombCollectableItem, LifeCollectableItem } from "./Item";
import { BulletInventoryItem } from "./Player";
import { RectangleObject } from "./Rectangle";

const SPEED = 0.001;

export class Enemy extends SimpleHumanoid {

    private p = Point.UNIT_DOWN;
    private changeTimedown = 0;
    constructor(d: Directional, public value: number = 100, p: Point = Point.ORIGIN, public life: number = 3) {
        super(d, 3, 0.5);
        this.center = p;
        this.addTag(TAG.ENEMY);
        // FIXME: combine into single emo.
        for(let i=0;i<this.life;i++) {
            const el = E.enemyH.toGameObject(Point.ORIGIN);
            el.isHidden = true;
            this.add(el);
            this.lives.push(el);
        }

        const markEmoji = E.explamation;
        const obj2 = new RectangleObject(Point.ORIGIN, markEmoji);
        obj2.parentBBExclude = true;
        this.add(obj2);
        this.exclamation = obj2;
        this.exclamation.isHidden = true;

        if(rnd() > 0.5) {
            this.directionMoveFirst = 'y';
        }

    }

    exclamation: RectangleObject;

    lastFired = -1;
    inventory = new BulletInventoryItem()
    
    directionMoveFirst = 'x';

    getHit(container: GameObjectsContainer) {
        super.getHit(container);
        // update hit points above
        if (this.life === 0) {
            this.die();
        } else {
            this.lives[this.life].texture = E.enemyHOff
            this.lives.forEach(l => l.isHidden = false);
        }
    }

    die() {
        // Spawning items
        if (rnd() < 0.5) {
            this.container?.add(new LifeCollectableItem(this.center));
        } else if (rnd() < 0.4) {
            this.container?.add(new BombCollectableItem(this.center));
        }
    }


    // FIXME: probably do it in a nicer way.
    container!: GameObjectsContainer;

    private lives: RectangleObject[] = [];


    update(dt: number, container: GameObjectsContainer): void {
        this.container = container;
        this.changeTimedown -= dt;

        // TARGETTING PLAYER.
        const bb = this.getBoundingBox().expand(4);
        const player = container.getObjectsInArea(bb, TAG.PLAYER);
        let playerSpotted = false;
        if (player.length) {
            const line = new Line(player[0].getBoundingBox().center, this.center);
            if (line.length <= 2) {
                playerSpotted = true;
            } else {
                const obst = container.getObjectsInArea(bb.expand(3), TAG.OBSTACLE);
                const bareer = obst.map(o => o.getBoundingBox().toLines()).flat().find(o => !!getLinesIntersection(o, line));
                playerSpotted = !bareer;
            }
        }
        this.exclamation.isHidden = !playerSpotted;

        let dir = this.p;

        let speed = SPEED;
        let xDiff = 0;
        let yDiff = 0;

        if (playerSpotted) {
            const line = new Line(player[0].getBoundingBox().center, this.center);
            if (line.length <= 1) {
                // stop
                dir = Point.ORIGIN;
            } else {
                xDiff = player[0].getBoundingBox().center.x - this.center.x - 0.5
                yDiff = player[0].getBoundingBox().center.y - this.center.y - 0.5
                if (Math.abs(xDiff) < 0.05) {
                    xDiff = 0;
                }

                if (Math.abs(yDiff) < 0.05) {
                    yDiff = 0;
                }
                // following
                dir = new Point(
                    this.directionMoveFirst === 'x' ? xDiff : 0,
                    this.directionMoveFirst === 'y' ? yDiff : 0).normalize()
                speed *= 2;
            }
        }


        let moved = this.move(dt, dir, speed, container);

        if (!moved && playerSpotted) {
            // trying moving on Y
            dir = new Point(
                this.directionMoveFirst === 'y' ? xDiff : 0,
                this.directionMoveFirst === 'x' ? yDiff : 0).normalize()
            moved = this.move(dt, dir, speed, container);
        }

        if (playerSpotted) {
        // Point towards player
            this.lastX = yDiff ? 0 : xDiff;
            this.lastY = yDiff;
        }

        this.exclamation.rectangle.moveTo(this.center.add(0.2, -0.6));
        this.lives
        .forEach((l,i) =>
            l.rectangle.moveTo(this.center.add(0.3*i, -0.3))
        );


        // FIXME: check where is the player and shot only then.
        // const player = container.getObjectsInArea()

        // FIRE?
        if (this.lastFired + 1000 < Date.now() && playerSpotted) {
            // FIRE
            const go = this.inventory.use(this, container, TAG.PLAYER);
            go.forEach(g => {
                container.add(g);
                g.onHit(t => {
                    // this.xp += t.value;
                })
            });
            this.lastFired = Date.now();
        }

        !moved && (this.changeTimedown = 0);


        if (this.changeTimedown <= 0) {
            const r = rnd();
            if (r < 0.25) {
                this.p = Point.UNIT_UP;
            } else if (r < 0.5) {
                this.p = Point.UNIT_DOWN;
            } else if (r < 0.75) {
                this.p = Point.UNIT_LEFT;
            } else {
                this.p = Point.UNIT_RIGHT;
            }
            this.changeTimedown = 2000 + 1000 * rnd(); // 2s?
        }

        // FIXME: obstacles

        // this.rectangle.moveTo(p);
    }
}