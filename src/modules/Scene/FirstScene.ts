import { Color } from "../Color/Color";
import { WallGameObject } from "../GameObjects/GameObject";
import { AmbientLight } from "../GameObjects/Light";
import { Point } from "../Primitives";
import { Scene } from "./Scene";

export class FirstScene extends Scene {
    constructor() {
        super();
        this.gameObjects.add(new AmbientLight(0.8));
        this.gameObjects.add(new WallGameObject(new Point(10, 50), new Point(10, -50), 3, Color.GREEN));
        this.gameObjects.add(new WallGameObject(new Point(-10, 50), new Point(-10, -50), 3, Color.GREEN));
    }
}