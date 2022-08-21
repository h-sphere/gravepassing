import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { KeyboardController } from "../Controller/KeyboardController";
import { ArrayGameObjectsContainer } from "../GameObjects/ArrayContainer";
import { RenderableLine, RenderablePoint, WallGameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { GameObject } from "../GameObjects/GameObject";
import { AmbientLight, Light } from "../GameObjects/Light";
import { Player } from "../GameObjects/Player";
import { Point, Rectangle } from "../Primitives";
import { Renderer } from "../Renderer/Renderer";
import { Renderer2d } from "../Renderer/Renderer2d";
import { MovingLight } from "../Special/MovingLight";
import { QuadTree } from "../../utils/QuadTree";
import { QuadTreeRenderer } from "../../utils/QuadTreeRenderer";
import { QuadTreeContainer } from "../GameObjects/QuadTreeContainer";
import { FirstScene } from "../Scene/FirstScene";
import { LightingScene } from "../Scene/LightingScene";
import { RoomScene } from "../Scene/RoomScene";
import { Scene } from "../Scene/Scene";
import { IsometricRenderer } from "../Renderer/IsometricRenderer";
import { SIZE } from "../Color/Image";

const ZOOM_SPEED = 1;

export class Game {
    private ctx: CanvasRenderingContext2D;
    private camera: Camera;
    private gameObjects: GameObjectsContainer;
    private controller: KeyboardController;
    private renderer: Renderer;
    private lastRenderTime: number;
    public player: Player;

    private qtRender: QuadTreeRenderer;

    constructor(private canvas: HTMLCanvasElement, private w: number, h: number) {
        // const w = window.innerWidth;
        // const h = window.innerHeight;
        this.ctx = canvas.getContext('2d')!;
        this.canvas.width = SIZE * w * 5;
        this.canvas.height = SIZE * h * 5;
        this.camera = new Camera(this.ctx);
        this.gameObjects = new QuadTreeContainer();
        this.renderer = new Renderer2d(this.ctx, canvas.width, canvas.height);

        // const light = new MovingLight(Point.ORIGIN.add(5, 5), 0.2, 15, Color.YELLOW, new Point(50, 0), 10);
        // this.gameObjects.add(light);
        // this.gameObjects.add(new AmbientLight(0.4));
        // this.gameObjects.add(new RenderablePoint(50, 50, 10, Color.RED));
        // this.gameObjects.add(new RenderableLine(new Point(50, 40), new Point(50, 60), 5, new Color(54, 100, 50)));
        // this.gameObjects.add(new WallGameObject(new Point(-20, -5), new Point(20, -10)));
        // this.gameObjects.add(new WallGameObject(new Point(-30, -10), new Point(30, 0)));
        // this.gameObjects.add(new WallGameObject(new Point(2, 2), new Point(10, 3), 3, Color.GREEN));
        // this.gameObjects.add(new WallGameObject(new Point(-4, 8), new Point(0, 0.01), 3, Color.BLUE));
        // for(let i=0;i<200;i++) {
        //     this.gameObjects.add(new WallGameObject(
        //         new Point(Math.random() * 200 - 100, Math.random() * 200 - 100),
        //         new Point(Math.random() * 200 - 100, Math.random() * 200 - 100)
        //     ));
        // }

        const scene = new RoomScene();
        scene.register(this.gameObjects);

        this.player = new Player();
        this.gameObjects.add(this.player);
        this.gameObjects.add(this.player.light);
        this.gameObjects.add(this.player.go); // fixme.
        this.camera.follow(this.player);

        // this.qtRender = new QuadTreeRenderer(document.querySelector<HTMLCanvasElement>('#quadtreevis')!);
    }

    render() {
        const tDiff = Date.now() - this.lastRenderTime;
        
        this.gameObjects.getAll().forEach(g => {
            g.update(tDiff, this.gameObjects);
        });

        this.gameObjects.update();

        // this.camera.zoom = Math.max(0.1, this.camera.zoom + tDiff * ZOOM_SPEED * this.controller.wheel / 1000);
        this.renderer.render(this.camera, this.gameObjects, tDiff, this);
        this.lastRenderTime = Date.now();

        // this.qtRender.renderQuadtree((this.gameObjects as unknown as QuadTreeContainer).tree);

        requestAnimationFrame(() => this.render());
    }

    start() {
        this.controller = new KeyboardController();
        console.log('Start Game');
        this.lastRenderTime = Date.now();
        this.render();
        
    }
}