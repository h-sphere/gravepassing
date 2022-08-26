import { AudioTrack } from "./modules/Audio/AudioTrack";
import { Song } from "./modules/Audio/Song";
import { Game } from "./modules/Game";


const gameObject = document.querySelector<HTMLCanvasElement>('#game')!;

const game = new Game(gameObject, 10, 10);
game.start();
const bpm = 90;

// LAB MUSIC

const LabMusic = new Song([
    new AudioTrack(bpm*2, 0.5, "0<H<", {
        type: 'sine',
        cutoff: 450,
    }),
    new AudioTrack(bpm*4, 0.9, "$0<0", {
        type: 'triangle',
        cutoff: 400,
    }),
    new AudioTrack(bpm/2, 1, "HxHxHxHxKxKHxxx", {
        type: 'triangle',
        cutoff: 800,
    }),
    new AudioTrack(bpm/4, 1, "$0", {
        type: 'square',
        cutoff: 450,
    })
]);

const delay = { time: 0.1, gain: 0.1 };

const X = "45241452"
const V = X+X+X+"1451x5xx"

const S = "xxxx";

const B = "$$$$"
const V2 = B+S+B+S+B+B+S+S;

const CementeryMusic = new Song([
    new AudioTrack(65*4, 1, V, { type: "triangle", cutoff: 600, delay}),
    new AudioTrack(65*8, 0.5, V2, { type: "sawtooth", cutoff: 300, delay}),
    // new AudioTrack(65, 1, "45", { type: "square", cutoff: 300, delay: {time: 0.3, gain: 0.4} })

]);

// CementeryMusic.play();

LabMusic.play();


// new AudioTrack(bpm/4, 0.9, "1", {
//     type: 'triangle',
//     cutoff: 400,
// })

// new AudioTrack(bpm/4, 0.9, "5", {
//     type: 'triangle',
//     cutoff: 400,
// })


// new AudioTrack(bpm/4, 0.9, "8", {
//     type: 'triangle',
//     cutoff: 400,
// })