import { Ground } from "../Color/Sprite";
import { GameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";

export interface SceneSettings {
    backgroundColor: string;
    ground: Ground;
    hudBackground: string;
}

export class Scene {
    protected gameObjects: Set<GameObject> = new Set();
    constructor() {

    }

    register(container: GameObjectsContainer): SceneSettings {
        this.gameObjects.forEach(g => container.add(g));
        return {
            backgroundColor: "hsla(173,39%,47%)",
            ground: new Ground(),
            hudBackground: 'orange',
        }
    }

    unregister(container: GameObjectsContainer) {
        this.gameObjects.forEach(g => container.remove(g));
    }
}