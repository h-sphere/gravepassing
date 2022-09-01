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
    constructor(public bpm: number, public duration: number, public definition: string, public synth: SynthConfig) {
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
        this.gains.forEach(g => g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5));
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
        fil.frequency.setValueAtTime(this.synth.cutoff || 40000, t);
        fil.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = this.synth.type;
        osc.connect(fil);

        if (this.synth.delay) {
            const del = ctx.createDelay()
            del.delayTime.setValueAtTime(this.synth.delay.time, t);
            fil.connect(del);
            const delAten = ctx.createGain();
            del.connect(delAten);
            delAten.connect(ctx.destination);
            delAten.gain.setValueAtTime(this.synth.delay.gain, t);
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
            const len = this.definition.length*l;
            this.filter.frequency.cancelScheduledValues(s);
            this.filter.frequency.setValueAtTime(this.synth.cutoff, s);
            this.filter.frequency.setTargetAtTime(c*m, s + d * len, len);
            // this.filter.frequency.setValueCurveAtTime([c, c*m], s, s+this.definition.length*l);
        }
        for(let i = 0; i < this.definition.length; i++) {
            const m = this.definition.charCodeAt(i);
            let hz = Math.pow(2, (m-69)/12)*440;
            if (hz > 5000) {
                hz = 0;
            }
            this.osc.frequency.setValueAtTime(hz, s+l*i);
            this.duration < 1 && this.osc.frequency.setValueAtTime(0, s+l*i+l*this.duration);
        }
        this.nextStartTime = s + this.definition.length * l;
        setTimeout(() => this.schedule(), l * this.definition.length * 0.9 * 1000);
    }
}