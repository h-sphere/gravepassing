import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Color } from "../Color/Color";
import { Dither, Emoji, Ground } from "../Color/Sprite";
import { WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { AmbientLight } from "../GameObjects/Light";
import { TextGameObject } from "../GameObjects/TextModule";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";

export class LabScene extends Scene {
    constructor() {
        super();
        this.gameObjects.add(new AmbientLight(0.3));
        this.gameObjects.add(new TextGameObject([
            "You wake up alone on a cementery",
            "From the distance you hear terrible noises.",
            "You suddenly remember the horror of yesterday",
            "Screams, animals and people turning into",
            "monsters.",
            "all you can do now is to fight for your life."
        ], Point.ORIGIN.add(0.5, 5.5), 9, 2, true));
    }

    register(container: GameObjectsContainer): SceneSettings {
        super.register(container);
        console.log("REGISTERING")


        const bpm = 60;


        const LabMusic = new Song([
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

        LabMusic.play();


        return {
            ground: new Ground([
                { emoji: new Emoji("🔬", 12, 1), range: [0.999, 1] },
                { emoji: new Emoji("🔋", 8, 1, 0, 4), range: [0.5, 0.51] },
                { emoji: new Emoji("📚", 10, 1, 0, 5), range: [0.2, 0.21]},
                { emoji: new Emoji("🧪", 8, 1, 0, 2), range: [0.6, 0.61]},
                { emoji: new Emoji("📠", 12, 1, 0, 2), range: [0.83, 0.85], asGameObject: true},
                { emoji: new Emoji("🖥", 12, 1, 0, 2), range: [0.9, 0.92], asGameObject: true},
            ], 5234),
            hudBackground: 'rgb(30, 20, 50)',
            backgroundColor: "rgba(110, 110, 160)",
            getDither: Dither.generateDithers(30, [100, 70, 130]),
        };
    }
}