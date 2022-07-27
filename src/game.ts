import { Game } from "./modules/Game";

const game = new Game(document.querySelector('#game')!);
game.start();