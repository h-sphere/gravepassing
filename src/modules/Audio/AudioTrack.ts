interface SynthConfig {
    type: OscillatorType;
    cutoff?: number;
}
export class AudioTrack {
    constructor(public bpm: number, public duration: number, public definition: string, public synth: SynthConfig) {
        const fn = () => {
            this.makeSynth();
            document.removeEventListener('keydown', fn);
        }
        document.addEventListener('keydown', fn);
    }

    private osc: OscillatorNode;
    private ctx: AudioContext;

    makeSynth() {
        const ctx = new window.AudioContext();
        const osc = ctx.createOscillator();
        const fil = ctx.createBiquadFilter();
        fil.type = 'lowpass';
        fil.frequency.setValueAtTime(this.synth.cutoff || 40000, ctx.currentTime);
        osc.type = this.synth.type;
        osc.connect(fil);
        fil.connect(ctx.destination);
        this.osc = osc;
        this.ctx = ctx;
        this.schedule();
        osc.start();

    }

    schedule() {
        console.log(this.ctx);
        const l = 60 / this.bpm;
        console.log('SPEED', l);
        // const l = 0.5;
        console.log('timez', this.ctx.currentTime);
        for(let i = 0; i < this.definition.length; i++) {
            const m = this.definition.charCodeAt(i);
            let hz = Math.pow(2, (m-69)/12)*440;
            if (hz > 5000) {
                hz = 0;
            }
            console.log(hz, this.ctx.currentTime+l*i+l/2);
            this.osc.frequency.setValueAtTime(hz, this.ctx.currentTime+l*i);
            this.osc.frequency.setValueAtTime(0, this.ctx.currentTime+l*i+l*this.duration);
        }
        setTimeout(() => this.schedule(), l * this.definition.length * 1000);
    }

    start() {

    }
}