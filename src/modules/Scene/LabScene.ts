import { E } from "../Assets/Emojis";
import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Ground } from "../Color/Ground";
import { Dither, Emoji } from "../Color/Sprite";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { HellPortal } from "../GameObjects/Item";
import { AmbientLight } from "../GameObjects/Light";
import { TextModal } from "../GameObjects/TextModule";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";

const bpm = 60;

const T = {
    NOTE: () => new TextModal(["Looks like some scientist opened a portal to hell.","","Sound familiar?"]),
    NOTE_2: () => new TextModal(["The gate to hell is near."]),
}

export class LabScene extends Scene {
    song = new Song([
        new AudioTrack(bpm*2, 0.5, "0<H<", {
            type: 'sine',
            cutoff: 450,
        }),
        new AudioTrack(bpm*4, 0.9, "$0<0", {
            type: 'triangle',
            cutoff: 400,
        }),
        new AudioTrack(bpm/2, 1, "HxHxHxHxKxKHxxx", {
            type: 'triangle',
            cutoff: 800,
        }),
        new AudioTrack(bpm/4, 1, "$0", {
            type: 'square',
            cutoff: 450,
        })
    ]);

    stopMusic() {
        this.song.stop();
    }


    addObjects(game: Game): void {
        const textBlock = Point.ORIGIN.add(0.5, 5.5);
        this.gameObjects.add(new AmbientLight(0.3));
        game.interruptorManager.add(new TextModal([
            "Endless dark corridors of offices.",
            "An invisible force corrupts these souls.",
            "",
            "You're fighting for them.",
        ]))
    }

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        super.register(container, game);
        this.song.play();


        return {
            ground: new Ground([
                { e: new Emoji("🔬", 12, 1), range: [0.999, 1] },
                { e: new Emoji("🔋", 8, 1, 0, 4), range: [0.5, 0.51] },
                { e: new Emoji("📚", 10, 1, 0, 5), range: [0.2, 0.21]},
                { e: new Emoji("🧪", 8, 1, 0, 2), range: [0.6, 0.61]},
                { e: new Emoji("📠", 12, 1, 0, 2), range: [0.83, 0.85], asGameObject: true},
                { e: new Emoji("🖥", 12, 1, 0, 2), range: [0.9, 0.92], asGameObject: true},
            ], 5234),
            hudBackground: 'rgb(30, 20, 50)',
            backgroundColor: "rgba(110, 110, 160)",
            getDither: Dither.generateDithers(30, [100, 70, 130]),
            pCenter: new Point(0, -20),
            stages: [
                { lvl: 7, res: g => g.interruptorManager.add(T.NOTE())},
                { lvl: 10, res: g => {
                    g.interruptorManager.add(T.NOTE_2());
                    const f = new HellPortal(g.player.center);
                    g.gameObjects.add(f);
                    g.setObjective(f);
                }}
            ],
            enemies: [E.robotMan, E.zombie, E.zombieWoman],
        };
    }
}