import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { KeyboardController } from "../Controller/KeyboardController";
import { ArrayGameObjectsContainer } from "../GameObjects/ArrayContainer";
import { RenderableLine, RenderablePoint, WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { Player } from "../GameObjects/Player";
import { Point } from "../Primitives";

const MOVEMENT_VELOCITY = 5;
const ROTATION_VELOCITY = Math.PI;
const ZOOM_SPEED = 1;

export class Game {
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private gameObjects: GameObjectsContainer;
    private controller: KeyboardController;
    private lastRenderTime: number;
    private player: Player;
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.camera = new Camera(this.ctx, canvas.width, canvas.height, new Point(50, 50));
        this.gameObjects = new ArrayGameObjectsContainer();
        this.gameObjects.add(new Light(Point.ORIGIN, 0.5, 10));
        this.gameObjects.add(new RenderablePoint(50, 50, 10, Color.RED));
        this.gameObjects.add(new RenderableLine(new Point(50, 40), new Point(50, 60), 5, new Color(54, 100, 50)));
        this.gameObjects.add(new WallGameObject(new Point(-20, -5), new Point(20, -10)));
        this.gameObjects.add(new WallGameObject(new Point(-30, -10), new Point(30, 0)));
        this.player = new Player();
        this.gameObjects.add(this.player);
        this.camera.setCenter(this.player.center);
    }

    render() {
        const tDiff = Date.now() - this.lastRenderTime;
        this.player.center.x += tDiff * MOVEMENT_VELOCITY * this.controller.x / 1000;
        this.player.center.y += tDiff * MOVEMENT_VELOCITY * this.controller.y / 1000;
        this.player.rotation += tDiff * ROTATION_VELOCITY * this.controller.rotation / 1000;
        this.player.updateObstacles(this.gameObjects.getObjectsWithTag(TAG.OBSTACLE));
        // this.camera.zoom = Math.max(0.1, this.camera.zoom + tDiff * ZOOM_SPEED * this.controller.wheel / 1000);
        this.camera.render(this.gameObjects);
        this.lastRenderTime = Date.now();
        requestAnimationFrame(() => this.render());
    }

    start() {
        this.controller = new KeyboardController();
        console.log('Start Game');
        this.lastRenderTime = Date.now();
        this.render();
        
    }
}