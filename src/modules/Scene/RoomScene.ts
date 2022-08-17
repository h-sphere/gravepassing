import { Color } from "../Color/Color";
import { Image } from "../Color/Image";
import { WallGameObject } from "../GameObjects/GameObject";
import { AmbientLight } from "../GameObjects/Light";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Point, Rectangle } from "../Primitives";
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

        const texture = new Image(160, 160);

        for(let i=0;i<100;i++) {
            this.gameObjects.add(new RectangleObject(
                new Rectangle(
                    Point.ORIGIN.add(-10 + i, -10),
                    Point.ORIGIN.add(-9 + i, -9)
                ), texture,
            ))
        }

        // this.gameObjects.add(new WallGameObject(new Point(-10, 50), new Point(-10, -50), 3, Color.GREEN));
    }
}