import { Camera } from "../Camera";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";

export interface Renderer {
    render(camera: Camera, gameObjects: GameObjectsContainer, dt: number, game: Game);
}