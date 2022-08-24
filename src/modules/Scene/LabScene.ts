import { Color } from "../Color/Color";
import { Ground } from "../Color/Sprite";
import { WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { AmbientLight } from "../GameObjects/Light";
import { Point } from "../Primitives";
import { Scene, SceneSettings } from "./Scene";

export class LabScene extends Scene {
    constructor() {
        super();
        this.gameObjects.add(new AmbientLight(0.8));
    }

    register(container: GameObjectsContainer): SceneSettings {
        super.register(container);
        return {
            ground: new Ground(),
            hudBackground: 'purple',
            backgroundColor: "rgba(220, 220, 240)"
        };
    }
}