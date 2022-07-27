import { Camera } from "../Camera";
import { KeyboardController } from "../Controller/KeyboardController";
import { ArrayGameObjectsContainer } from "../GameObjects/ArrayContainer";
import { RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Point } from "../Primitives";

export class Game {
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private gameObjects: GameObjectsContainer
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.camera = new Camera(this.ctx, canvas.width, canvas.height, new Point(50, 50));
        this.gameObjects = new ArrayGameObjectsContainer();
        this.gameObjects.add(new RenderablePoint(50, 50, 10, 'red'));
        this.gameObjects.add(new RenderableLine(new Point(50, 40), new Point(50, 60), 5, 'yellow'));
        this.attachController();
    }

    attachController() {
        const velocity = 1;
        const controller = new KeyboardController();
        controller.on('x', (d: number) => this.camera.center.x += velocity * d);
        controller.on('y', d => {
            this.camera.center.y += velocity * d
        });
        controller.attach();
    }

    start() {
        console.log('Start Game');
        setInterval(() => {
            this.camera.render(this.gameObjects);
        }, 100);
    }
}