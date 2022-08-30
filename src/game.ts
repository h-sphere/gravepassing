import { Game } from "./modules/Game";
const gameObject = document.querySelector<HTMLCanvasElement>('#game')!;
const game = new Game(gameObject, 10, 10);
game.start();