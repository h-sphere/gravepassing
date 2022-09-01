import { E } from "../Assets/Emojis";
import { AudioManager } from "../Audio/AudioManager";
import { Emoji } from "../Color/Sprite";
import { NewTexture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { KeyboardController } from "../Controller/KeyboardController";
import { Game } from "../Game";
import { Point } from "../Primitives";
import { CementeryScene } from "../Scene/CementeryScene";
import { Bomb } from "./Bomb";
import { Bullet, UsableItem } from "./Bullet";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { SimpleHumanoid } from "./Humanoid";
import { PauseMenu } from "./PauseMenu";
import { InGameTextGO, TextGameObject, TextTexture } from "./TextModule";

const MOVEMENT_VELOCITY = 0.005;

class InventoryItem {
    isDisposable: boolean = true;
    public amount: number = 0;
    public cooldown = 300;
    icon: Emoji = E.item2; // FIXME: naming

    use(user: Player, container: GameObjectsContainer, tag: TAG): UsableItem[] {
        return [];
    }

    shouldBeDeleted() {
        return this.isDisposable && this.amount <= 0;
    }
}

export class BulletInventoryItem extends InventoryItem {
    isDisposable: boolean = false;
    icon = E.item2;
    use(user: SimpleHumanoid, container: GameObjectsContainer, tag = TAG.ENEMY) {
        return [
            new Bullet(user.center, new Point(user.lastX, user.lastY), 300, tag)
        ];
    }
}

class BombInventoryItem extends InventoryItem {
    isDisposable = true;
    amount = 1;
    icon = E.item;
    use(user: Player) {
        this.amount--;
        return [
            new Bomb(user.center, 1000, TAG.ENEMY)
        ];
        
    }
}

const lvlToXp = (lvl: number) => lvl <= 1 ? 0 : (lvl-1)*(lvl-1)*50;


export class Player extends SimpleHumanoid {
    // public light: Light;
    public controller: KeyboardController;
    isHidden = false;

    private _xp: number = 0;
    public lvl: number = 1;
    public lvlProgress: number = 0;
    public xpTexture!: NewTexture  ;
    public lvlTexture!: NewTexture;

    container!: GameObjectsContainer;

    get xp() {
        return this._xp;
    }

    set xp(v: number) {
        this._xp = v;
        // FIXME: thresholds for LVLS
        this.xpTexture = new TextTexture([this.xp + "xp"],4, 1,"#0000");
        
        let lowerT = lvlToXp(this.lvl);
        let upperT = lvlToXp(this.lvl+1);
        if (this._xp >= upperT) {
            // Advancing level!
            this.lvl++;
            lowerT = lvlToXp(this.lvl);
            upperT = lvlToXp(this.lvl + 1);
            const txt = new InGameTextGO("⬆ LVL UP", this.center, 4, 1, "#befabe");
            this.container.add(txt);
            const MIN_COOLDOWN = 100;
            if (this.lvl % 2 === 0 && this.baseCooldown > MIN_COOLDOWN) {
                const txt2 = new InGameTextGO("⬆ SHOT RATE UP", this.center.add(0.5, -0.1), 4, 1, "#FA0", 1.5);
                this.container.add(txt2);
                this.baseCooldown = Math.max(MIN_COOLDOWN, 0.9*this.baseCooldown);
            }
        }
        this.lvlProgress = (this._xp - lowerT) / (upperT - lowerT);
        this.lvlTexture = new TextTexture(["LVL "+this.lvl], 3, 1, "#0000");
    }

    public items: InventoryItem[] = [];


    constructor() {
        super(E.playerDir);
        this.xp = 0;
        this.center = new Point(0, -20);
        this.addTag(TAG.PLAYER);
        this.controller = new KeyboardController();
        this.items.push(new BulletInventoryItem());
        this.items.push(new BombInventoryItem());
    }

    game!: Game;
    setGame(game: Game) {
        this.game = game;
    }

    addItem(type: string) {
        if (this.items.length < 8) {
            if (type === 'bomb') {
                this.items.push(new BombInventoryItem());
            }
        }
    }

    getFeetBox() {
        const bb = this.getBoundingBox();
        return bb.scale(1, 1/5).moveBy(new Point(0, 4/5*bb.height));
    }

    heal() {
        if (this.life < 5) {
            this.life++;
        }
    }

    getHit(container: GameObjectsContainer) {
        super.getHit(container);
    }

    die(container: GameObjectsContainer) {

        const youDie = new TextGameObject(["You died"], new Point(3, 3), 4, 1, false, "#000","#AAA", 20);
        this.game.interruptorManager.add(youDie);
        youDie.onResolution(() => {
            this.game.loadScene(new CementeryScene, true);
        })
    }

    baseCooldown = 500;


    inputCooloff = 0;
    update(dt: number, container: GameObjectsContainer) {
        this.inputCooloff -= dt;

        if (this.controller.v.e && this.inputCooloff < 0) {
            this.game.interruptorManager.add(new PauseMenu());
            this.inputCooloff = 300;
        }

        this.container = container;
        const p = new Point(
            this.controller.x,
            this.controller.y,
        ).normalize();

        this.fireCooldown -= dt;

        if (!this.controller.s) {
            this.isSelectionDirty = false;
        } else if (!this.isSelectionDirty) {
            this.selected = this.selected + this.controller.s;
            if (this.selected < 0) {
                this.selected = this.items.length - 1;
            }
            this.isSelectionDirty = true;
        }

        if (this.controller.v.f && this.fireCooldown <= 0) {
            this.fireCooldown = this.baseCooldown;
            const inventory = this.items[this.selected];
            const go = inventory.use(this, container, TAG.ENEMY);

            // FIXME: disposing of used items.
            if (inventory.shouldBeDeleted()) {
                this.items = this.items.filter(i => i !== inventory);
            }

            go.forEach(g => {
                container.add(g);
                g.onHit(t => {
                    if (t.life <= 0) {
                        this.xp += t.value;
                        AudioManager.get().killed.play();
                    }
                });
                // FIXME: add proper on hit here.
            })
        }

        this.move(dt, p, MOVEMENT_VELOCITY, container);

        this.selected = Math.max(0, this.selected % this.items.length);

        // this.rotation += dt * ROTATION_VELOCITY * this.controller.rotation / 1000;
        
    }
    
    isGlobal = false;
}