import { E } from "../Assets/Emojis";
import { AudioManager } from "../Audio/AudioManager";
import { CombinedEmoji, Emoji } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Point } from "../Primitives";
import { HellScene } from "../Scene/HellScene";
import { LabScene } from "../Scene/LabScene";
import { GameObjectGroup } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Player } from "./Player";

export class Item extends GameObjectGroup {
    isHidden = false;
    constructor(public p: Point, icon: CombinedEmoji, scale: number = 1) {
        super();
        this.center = p;
        this.add(icon.toGameObject(p, scale));
    }

    onAdd(player: Player) {
    }

    update(dt: number, container: GameObjectsContainer): void {
        // super.update(dt, container);

        // For now assuming only player can collect
        const players = container.getObjectsInArea(this.getBoundingBox(), TAG.PLAYER);
        if (!players.length) {
            return; // not collected
        }

        const player = players[0];
        this.onAdd(player as unknown as Player);
        AudioManager.get().collect.play();
        container.remove(this);
    }
}


export class LifeCollectableItem extends Item {
    constructor(p: Point) {
        super(p.add(0, 1), new Emoji("❤️", 4, 1, 4, 10))
    }

    onAdd(player: Player): void {
        player.heal();
    }
}

export class BombCollectableItem extends Item {
    constructor(p: Point) {
        super(p.add(0, 1), new CombinedEmoji([
            { emoji: "💣", size: 6, pos: [4, 8] },
            { emoji: "+", size: 6, pos: [9, 12] },
        ]));
    }

    onAdd(player: Player): void {
        player.addItem('bomb');
    }
}

export class Factory extends Item {
    constructor(p: Point) {
        const point = new Point(Math.random(), Math.random()).normalize().mul(60, 100);

        // random position here
        super(p.addVec(point), E.factory, 3);
    }

    onAdd(player: Player) {
        player.game.loadScene(new LabScene, false, true);
    }
}

export class HellPortal extends Item {
    constructor(p: Point) {
        const point = new Point(Math.random(), Math.random()).normalize().mul(60, 100);

        // random position here
        super(p.addVec(point), E.portal, 3);
    }

    onAdd(player: Player): void {
        player.game.loadScene(new HellScene(), false, true);
    }
}