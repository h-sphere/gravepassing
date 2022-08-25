import { E } from "../Assets/Emojis";

const makeRandoms = (n) => {
    const nums: number[] = [];
    for(let i=0;i<n;i++) {
        nums.push(Math.random());
    }
    return nums;
}

export class AudioEffect {
    ctx: AudioContext;
    osc: OscillatorNode;
    constructor() {
        console.log("SETTING UP")
        this.ctx = new window.AudioContext();
        this.osc = this.ctx.createOscillator();
        this.osc.connect(this.ctx.destination);
        this.setup();
    }

    setup() {
        console.log("OSC SETUPPP");
        this.osc.type = 'triangle';
        this.osc.frequency.setValueAtTime(0, 0);
        this.osc.start();
    }

    play(...params: any[]) {
    }
}

export class Shot extends AudioEffect {
    play(): void {
        console.log('playxx')
        this.osc.frequency.setValueAtTime(400, this.ctx.currentTime)
        this.osc.frequency.linearRampToValueAtTime(280, this.ctx.currentTime + 0.04);
        this.osc.frequency.setValueAtTime(0, this.ctx.currentTime + 0.1);
    }
}

export class Bomb extends AudioEffect {
    play(explode: boolean) {
        this.osc.type = 'triangle';
        this.osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        this.osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.13);
        if (explode) {
            this.osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.4);
            this.osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.5);
            this.osc.frequency.setValueAtTime(0, this.ctx.currentTime + 0.55);
        } else {
            this.osc.frequency.linearRampToValueAtTime(0, this.ctx.currentTime + 0.131);
        }
    }
}