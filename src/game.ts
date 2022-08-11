import { Game } from "./modules/Game";

import {perlin2, seed } from "./utils/perlin";

const game = new Game(document.querySelector('#game')!);
game.start();

// seed(0);

// const perlinContainer = document.querySelector<HTMLCanvasElement>("#perlin")!;

// const ctx = perlinContainer.getContext('2d')!;

// for(let i=0;i<perlinContainer.width;i++) {
//     for(let j=0;j<perlinContainer.height;j++) {
//         const p = 256 * perlin2(1213.4213 + i / 60, 321.3421 + j / 40);
//         console.log(p);
//         ctx.fillStyle = `rgb(` + [p,p,p].join(',') + ')';
//         ctx.fillRect(i, j, 1, 1);
//     }
// }