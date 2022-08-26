import { Directional } from "../Assets/Emojis";
import { AnimatedEmoji, Emoji, EmojiSet } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { GameObject, GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { BulletInventoryItem } from "./Player";
import { RectangleObject } from "./Rectangle";

const SPEED = 0.001;

export class Enemy extends SimpleHumanoid {
    private p = Point.UNIT_DOWN;
    private changeTimedown = 0;
    constructor(d: Directional, public value: number = 100) {
        super(d, 3, 0.5);
        this.addTag(TAG.ENEMY);
        const e: EmojiSet = {
            emoji: "♥️",
            size: 4,
            pos: [0, 0],
        }

        const emojis = [];

        for(let i=0;i<this.life;i++) {
            emojis.push({...e, pos: [i*3, 0]})
        }

        // FIXME: we don't want to do that for every enemy.
        this.hitPoints = new AnimatedEmoji(emojis, 1, "red", this.life, (step, steps, canvas) => { 
            const ctx = canvas.getContext('2d')!;
            console.log("STEPZ", steps);
            ctx.globalCompositeOperation = 'source-atop'
            if (step === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            ctx.fillRect(steps*3,0, -(steps-step)*3, canvas.height);
        });
        const obj = new RectangleObject(Point.ORIGIN, this.hitPoints);
        obj.parentBBExclude = true;
        this.add(obj);
        this.pointsObj = obj;
        this.hitPoints.setFrame(this.life);
    }

    hitPoints: AnimatedEmoji;
    pointsObj;

    lastFired = -1;
    inventory = new BulletInventoryItem()

    getHit() {
        super.getHit();
        this.hitPoints.setFrame(this.life);
        // update hit points above

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
        this.pointsObj.rectangle.moveTo(this.center.add(0, -0.2));

        // FIXME: check where is the player and shot only then.
        // const player = container.getObjectsInArea()

        // FIRE?
        if (this.lastFired + 900 < Date.now() && Math.random() < 0.001) {
            // FIRE
            const go = this.inventory.use(this, container, TAG.PLAYER);
            go.forEach(g => {
                container.add(g);
                g.onHit(t => {
                    console.log("HIT PLAYER");
                    // this.xp += t.value;
                })
            });
            this.lastFired = Date.now();
        }

        // FIXME: obstacles

        // this.rectangle.moveTo(p);
    }
}