import { Color } from "../Color/Color";
import { Emoji, Ground } from "../Color/Sprite";
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
            ground: new Ground([
                { emoji: new Emoji("🔬", 12, 1), range: [0.999, 1] },
                { emoji: new Emoji("🔋", 8, 1, 0, 4), range: [0.5, 0.51] },
                { emoji: new Emoji("📚", 10, 1, 0, 5), range: [0.2, 0.21]},
                { emoji: new Emoji("🧪", 8, 1, 0, 2), range: [0.6, 0.61]},
                { emoji: new Emoji("🖥", 12, 1, 0, 2), range: [0.9, 0.92]}
            ], 5234),
            hudBackground: 'rebeccapurple',
            backgroundColor: "rgba(220, 220, 240)"
        };
    }
}