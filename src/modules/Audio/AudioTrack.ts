import { sR, sV } from "./helper";

interface SynthConfig {
    type: OscillatorType;
    cutoff?: number;
    cutoffOpenRatio?: number;
    cutoffOpenDelay?: number;
    delay?: {
        time: number,
        gain: number,
    }
}
export class AudioTrack {
    private isStoped: boolean = true;
    constructor(public bpm: number, public duration: number, public d: string/* definition*/, public synth: SynthConfig) {
    }

    private osc!: OscillatorNode;
    private ctx!: AudioContext;

    private filter!: BiquadFilterNode;

    public start(ctx: AudioContext) {
        this.ctx = ctx;
        this.makeSynth();
    }

    gains: GainNode[] = [];

    stop() {
        // FIXME: ramp music.
        this.isStoped = true;
        this.gains.forEach(g => sR(g.gain, 0, this.ctx.currentTime + 1.5));
    }

    private makeSynth() {

        this.isStoped = false;
        const ctx = this.ctx; // new window.AudioContext();
        const osc = ctx.createOscillator();
        const fil = ctx.createBiquadFilter();
        this.filter = fil;
        const gain = ctx.createGain();
        this.gains.push(gain);

        const t = ctx.currentTime;

        gain.gain.setValueAtTime(0.1, t);

        fil.type = 'lowpass';
        sV(fil.frequency,this.synth.cutoff || 40000, t);
        fil.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = this.synth.type;
        osc.connect(fil);

        if (this.synth.delay) {
            const del = ctx.createDelay()
            sV(del.delayTime,this.synth.delay.time, t);
            fil.connect(del);
            const delAten = ctx.createGain();
            del.connect(delAten);
            delAten.connect(ctx.destination);
            sV(delAten.gain, this.synth.delay.gain, t);
            this.gains.push(delAten);
        }

        this.osc = osc;
        this.ctx = ctx;
        this.schedule();
        osc.start();

    }

    nextStartTime: number = -1;

    schedule() {
        if (this.isStoped) {
            return;
        }
        const l = 60 / this.bpm;
        let s = this.nextStartTime;
        if (s < 0) {
            s = this.ctx.currentTime;
        }
        if (this.synth.cutoff) {
            const c = this.synth.cutoff;
            const m = this.synth.cutoffOpenRatio || 1;
            const d = this.synth.cutoffOpenDelay || 0;
            const len = this.d.length*l;
            this.filter.frequency.cancelScheduledValues(s);
            sV(this.filter.frequency, this.synth.cutoff, s);
            this.filter.frequency.setTargetAtTime(c*m, s + d * len, len);
        }
        for(let i = 0; i < this.d.length; i++) {
            const m = this.d.charCodeAt(i);
            let hz = Math.pow(2, (m-69)/12)*440;
            if (hz > 5000) {
                hz = 0;
            }
            sV(this.osc.frequency, hz, s+l*i);
            this.duration < 1 && sV(this.osc.frequency, 0, s+l*i+l*this.duration);
        }
        this.nextStartTime = s + this.d.length * l;
        setTimeout(() => this.schedule(), l * this.d.length * 0.9 * 1000);
    }
}