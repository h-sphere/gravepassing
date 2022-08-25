import { AudioTrack } from "./modules/Audio/AudioTrack";
import { Game } from "./modules/Game";


const gameObject = document.querySelector<HTMLCanvasElement>('#game')!;

const game = new Game(gameObject, 10, 10);
game.start();
const bpm = 90;
const audio = new AudioTrack(bpm*2, 0.5, "0<H<", {
    type: 'sine',
    cutoff: 450,
});
const audio2 = new AudioTrack(bpm*4, 0.9, "$0<0", {
    type: 'triangle',
    cutoff: 400,
});

const audio3 = new AudioTrack(bpm/2, 1, "HxHxHxHxJxJxxxxx", {
    type: 'triangle',
    cutoff: 800,
});

const audio4 = new AudioTrack(bpm/4, 1, "$0", {
    type: 'square',
    cutoff: 250,
});