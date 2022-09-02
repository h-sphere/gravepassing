import { sR, sV } from "./helper";

export class AudioEffect {
    ctx: AudioContext;
    osc: OscillatorNode;
    constructor() {
        this.ctx = new window.AudioContext();
        this.osc = this.ctx.createOscillator();
        this.osc.connect(this.ctx.destination);
        this.setup();
    }

    setup() {
        const {o,f} = this;
        o.type = 'triangle';
        sV(f, 0, 0);
        o.start();
    }

    play(...params: any[]) {
    }

    get f() {
        return this.o.frequency;
    }
    get o() {
        return this.osc;
    }

    get t() {
        return this.ctx.currentTime;
    }
}

export class ShotAudioEffect extends AudioEffect {
    play(): void {
        const {f, t} = this;
        sV(f, 200, t);
        sV(f, 400, t+.05);
        sR(f, 500, t+.06);
        sV(f, 0, t+.1);
    }
}

export class BombAudioEffect extends AudioEffect {
    play(explode: boolean) {
        const { f, o, t} = this;
        o.type = 'triangle'
        sV(f, 150,t)
        sR(f, 100,t+.13);
        if (explode) {
            sR(f, 20, t+.4);
            sV(f, 0,t+.5);
        } else {
            sR(f, 0,t+.131)
        }
    }
}

export class CollectedAudioEffect extends AudioEffect {
    play() {
        const {t,o,f} = this;
        o.type = 'square';
        sV(f, 880, t);
        sV(f, 1760, t+.1);
        sV(f, 0, t+.2);
    }
}

export class EnemyKilledAudioEffect extends AudioEffect {
    play() {
        const {t,o,f} = this;
        o.type = 'square';
        sV(f, 700, t);
        sV(f, 400, t+.05);
        sV(f, 700, t+.1);
        sV(f, 0, t+.2);
    }
}

export class IntroAudioEffect extends AudioEffect {
    play() {
        const {t,o,f} = this;
        o.type = 'sine';
        sV(f,220,t);
        sV(f, 0,t+.15);
        sV(f, 440,t+.2);
        sV(f, 880, t+0.35);
        sV(f, 0, t+.5);
    }
}