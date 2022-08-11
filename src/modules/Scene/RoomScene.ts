import { Color } from "../Color/Color";
import { WallGameObject } from "../GameObjects/GameObject";
import { AmbientLight } from "../GameObjects/Light";
import { Point } from "../Primitives";
import { Scene } from "./Scene";

export class RoomScene extends Scene {
    constructor() {
        super();
        const w = 20;
        const h = 15;
        this.gameObjects.add(new AmbientLight(0.1));
        this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(-w, -h), Point.ORIGIN.add(-w, h)));
        this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(-w, -h), Point.ORIGIN.add(w, -h)));
        this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(w, -h), Point.ORIGIN.add(w, h)));
        this.gameObjects.add(new WallGameObject(Point.ORIGIN.add(w, h), Point.ORIGIN.add(-w, h)));
        // this.gameObjects.add(new WallGameObject(new Point(-10, 50), new Point(-10, -50), 3, Color.GREEN));
    }
}