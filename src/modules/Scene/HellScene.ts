import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Dither, Emoji, Ground } from "../Color/Sprite";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { AmbientLight } from "../GameObjects/Light";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";

export class HellScene extends Scene {
    constructor() {
        super();
        this.gameObjects.add(new AmbientLight(0.3));
    }

    playMusic() {
        const bpm = 60;
        const x = [60, 72, 72, 1000, 60, 75, 75, 1000].map(x => x-12)
        .map(y => String.fromCharCode(y)).join('');
        
        const end = [60, 60, 70, 70, 1000, 1000, 1000, 1000].map(x => x-12)
        .map(y => String.fromCharCode(y)).join('');

        const track = x+x +end;

        const power = track.split('').map(x => String.fromCharCode(x.charCodeAt(0)+5)).join('');

        const LabMusic = new Song([
            new AudioTrack(
                bpm*8, 1,
                track, { type: 'square'}
            ),
            new AudioTrack(
                bpm*8, 1,
                power, { type: 'square'}
            ),
        ]);
    }

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        super.register(container, game);
        return {
            ground: new Ground([
                { emoji: new Emoji("💀", 12, 1), range: [0.999, 1] },
                { emoji: new Emoji("🍖", 8, 1, 0, 4), range: [0.5, 0.51] },
                { emoji: new Emoji("🪨", 10, 1, 0, 5), range: [0.2, 0.21]},
                { emoji: new Emoji("🗿", 12, 1, 0, 2), range: [0.6, 0.61]},
                { emoji: new Emoji("🦴", 12, 1, 0, 2), range: [0.9, 0.92]}
            ], 534),
            hudBackground: '#470100',
            backgroundColor: "rgba(100, 10, 10)",
            getDither: Dither.generateDithers(10, [200, 34, 24]),
            pCenter: Point.ORIGIN,
            stages: [],
        };
    }
}