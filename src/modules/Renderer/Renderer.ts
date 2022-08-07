import { Camera } from "../Camera";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";

export interface Renderer {
    render(camera: Camera, gameObjects: GameObjectsContainer);
}