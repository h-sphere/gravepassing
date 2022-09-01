import { E } from "../Assets/Emojis";
import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Dither, Emoji, Ground } from "../Color/Sprite";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { SwitchItem } from "../GameObjects/Item";
import { AmbientLight } from "../GameObjects/Light";
import { TextModal } from "../GameObjects/TextModule";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";


const TXT = {
    NOTE: () => new TextModal(["To save humanity, find clue to where's master switch"]),
    NOTE_2: () => new TextModal(["You find location to switch"]),
}

const bpm = 60;
const x = [60, 72, 72, 1000, 60, 75, 75, 1000].map(x => x-12)
.map(y => String.fromCharCode(y)).join('');

const end = [60, 60, 70, 70, 1000, 1000, 1000, 1000].map(x => x-12)
.map(y => String.fromCharCode(y)).join('');

const track = x+x +end;

const power = track.split('').map(x => String.fromCharCode(x.charCodeAt(0)+5)).join('');

const bass = [48,48,48,0,48,48,0,0].map(x => x - 12)
.map(y => String.fromCharCode(y)).join('');

const T = track + track + track + [60, 0, 60, 0, 0, 0, 0, 0, 48, 48, 0, 46, 44, 0, 48, 48].map(y => String.fromCharCode(y-12)).join('');
const P = power + power + power + [72, 0, 72, 0, 72, 0, 48, 0, 0, 0, 0, 58, 39, 0, 60 ,60].map(y => String.fromCharCode(y-12)).join('');

const P2x = P.split('').map((p,i) => String.fromCharCode(p.charCodeAt(0)+12)).join('');

const P3x = P.split('').map((p,i) => String.fromCharCode(Math.max(48, p.charCodeAt(0)-12))).join('');

const P2 = P + P + P2x + P3x;

export class HellScene extends Scene {
    constructor() {
        super();
        this.gameObjects.add(new AmbientLight(0.3));
    }
    song = new Song([
        new AudioTrack(
            bpm*8, 1,
            T, { type: 'sawtooth', cutoff: 600, cutoffOpenRatio: 2},
        ),
        new AudioTrack(
            bpm*8, 1,
            P2, { type: 'sawtooth', cutoff: 700, cutoffOpenRatio: 5}
        ),
        new AudioTrack(
            bpm*8, 0.5, bass,
            { type: "sawtooth", cutoff: 900, cutoffOpenRatio: 90, cutoffOpenDelay: 0.5 }
        ),
        new AudioTrack(
            bpm*8, 0.5, bass,
            { type: "square", cutoff: 500, cutoffOpenRatio: 5, cutoffOpenDelay: 0.5 }
        )
    ]);

    stopMusic(): void {
        this.song.stop();
    }

    // playMusic() {
        
    //     const HellMusic = new Song([
    //         new AudioTrack(
    //             bpm*8, 1,
    //             track, { type: 'square'}
    //         ),
    //         new AudioTrack(
    //             bpm*8, 1,
    //             power, { type: 'square'}
    //         ),
    //     ]);
    //     console.log(HellMusic);
    //     HellMusic.play()
    // }

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        super.register(container, game);
        this.song.play();
        return {
            ground: new Ground([
                { emoji: new Emoji("💀", 12, 1), range: [0.999, 1] },
                { emoji: new Emoji("🍖", 8, 1, 0, 4), range: [0.5, 0.51] },
                { emoji: new Emoji("🪨", 10, 1, 0, 5), range: [0.2, 0.35], asGameObject: true},
                { emoji: new Emoji("🗿", 12, 1, 0, 2), range: [0.6, 0.61], asGameObject: true},
                { emoji: new Emoji("🦴", 12, 1, 0, 2), range: [0.9, 0.92]},
            ], 12.4334),
            hudBackground: '#470100',
            backgroundColor: "rgba(100, 10, 10)",
            getDither: Dither.generateDithers(10, [200, 34, 24]),
            pCenter: Point.ORIGIN,
            stages: [
                { lvl: 12, res: (g => g.interruptorManager.add(TXT.NOTE())), },
                { lvl: 15, res: g => {
                    g.interruptorManager.add(TXT.NOTE_2());
                    const f = new SwitchItem(g.player.center);
                    g.gameObjects.add(f);
                    g.setObjective(f);
                }},
            ],
            enemies: [E.robotMan, E.zombie, E.zombieWoman, E.rabbit, E.devil],
        };
    }
}