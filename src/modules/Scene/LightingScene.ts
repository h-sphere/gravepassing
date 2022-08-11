import { Color } from "../Color/Color";
import { WallGameObject } from "../GameObjects/GameObject";
import { AmbientLight } from "../GameObjects/Light";
import { Point } from "../Primitives";
import { MovingLight } from "../Special/MovingLight";
import { Scene } from "./Scene";

export class LightingScene extends Scene {
    constructor() {
        super();
        // this.gameObjects.add(new AmbientLight(0.8));
        
        for(let i = 0;i<100;i++) {
            const line = new WallGameObject(
                new Point(Math.random() * 1000 - 500, Math.random() * 1000 - 500),
                // Point.ORIGIN,
                new Point(Math.random() * 1000 - 500, Math.random() * 1000 - 500),
                3, Color.GREEN,
            );
            this.gameObjects.add(line);
        }

        // for(let i=0;i<100;i++) {
        //     const light = new MovingLight(
        //         new Point(Math.random() * 1000 - 500, Math.random() * 1000 - 500),
        //         Math.random() * 0.5 + 0.2,
        //         Math.random() * 100 + 20,
        //         Math.random() > 0.3 ? Color.WHITE : Color.YELLOW,
        //         new Point(Math.random() * 100, Math.random() * 300),
        //         Math.random() * 40,
        //     );
        //     this.gameObjects.add(light);
        // }
    }
}