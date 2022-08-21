import { PerlinTexture } from "./modules/Color/PerlinTexture";
import { Game } from "./modules/Game";
import { Point, Rectangle } from "./modules/Primitives";

import {perlin2, seed } from "./utils/perlin";
import { renderNoise } from "./experiments/perlinNoiseCanvas";

const gameObject = document.querySelector<HTMLCanvasElement>('#game')!;

const game = new Game(gameObject, 10, 10);
game.start();

// renderNoise(gameObject, gameObject.getContext('2d')!);

// const perlin = new PerlinTexture(
//     new Rectangle(
//         Point.ORIGIN,
//         Point.ORIGIN.add(5, 5)
//     )
// )

// const ctx = gameObject.getContext('2d')!;

// perlin.render(ctx, 0, 0, 20, 20);

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