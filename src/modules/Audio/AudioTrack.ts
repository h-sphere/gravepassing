interface SynthConfig {
    type: OscillatorType;
    cutoff?: number;
    delay?: {
        time: number,
        gain: number,
    }
}
export class AudioTrack {
    private interacted: boolean = false;
    private isStoped: boolean = true;
    constructor(public bpm: number, public duration: number, public definition: string, public synth: SynthConfig) {
        const fn = () => {
            this.interacted = true;
            document.removeEventListener('keydown', fn);
        }
        document.addEventListener('keydown', fn);
    }

    private osc: OscillatorNode;
    private ctx: AudioContext;

    public start(ctx: AudioContext) {
        this.ctx = ctx;
        if (this.interacted) {
            this.makeSynth()
        } else {
            const fn = () => {
                this.makeSynth();
                document.removeEventListener('keydown', fn);
            }
            document.addEventListener('keydown', fn);
        }
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