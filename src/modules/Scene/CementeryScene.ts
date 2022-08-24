import { E } from "../Assets/Emojis";
import { Color } from "../Color/Color";
import { Image, SIZE } from "../Color/Image";
import { CombinedEmoji, Dither, Emoji, Ground, Sprite, SpriteWithLight } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Enemy } from "../GameObjects/Enemy";
import { WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { AmbientLight } from "../GameObjects/Light";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Point, Rectangle } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";

export class CementeryScene extends Scene {
    constructor() {
        super();
        const w = 20;
        const h = 15;
        this.gameObjects.add(new AmbientLight(0.23));
        // this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(-w, -h), Point.ORIGIN.add(-w, h)));
        // this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(-w, -h), Point.ORIGIN.add(w, -h)));
        // this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(w, -h), Point.ORIGIN.add(w, h)));
        // this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(w, h), Point.ORIGIN.add(-w, h)));

        // const texture = new Image();

        // const WALL = new SpriteWithLight(4, 18);
        const WALL2 = new SpriteWithLight(1, 15);
        // const EMOJI = new Emoji("⚡️", 10);
        // const TREE = new Emoji("🀫", 16, 2);
        const ND = new Emoji("⛪️", 32, 2);
        const PPL = new Emoji("🌿", 8, 2);
        
        // const D = new Dither();
        // const TROUSER = new Emoji("👖", 12, 1);

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-2, -1),
        //     EMOJI,
        // ));

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-1, -1),
        //     WALL2,
        //     TAG.OBSTACLE,
        // ));
        
        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-2, -3),
        //     ND,
        //     TAG.OBSTACLE,
        //     4,
        // ))

        for(let i=0;i<10;i++) {
            this.gameObjects.add(new Enemy(
                Math.random() < 0.2 ? E.robot : (Math.random() > 0.5) ? E.cowMan : E.frogMan,
            ));
        }

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(4, 4),
        //     new Emoji("💬", 10, 1),
        //     undefined,
        //     1
        // ))

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-3, 1),
        //     PPL,
        //     undefined,
        //     1,
        // ))

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-1, 1),
        //     PPL,
        //     undefined,
        //     1,
        // ))

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(0, 1),
        //     PPL,
        //     undefined,
        //     1,
        // ))

        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(0, 4),
        //     D,
        //     undefined,
        //     1,
        // ))
        // this.gameObjects.add(new RectangleObject(
        //     Point.ORIGIN.add(-3, -1),
        //     TROUSER,
        //     undefined,
        //     1,
        // ))

        // for(let i=0;i<100;i++) {
        //     this.gameObjects.add(new RectangleObject(
        //             Point.ORIGIN.add(-10 + i, -10), WALL2,
        //             TAG.OBSTACLE
        //     ))
        // }

        // this.gameObjects.add(new WallGameObject(new Point(-10, 50), new Point(-10, -50), 3, Color.GREEN));
    }

    register(container: GameObjectsContainer): SceneSettings {
        super.register(container);
        return {
            backgroundColor: 'rgba(50, 50, 50)',
            ground: new Ground([
                { emoji: new Emoji("🪦", 12, 1), range: [0.999, 1] },
                { emoji: new Emoji("🌱", 4, 1), range: [0.5, 0.6] },
                { emoji: new Emoji("✝", 16, 1), range: [0.2, 0.21]},
                { emoji: new Emoji("🪨", 10, 1), range: [0.6, 0.61]}
            ], 5234),
            hudBackground: 'purple',
        }
    }
}