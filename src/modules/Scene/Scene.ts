import { Directional } from "../Assets/Emojis";
import { Dither, Ground } from "../Color/Sprite";
import { Game } from "../Game";
import { GameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Point } from "../Primitives";

interface Stage {
    lvl: number,
    res: (game: Game) => void;
}

// This can be removed probably?
export interface SceneSettings {
    backgroundColor: string;
    ground: Ground;
    hudBackground: string;
    getDither: (n: number) => Dither;
    pCenter: Point;
    stages: Stage[];
    enemies: Directional[];
}

export abstract class Scene {

    stopMusic() {

    }
    protected gameObjects: Set<GameObject> = new Set();
    constructor() {

    }

    addObjects(game: Game) {

    }

    register(container: GameObjectsContainer, game: Game): SceneSettings {
        this.addObjects(game);
        this.gameObjects.forEach(g => container.add(g));
        return {
            backgroundColor: "hsla(173,39%,47%)",
            ground: new Ground([], 123),
            hudBackground: 'orange',
            getDither: Dither.generateDithers(32),
            pCenter: Point.ORIGIN,
            stages: [],
            enemies: [],
        }
    }

    unregister(container: GameObjectsContainer) {
        this.gameObjects.forEach(g => container.remove(g));
    }
}