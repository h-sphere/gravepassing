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

const MAX_SPEED = 6.5;
const BOMB_LIMIT = 9;

class InventoryItem {
    public amount: number = 0;
    public cooldown = 300;
    use(user: Player, container: GameObjectsContainer, tag: TAG): UsableItem[] {
        return [];
    }
}

export class BulletInventoryItem extends InventoryItem {
    use(user: SimpleHumanoid, container: GameObjectsContainer, tag = TAG.ENEMY) {
        return [
            new Bullet(user.center, new Point(user.lastX, user.lastY), 300, tag)
        ];
    }
}

class BombInventoryItem extends InventoryItem {
    amount = 1;
    use(user: Player) {
        if (this.amount <= 0) {
            return [];
        }
        this.amount--;
        return [
            new Bomb(user.center, 1000, TAG.ENEMY)
        ];
        
    }
}

const lvlToXp = (lvl: number) => lvl <= 1 ? 0 : (lvl-1)*(lvl-1)*50;


export class Player extends SimpleHumanoid {
    isHidden = false;
    private _xp: number = 0;
    public lvl: number = 1;
    public lvlProgress: number = 0;
    public xpTexture!: NewTexture  ;
    public lvlTexture!: NewTexture;
    container!: GameObjectsContainer;
    speed = 3;
    maxBomb = 3;

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

            if (this.lvl % 3 === 0 && this.speed < MAX_SPEED) {
                this.speed = Math.min(MAX_SPEED, this.speed * 1.2);
                const txt2 = new InGameTextGO("⬆ SPEED UP", this.center.add(0.2, -0.15), 4, 1, "#FA0", 1.3);
                this.container.add(txt2);
            }

            if (this.lvl % 4 === 1) {
                this.maxBomb = Math.min(BOMB_LIMIT, this.maxBomb + 1);
                const txt2 = new InGameTextGO("⬆ MORE BOMBS", this.center.add(0.4, -0.1), 4, 1, "#0A0", 1.3);
                this.container.add(txt2);
            }
        }
        this.lvlProgress = (this._xp - lowerT) / (upperT - lowerT);
        this.lvlTexture = new TextTexture(["LVL "+this.lvl], 3, 1, "#0000");
    }

    public items: InventoryItem[] = [];


    constructor(public controller: KeyboardController) {
        super(E.playerDir);
        this.xp = 0;
        this.center = new Point(0, -20);
        this.addTag(TAG.PLAYER);
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
                this.items[1].amount = Math.min(this.maxBomb, this.items[1].amount+1);
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
        this.controller.vibrate();
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


        const {a,b} = this.controller.v;

        if ((a||b) && this.fireCooldown <= 0) {
            this.fireCooldown = this.baseCooldown;
            const inventory = this.items[a ? 0 : 1];
            const go = inventory.use(this, container, TAG.ENEMY);

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

        this.move(dt, p, (this.speed+(1-this.game.settings.difficulty/2))/1000, container);

        // this.rotation += dt * ROTATION_VELOCITY * this.controller.rotation / 1000;
        
    }
    
    isGlobal = false;
}