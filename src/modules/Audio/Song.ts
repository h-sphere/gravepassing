import { AudioTrack } from "./AudioTrack";

export class Song {
    ctx!: AudioContext;
    constructor(public tracks: AudioTrack[]) {
    }

    play() {
        this.ctx = new window.AudioContext();
        this.tracks.forEach(t => t.start(this.ctx));
        this.ctx.resume();
    }

    stop() {
        this.tracks.forEach(t => t.stop());
    }
}