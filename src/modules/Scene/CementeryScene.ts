import { E } from "../Assets/Emojis";
import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Color } from "../Color/Color";
import { Image, SIZE } from "../Color/Image";
import { CombinedEmoji, Dither, Emoji, EmojiList, EmojiSet, Ground, Sprite, SpriteWithLight } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Enemy } from "../GameObjects/Enemy";
import { WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Item } from "../GameObjects/Item";
import { AmbientLight } from "../GameObjects/Light";
import { RectangleObject } from "../GameObjects/Rectangle";
import { TextGameObject } from "../GameObjects/TextModule";
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
        // const WALL2 = new SpriteWithLight(1, 15);
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

        // for (let i = 0; i < 10; i++) {
        //     this.gameObjects.add(new Enemy(
        //         Math.random() < 0.2 ? E.robot : (Math.random() > 0.5) ? E.cowMan : E.frogMan,
        //     ));
        // }

        const gem = new Item(
            Point.ORIGIN.add(-3, -2),
            new Emoji("💎", 8, 1, 4, 4, 'white', 180));
        this.gameObjects.add(gem);

        this.gameObjects.add(new TextGameObject(["Shoot: [SPACE]", "Inventory: [Q] / [W]"], Point.ORIGIN.add(0.5, 5.5), 9, 2, true));

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
        const delay = { time: 0.1, gain: 0.1 };

        const sil = "xxxxxxxx";

        const X = "45241452"
        const V = X + X + X + "1451x5xx" + X + sil + X + "12115xxx";

        const S = "xxxx";

        const B = "$$$$"
        const C = "$$))"

        const var1 = B + S + B + S + B + B + S + S;
        const var2 = C + S + B + S + C + C + S + C;

        const V2 = var1+var1+var1+var2;

        const music = new Song([
            new AudioTrack(65 * 4, 1, V, { type: "square", cutoff: 400, delay }),
            new AudioTrack(65 * 8, 0.5, V2, { type: "sawtooth", cutoff: 230, delay }),
            // new AudioTrack(65, 1, "444x333x111x", { type: "square", cutoff: 100 }),
            // new AudioTrack(65, 1, ":::x:::x666x", { type: "square", cutoff: 100 })

        ]);
        music.play();




        const grave = new CombinedEmoji([
            { emoji: "🪦", size: 12, pos: [0, 0] },
            { emoji: "🌱", size: 6, pos: [0, 10], hueShift: -30 },
            { emoji: "🌱", size: 4, pos: [10, 10], hueShift: -50 },
            { emoji: "🌱🌱🌱", size: 4, pos: [5, 10], hueShift: -20 },
        ], 1);

        const cross = new CombinedEmoji([
            { emoji: "✝", size: 16, pos: [0, 0] },
            { emoji: "🌱 🌱", size: 4, pos: [0, 10], hueShift: -70 },
        ], 1);

        const stone = new CombinedEmoji([
            { emoji: "🪨", size: 10, pos: [0, 10] },
            { emoji: "🌱 🌱", size: 4, pos: [0, 14], hueShift: -70 },
        ], 1);

        const leaf = new CombinedEmoji([
            { emoji: "🍃", size: 6, pos: [0, 0], hueShift: -30 },
            { emoji: "🍃", size: 6, pos: [10, 0], hueShift: -50 },
            { emoji: "🍃", size: 6, pos: [0, 10], hueShift: -70 },
            { emoji: "🍃", size: 6, pos: [15, 0], hueShift: -30 },
            { emoji: "🍃", size: 6, pos: [2, 10], hueShift: -20 },
        ]);

        const wall = new CombinedEmoji([
            { emoji: "🪵", size: 14, pos: [0, 0] }
        ])

        const ground: EmojiList[] = [
            // { emoji: grave, range: [0.999, 1] },
            { emoji: new Emoji("🌱", 4, 1, 0, 0, '', -30), range: [0.5, 0.6] },
            { emoji: cross, range: [0.2, 0.21] },
            { emoji: stone, range: [0.6, 0.61] },
            { emoji: leaf, range: [0.2, 0.3] },
            { emoji: wall, range: [0.35, 0.37], asGameObject: true }
        ];

        let range = 0.3;
        let progress = 0.005;
        for(let i=0;i<10;i++) {
            const em: EmojiSet[] = [{ emoji: "🪦", size: 12 + i % 3, pos: [0, 0] }];
            if (i % 2 == 0) {
                em.push({emoji: "🌱", size: 6, pos: [0, 10], hueShift: -30 })
            }
            if (i%4 == 0) {
                em.push({emoji: "🌱", size: 4, pos: [10, 10], hueShift: -50 })
            }
            if (i% 3 == 0) {
                em.push({ emoji: "🌱🌱🌱", size: 4, pos: [5, 10], hueShift: -20 });
            }
            ground.push({ emoji: new CombinedEmoji(em), range: [range, range+progress], asGameObject: true});
            range+=progress;
        }



        return {
            backgroundColor: '#08422e',
            ground: new Ground(ground, 5234),
            hudBackground: 'rgb(30,30,50)',
            getDither: Dither.generateDithers(16, [5, 46, 32]),
            pCenter: Point.ORIGIN,
        }
    }
}