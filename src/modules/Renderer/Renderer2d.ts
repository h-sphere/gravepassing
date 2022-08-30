import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { getLinesIntersection } from "../../utils/math";
import { E } from "../Assets/Emojis";
import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { TAG } from "../constants/tags";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { Interruptor } from "../Interruptor/Interruptor";
import { Line, Point, Rectangle } from "../Primitives";
import { SceneSettings } from "../Scene/Scene";
import { Renderer } from "./Renderer";

export class Renderer2d implements Renderer {

    private gridEnabled: boolean = false;
    private fpsEnable: boolean = false;
    private boundingBoxEnable: boolean  = false;

    private bb!: Rectangle;

    private center!: Point;

    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, private game: Game) {
        ctx.imageSmoothingEnabled = false;
    }

    getSizePerPixel() {
        return 1 / this.game.UNIT_SIZE;
    }

    getUnitSize() {
        return 1 / this.getSizePerPixel();
    }

    getUnits() {
        return this.width / this.getUnitSize();
    }

    private getBoundingBox(): Rectangle {
        const sizePerPixel = this.getSizePerPixel();
        return new Rectangle(
            new Point(
                this.center.x - (this.width / 2) * sizePerPixel,
                this.center.y - (this.height / 2) * sizePerPixel
            ),
            new Point(
                this.center.x + (this.width / 2) * sizePerPixel,
                this.center.y + (this.width / 2) * sizePerPixel,
            )
        );
    }

    getPositionOnScreen(p: Point): [number, number] {
        const x = (this.center.x - p.x)
        const y = (this.center.y - p.y);
        const ySizePerPixel = this.getSizePerPixel();
        const xSizePerPixel = this.getSizePerPixel();

        return [
            this.width / 2 - x / xSizePerPixel,
            this.height / 2 - y / ySizePerPixel,
        ];
    }

    private renderBackground(settings: SceneSettings) {

        this.ctx.clearRect(0, 0, this.width, this.height);

        const point = this.getPositionOnScreen(new Point(Math.floor(this.bb.p1.x), Math.floor(this.bb.p1.y)));
        const unitSize = 1 / this.getSizePerPixel();
        settings.ground.render(this.ctx, this.getBoundingBox(), settings, this.game);
    }

    renderDitheredLight(lights: Light[], obstructions: Line[]) {
        const bb = this.getBoundingBox();
        // FIXME: use proper bb function.
        for(let i=bb.p1.x;i<=bb.p2.x;i++) {
            for(let j=bb.p1.y;j<=bb.p2.y;j++) {
                const lightsFiltered = lights.filter(l => {
                    const line = new Line(l.center, new Point(i + 0.5, j + 0.5));
                    if (l.isGlobal) {
                        return true;
                    }

                    // Is light obstructed
                    const find = obstructions.find(o => getLinesIntersection(o, line));
                    if (find) {
                        return false;
                    }
                    return true;
                });

                const p = new Point(i,j);

                const pos = this.getPositionOnScreen(p);
                const w = this.getUnitSize();
                const h = this.getUnitSize();
                
                // Extra colouring
                lightsFiltered.forEach(l => {
                    if (l.color!== "#FFF") {
                        this.ctx.globalCompositeOperation = "overlay"
                        this.ctx.globalAlpha = lightIntensityAtPoint(new Point(i, j), [l]);
                        this.ctx.fillStyle = l.color;
                        this.ctx.fillRect(...pos, w, h);
                    }
                });
                this.ctx.globalCompositeOperation = "source-over";
                this.ctx.globalAlpha = 1;
                const l = lightIntensityAtPoint(new Point(i,j), lightsFiltered);
                const d = this.game.sceneSettings.getDither(l);
                d.render(this.ctx, ...pos, w, h);
            }
        }
    }

    renderDebugLine(line: Line, color = 'white') {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(...this.getPositionOnScreen(line.p1));
        this.ctx.lineTo(...this.getPositionOnScreen(line.p2));
        this.ctx.stroke();
    }
    camera!: Camera;

    setCamera(camera: Camera) {
        this.camera = camera;
        this.center = camera.center;
    }

    prepareFrame() {
        this.center = this.camera.center;
        const boundingBox = this.getBoundingBox();
        this.bb = boundingBox;
    }

    render(camera: Camera, gameObjects: GameObjectsContainer, dt: number, game: Game) {
        this.prepareFrame();
        this.renderBackground(game.sceneSettings);
        const objects = gameObjects.getObjectsInArea(this.bb)
        .sort((a,b) => {
            if (a.isGlobal) {
                return 1;
            }
            if (b.isGlobal) {
                return -1;
            }
            return a.getBoundingBox().center.y-b.getBoundingBox().center.y
         });
        const obstructions = gameObjects.getObjectsInArea(this.bb, TAG.OBSTACLE).map(o => o.getBoundingBox().toLines()).flat();
        const lights = objects.filter(o => o instanceof Light) as Light[];
        this.renderDitheredLight(lights, obstructions); 
        
        for (const obj of objects) {

            obj.render(
                this.ctx,
                this.bb,
                (p: Point) => this.getPositionOnScreen(p)
            );
                // if (this.boundingBoxEnable) {
                //     this.ctx.strokeStyle = "rgba(255,0,0,0.6)";
                //     this.ctx.lineWidth = 1;
                //     const bb = obj.getBoundingBox();
                //     const p = this.getPositionOnScreen(bb.p1);
                //     const p2 = this.getPositionOnScreen(bb.p2);
                //     this.ctx.strokeRect(p[0], p[1], p2[0] - p[0], p2[1] - p[1]);
                // }
        }
        this.renderHUD(game);
        this.renderPostEffects();
    }

    renderHUD(game: Game) {
        // FIXME: should it be separate GO?
        const u = this.getUnitSize();
        const c = this.ctx;
        const x = u / 4;
        const y = (this.getUnits() - 2) * u - x;
        const q = u / 4;
        c.strokeStyle = game.sceneSettings.hudBackground || "#1a403b";
        c.fillStyle = c.strokeStyle;
        c.lineWidth = 5;
        c.fillRect(x + q/2, y + q/2, this.getUnitSize() * (this.getUnits() - 0.75), this.getUnitSize() * 1.75);
        c.strokeRect(x, y, this.getUnitSize() * (this.getUnits() - 0.5), this.getUnitSize() * 2);


        let health = game.player.life;
        for(let i=0;i<5;i+=1) {
            let e = E.health;
            if (i >= health) {
                e = E.healthOff;
            }
            e.render(c, x + q + i*u/2, y + q/2, u, u);
        }

        const items = game.player.items;
        const current = game.player.selected;

        // item slots
        for(let i=0;i<8;i++) {
            c.fillStyle = "rgba(0,0,0,0.3)";
            if (i===current) {
                c.fillStyle = 'rgba(0,0,0,1)';
            }
            c.lineWidth = 5;
            c.fillRect(x + q + i * u/2+4*i, y + q / 2 + u, u/2, u/2);
            let it = E.itemBgOff;

            if (i === current) {
                it = E.itemBg;
            }
            it.render(c, x + q + i * u/2+4*i, y + q / 2 + u, u, u);

            if (items.length > i) {
                items[i].icon.render(c, x + q + i * u/2+4*i, y + q / 2 + u, u, u);
            }
        }

        this.ctx.font = "16px Times New Roman";
        this.ctx.fillStyle = "white";

        const text = game.player.xpTexture;
        const lvlText = game.player.lvlTexture;
        text.render(this.ctx, 6*u, y+2*q, u, u/2);
        lvlText.render(this.ctx, 9*u-u/4, y+2*q, u, u/2);

        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        const wid = 1.5*u
        this.ctx.fillRect(7*u, y+2.5*q, wid, q/4);
        this.ctx.fillStyle = "rgb(30, 30, 200)"
        this.ctx.fillRect(7*u, y+2.5*q,wid*game.player.lvlProgress, q/4);

        if(game.objective) {
            const xDiff = game.objective.center.x - game.player.center.x ;
            const yDiff =  game.objective.center.y - game.player.center.y;
            console.log('diffz', xDiff, yDiff);
            if (Math.abs(xDiff) > 5) {
                if (xDiff < 0) {
                    E.goal.left.render(this.ctx, u/4, 3*u, u, u);
                } else {
                    E.goal.right.render(this.ctx, 8.5*u, 3*u, u, u);

                }
            }

            if (Math.abs(yDiff) > 5) {
                if (yDiff < 0) {
                    E.goal.top.render(this.ctx, 4.5*u, u/4, u, u);
                } else {
                    E.goal.down.render(this.ctx, 4.5*u, 6.25*u, u, u);

                }
            }
        }
    }

    postCanvas!: HTMLCanvasElement;
    pattern!: CanvasPattern;

    renderInterruptorManager(man: Interruptor) {
        this.prepareFrame();
        man.render(this.ctx, this.bb, (p: Point) => this.getPositionOnScreen(p));
    }
    
    renderPostEffects() {
        if (this.game.MULTIPLIER < 2) {
            // NO SPACE FOR POST PROCESSING
            return;
        }

        if (!this.game.settings.post) {
            return;
        }

        if (!this.postCanvas) {
            this.postCanvas = document.createElement('canvas');
            this.postCanvas.width = this.game.MULTIPLIER;
            this.postCanvas.height = this.game.MULTIPLIER;
            const ctx = this.postCanvas.getContext('2d')!;
            const m = this.game.MULTIPLIER;
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0,  m / 3, m);
            ctx.fillStyle = "green";
            ctx.fillRect(m/3, 0, m/3, m);
            ctx.fillStyle = "blue";
            ctx.fillRect(2*m/3, 0, m/3, m);
            // ctx.fillRect(0, 0, m / 2, m / 2);
            // ctx.fillRect(m, m, -m/2, -m/2);
            // RENDERING HERE

            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, m, m);

            this.pattern = ctx.createPattern(this.postCanvas, "repeat")!;
        }
        this.ctx.globalAlpha = 0.1;
        this.ctx.globalCompositeOperation = "xor";
        this.ctx.fillStyle = this.pattern;
        this.ctx.fillRect(0, 0, this.width, this.height);



        this.ctx.globalAlpha = 0.1;
        this.ctx.globalCompositeOperation = "color-burn";
        this.ctx.fillStyle = this.pattern;
        this.ctx.fillRect(0, 0, this.width, this.height);


        this.ctx.globalAlpha = 0.2;
        this.ctx.globalCompositeOperation = "luminosity";
        this.ctx.fillStyle = this.pattern;
        this.ctx.fillRect(0, 0, this.width, this.height);
        


        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.globalAlpha = 1;
    }
}