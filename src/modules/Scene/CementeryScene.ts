import { E } from "../Assets/Emojis";
import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Color } from "../Color/Color";
import { Image, SIZE } from "../Color/Image";
import { CombinedEmoji, Dither, Emoji, EmojiList, EmojiSet, Ground } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Game } from "../Game";
import { Enemy } from "../GameObjects/Enemy";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Item } from "../GameObjects/Item";
import { AmbientLight } from "../GameObjects/Light";
import { RectangleObject } from "../GameObjects/Rectangle";
import { TextGameObject, TextModal } from "../GameObjects/TextModule";
import { Point, Rectangle } from "../Primitives";
import { LabScene } from "./LabScene";
import { Scene, SceneSettings } from "./Scene";

const T = {
    NOTE: () => new TextModal(["You find a note.", "We did it, we finally discovered solution for ∞ energy.","- Zod Radok, CAU"]),
    NOTE_2: () => new TextModal(["Another Note", "All the monsters seems to gather in from the CAU factory."]),
    NOTE_3: () => new TextModal(["You find coordinates of CAU factory."]),
}



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






export class CementeryScene extends Scene {
    song = new Song([
        new AudioTrack(65 * 4, 1, V, { type: "square", cutoff: 400, delay }),
        new AudioTrack(65 * 8, 0.5, V2, { type: "sawtooth", cutoff: 230, delay }),
        // new AudioTrack(65, 1, "444x333x111x", { type: "square", cutoff: 100 }),
        // new AudioTrack(65, 1, ":::x:::x666x", { type: "square", cutoff: 100 })
    
    ]);;
    addObjects(game: Game): void {
        game.gameObjects.add(new AmbientLight(0.23));


        game.interruptorManager.add(new TextModal(["HELLO WORLD"]))
        
        
    }

    stopMusic(): void {
        this.song.stop();
    }

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        super.register(container, game);
        
        this.song.play();

        console.log("CEMENT", this);


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
            pCenter: Point.ORIGIN.add(50, 20),
            stages: [
                { lvl: 2, res: (g => g.interruptorManager.add(T.NOTE()))},
                { lvl: 3, res: (g => g.interruptorManager.add(T.NOTE_2()))},
                { lvl: 5, res: (g => g.interruptorManager.add(T.NOTE_3()))},
                { lvl: 7, res: (g => g.loadScene(new LabScene))}
            ]
        }
    }
}