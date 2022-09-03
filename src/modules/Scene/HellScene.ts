import { E } from "../Assets/Emojis";
import { AudioTrack } from "../Audio/AudioTrack";
import { Song } from "../Audio/Song";
import { Ground } from "../Color/Ground";
import { Dither, Emoji } from "../Color/Sprite";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { SwitchItem } from "../GameObjects/Item";
import { AmbientLight } from "../GameObjects/Light";
import { TextModal } from "../GameObjects/TextModule";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";


const TXT = {
    NOTE: () => new TextModal(["The master switch will save us all.", "Where is it though?"]),
    NOTE_2: () => new TextModal(["A dying zombie directs you to the master switch."]),
}

const bpm = 60;
const x = '0<<Ϝ0??Ϝ';
const end = '00::ϜϜϜϜ';
const track = x+x+end;
const power = '5AAϡ5DDϡ5AAϡ5DDϡ55??ϡϡϡϡ';
const bass = '$$$￴$$￴￴';
const T = track + track + track + '0￴0￴￴￴￴￴$$￴" ￴$$';
const P = power + power + power + '<￴<￴<￴$￴￴￴￴.\x1B￴00';
const P2x = "AMMϭAPPϭAMMϭAPPϭAAKKϭϭϭϭAMMϭAPPϭAMMϭAPPϭAAKKϭϭϭϭAMMϭAPPϭAMMϭAPPϭAAKKϭϭϭϭH0H0H000000:'0<<"
const P3x = '055ϕ088ϕ055ϕ088ϕ0033ϕϕϕϕ055ϕ088ϕ055ϕ088ϕ0033ϕϕϕϕ055ϕ088ϕ055ϕ088ϕ0033ϕϕϕϕ0￨0￨0￨0￨￨￨￨00￨00';
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

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        super.register(container, game);
        this.song.play();
        return {
            ground: new Ground([
                { e: new Emoji("💀", 12, 1), range: [0.999, 1] },
                { e: new Emoji("🍖", 8, 1, 0, 4), range: [0.5, 0.51] },
                { e: new Emoji("🪨", 10, 1, 0, 5), range: [0.2, 0.35], asGameObject: true},
                { e: new Emoji("🗿", 12, 1, 0, 2), range: [0.6, 0.61], asGameObject: true},
                { e: new Emoji("🦴", 12, 1, 0, 2), range: [0.9, 0.92]},
            ], 12.4334),
            hudBackground: '#400',
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
            enemies: [E.cowMan, E.frogMan, E.pigMan, E.robotMan, E.zombie, E.zombieWoman, E.devil],
        };
    }
}