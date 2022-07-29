import { Camera } from "../Camera";
import { KeyboardController } from "../Controller/KeyboardController";
import { ArrayGameObjectsContainer } from "../GameObjects/ArrayContainer";
import { RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Point } from "../Primitives";

const MOVEMENT_VELOCITY = 5;
const ZOOM_SPEED = 1;

export class Game {
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private gameObjects: GameObjectsContainer;
    private controller: KeyboardController;
    private lastRenderTime: number;
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.camera = new Camera(this.ctx, canvas.width, canvas.height, new Point(50, 50));
        this.gameObjects = new ArrayGameObjectsContainer();
        this.gameObjects.add(new RenderablePoint(50, 50, 10, 'red'));
        this.gameObjects.add(new RenderableLine(new Point(50, 40), new Point(50, 60), 5, 'yellow'));
    }

    render() {
        const tDiff = Date.now() - this.lastRenderTime;
        this.camera.center.x += tDiff * MOVEMENT_VELOCITY * this.controller.x / 1000;
        this.camera.center.y += tDiff * MOVEMENT_VELOCITY * this.controller.y / 1000;
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