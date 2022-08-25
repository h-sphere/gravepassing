import { Bomb, Shot } from "./AudioEffect";
import { AudioTrack } from "./AudioTrack";

export class AudioManager {
    static man: AudioManager;
    static get() {
        if (!this.man) {
            this.man = new AudioManager();
        }
        return this.man;
    }

    private sounds = {
        "shot": new Shot(),
        "bomb": new Bomb(),
    }

    constructor() {
        
    }

    shot() {
        this.sounds.shot.play();
    }

    bomb(e: boolean) {
        this.sounds.bomb.play(e);
    }
}