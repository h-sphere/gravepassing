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
import { LightingScene } from "../Scene/LightingScene";
import { CementeryScene } from "../Scene/CementeryScene";
import { Scene, SceneSettings } from "../Scene/Scene";
import { SIZE } from "../Color/Image";
import { LabScene } from "../Scene/LabScene";
import { HellScene } from "../Scene/HellScene";
import { HubScene } from "../Scene/HubScene";
import { InterGO, Interruptor } from "../Interruptor/Interruptor";
import { BombCollectableItem, Item } from "../GameObjects/Item";

const ZOOM_SPEED = 1;

export class Game {
    private ctx!: CanvasRenderingContext2D;
    private camera: Camera;
    public gameObjects: GameObjectsContainer;
    private renderer: Renderer2d;
    private lastRenderTime: number = 0;
    public player: Player;

    public sceneSettings: SceneSettings;
    public MULTIPLIER = 1;
    public UNIT_SIZE = 1;

    public settings = {
        difficulty: 2,
        post: false,
    }

    public interruptorManager: Interruptor = new Interruptor();

    currentScene?: Scene;

    constructor(private canvas: HTMLCanvasElement, private w: number, h: number) {

        const fn = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            this.MULTIPLIER = Math.floor(Math.min(windowWidth, windowHeight) / (w * SIZE));
            this.UNIT_SIZE = SIZE * this.MULTIPLIER
            this.canvas.width = SIZE * w * this.MULTIPLIER;
            this.canvas.height = SIZE * h * this.MULTIPLIER;
            this.ctx = canvas.getContext('2d')!;
        };
        fn();
        // window.onresize = fn;

        this.restart();
        this.loadScene(new CementeryScene());
        try {
            this.settings = JSON.parse(window.localStorage.getItem('hsph_set') || '');
        } catch (e) {
        }
    }

    loadScene(scene: Scene, withRestart: boolean = false) {
        if (this.currentScene) {
            this.currentScene.stopMusic();
        }

        if (withRestart) {
            this.restart();
        }

        this.sceneSettings = scene.register(this.gameObjects, this);
        this.currentScene = scene;
        this.player.center = this.sceneSettings.pCenter;
        this.objective = undefined;
    }

    objective?: Item;

    setObjective(c: Item) {
        this.objective = c;
    }

    currentStage = 0;

    restart() {
        this.camera = new Camera(this.ctx);
        this.gameObjects = new QuadTreeContainer();
        this.renderer = new Renderer2d(this.ctx, this.canvas.width, this.canvas.height, this);

        this.player = new Player();
        this.player.setGame(this); // FIXME: do it properly maybe?
        this.gameObjects.add(this.player);
        this.camera.follow(this.player);
        this.renderer.setCamera(this.camera);
        this.currentStage = 0;
    }

    render() {

        const stgI = this.currentStage;
        if (stgI < this.sceneSettings.stages.length) {

            const stg = this.sceneSettings.stages[stgI];
            if (stg.lvl <= this.player.lvl) {
                console.log("PROGRESSING TO NEXT STAGE");
                this.currentStage++;
                stg.res(this);
            }
        }
        
        const tDiff = Date.now() - this.lastRenderTime;
        this.interruptorManager.update(this.player.controller, this);
        if (this.interruptorManager.isRunning) {
            this.interruptorManager.updateInter(tDiff);
            this.gameObjects.update();
            this.renderer.render(this.camera, this.gameObjects, tDiff, this);
            this.renderer.renderInterruptorManager(this.interruptorManager);
        } else {
            this.gameObjects.getAll().forEach(g => {
                g.update(tDiff, this.gameObjects);
            });
    
            this.gameObjects.update();
    
            this.renderer.render(this.camera, this.gameObjects, tDiff, this);
        }
        

        // this.qtRender.renderQuadtree((this.gameObjects as unknown as QuadTreeContainer).tree);
        this.lastRenderTime = Date.now(); // time still marches on tho.
        requestAnimationFrame(() => this.render());
    }

registerInterruptor(i: InterGO) {
    this.interruptorManager.add(i);
}

    start() {
        console.log('Start Game');
        this.lastRenderTime = Date.now();
        this.render();
        
    }
}