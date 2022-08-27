import { E } from "../Assets/Emojis";
import { Audio, getAudio } from "../Audio/AudioManager";
import { Emoji } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { KeyboardController } from "../Controller/KeyboardController";
import { Point, Rectangle } from "../Primitives";
import { Bomb } from "./Bomb";
import { Bullet, UsableItem } from "./Bullet";
import { Enemy } from "./Enemy";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";

const MOVEMENT_VELOCITY = 0.005;

class InventoryItem {

    private _cb: (() => void)[] = [];
    protected isDisposable: boolean = true;
    public amount: number = 0;
    public cooldown = 300;
    icon: Emoji = E.item2; // FIXME: naming

    use(user: Player, container: GameObjectsContainer, tag: string): UsableItem[] {
        return [];
    }

    onDelete(cb) {
        this._cb.push(cb);
    }
}

export class BulletInventoryItem extends InventoryItem {
    protected isDisposable: boolean = false;
    icon = E.item2;
    use(user: SimpleHumanoid, container: GameObjectsContainer, tag = TAG.ENEMY) {
        return [
            new Bullet(user.center, new Point(user.lastX, user.lastY), 300, tag)
        ];
    }
}

class BombInventoryItem extends InventoryItem {
    protected isDisposable = true;
    amount = 1;
    icon = E.item;
    use(user: Player) {
        return [
            new Bomb(user.center, 1000, TAG.ENEMY)
        ];
        
    }
}


export class Player extends SimpleHumanoid {
    // public light: Light;
    public controller: KeyboardController;

    public xp: number = 0;

    public items: InventoryItem[] = [];


    constructor() {
        super(E.playerDir);
        this.center = new Point(0, -20);
        this.addTag(TAG.PLAYER);
        this.controller = new KeyboardController();
        this.items.push(new BulletInventoryItem());
        this.items.push(new BombInventoryItem());
    }

    getFeetBox() {
        const bb = this.getBoundingBox();
        return bb.scale(1, 1/5).moveBy(new Point(0, 4/5*bb.height));
        
    }


    update(dt: number, container: GameObjectsContainer) {
        const p = new Point(
            this.controller.x,
            this.controller.y,
        ).normalize();

        this.fireCooldown -= dt;

        if (!this.controller.selection) {
            this.isSelectionDirty = false;
        } else if (!this.isSelectionDirty) {
            this.selected = this.selected + this.controller.selection;
            if (this.selected < 0) {
                this.selected = this.items.length - 1;
            }
            this.isSelectionDirty = true;
        }

        if (this.controller.fire && this.fireCooldown <= 0) {
            this.fireCooldown = 300;
            const go = this.items[this.selected].use(this, container, TAG.ENEMY);

            go.forEach(g => {
                container.add(g);
                g.onHit(t => {
                    console.log("HIT", t, t.life, t.value);
                    if (t.life <= 0) {
                        this.xp += t.value;
                        getAudio('killed').play()
                    }
                });
                // FIXME: add proper on hit here.
            })

            // const bullet = new Bullet(this.center, new Point(this.lastX, this.lastY), 300, TAG.ENEMY);
            // bullet.onHit((target) => {
            //     if (target instanceof Enemy) {
            //         console.log("ENEMY");
            //         this.xp += target.value;
            //     }
            //     console.log("BULLET HIT", target);
            // }) 
            // container.add(bullet); 
        }

        this.move(dt, p, MOVEMENT_VELOCITY, container);

        this.selected = Math.max(0, this.selected % this.items.length);

        // this.rotation += dt * ROTATION_VELOCITY * this.controller.rotation / 1000;
        
    }
    
    isGlobal = false;
}