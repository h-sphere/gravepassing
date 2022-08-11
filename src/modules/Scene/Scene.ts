import { GameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";

export class Scene {
    protected gameObjects: Set<GameObject> = new Set();
    constructor() {

    }

    register(container: GameObjectsContainer) {
        this.gameObjects.forEach(g => container.add(g));
    }

    unregister() {
        
    }
}