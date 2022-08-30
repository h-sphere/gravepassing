import { E } from "../Assets/Emojis";
import { Collected } from "../Audio/AudioEffect";
import { CombinedEmoji, Emoji } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Point, Rectangle } from "../Primitives";
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
        console.log("ADDING");
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
        (new Collected).play()
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
        console.log("GENERATING OBJECTIVE");
        
        const point = new Point(Math.random(), Math.random()).normalize().mul(60, 100);

        // random position here
        super(point, E.factory, 3);
    }

    onAdd(player: Player) {
        player.game.loadScene(new LabScene, false);
    }
}