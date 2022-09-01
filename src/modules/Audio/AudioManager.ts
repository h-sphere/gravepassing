import { BombAudioEffect, CollectedAudioEffect, EnemyKilledAudioEffect, IntroAudioEffect, ShotAudioEffect } from "./AudioEffect";

export class AudioManager {
    static instance?: AudioManager
    static get() {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }
    shot = new ShotAudioEffect();
    bomb = new BombAudioEffect();
    collect = new CollectedAudioEffect();
    killed = new EnemyKilledAudioEffect();
    intro = new IntroAudioEffect();
}