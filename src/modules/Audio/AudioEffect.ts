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
        this.osc.frequency.setValueAtTime(200, this.ctx.currentTime)
        this.osc.frequency.setValueAtTime(400, this.ctx.currentTime + 0.05)
        this.osc.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.06);
        this.osc.frequency.setValueAtTime(0, this.ctx.currentTime + 0.1);
    }
}

export class Bomb extends AudioEffect {
    play(explode: boolean) {
        this.osc.type = 'triangle';
        this.osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        this.osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.13);
        if (explode) {
            this.osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.4);
            this.osc.frequency.setValueAtTime(0, this.ctx.currentTime + 0.5);
        } else {
            this.osc.frequency.linearRampToValueAtTime(0, this.ctx.currentTime + 0.131);
        } 
    }
}

export class Collected extends AudioEffect {
    play() {
        this.osc.type = 'square';
        const t = this.ctx.currentTime;
        this.osc.frequency.setValueAtTime(220, t);
        this.osc.frequency.setValueAtTime(440, t + 0.05);
        // this.osc.frequency.linearRampToValueAtTime(700, t+0.09);
        this.osc.frequency.setValueAtTime(0, t + 0.1);
        // this.osc.frequency.setValueAtTime(800, t + 0.7);
        // this.osc.frequency.setValueAtTime(0, t + 0.8);
    }
}

export class EnemyKilled extends AudioEffect {
    play() {
        this.osc.type = 'square';
        const t = this.ctx.currentTime;
        this.osc.frequency.setValueAtTime(700, t);
        this.osc.frequency.setValueAtTime(400, t + 0.05);
        this.osc.frequency.setValueAtTime(700, t + 0.1);
        // this.osc.frequency.linearRampToValueAtTime(700, t+0.09);
        this.osc.frequency.setValueAtTime(0, t + 0.2);
        // this.osc.frequency.setValueAtTime(800, t + 0.7);
        // this.osc.frequency.setValueAtTime(0, t + 0.8);
    }
}