import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { getLinesIntersection } from "../../utils/math";
import { E } from "../Assets/Emojis";
import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { CombinedEmoji, DirectionableTexture, Emoji, } from "../Color/Sprite";
import { NewTexture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { Game } from "../Game";
import { UsableItem } from "../GameObjects/Bullet";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { PauseMenu } from "../GameObjects/PauseMenu";
import { RectangleObject } from "../GameObjects/Rectangle";
import { TextTexture } from "../GameObjects/TextModule";
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
        const minX = this.bb.p1.x;
        const midX = this.center.x;
        const maxY = this.bb.p1.y;
        const minY = this.bb.p2.y;
        const x = (this.center.x - p.x)
        const y = (this.center.y - p.y);
        // const y2 = y - (maxY - p.y) * (maxY - p.y) * 0.01; // Math.abs(x) * 0.25 * Math.abs(y);
        // const x2 = x - (maxY - p.y) * (midX - p.x) * 0.02;
        // const xSizePerPixel = this.getSizePerPixel() / (Math.abs(maxY - p.y) / 10);
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
        // const color = settings.backgroundColor || '#1d4d36';
        settings.ground.render(this.ctx, this.getBoundingBox(), settings, this.game);
    }

    // private renderRectangle(rect: RectangleObject, lights: Light[]) {
    //     // THIS SHOULD NOT KNOW ANYTHING ABOUT THE TEXTURE. IT SHOULD BE RECTANGLE THAT CALLS TEXTURE ITSELF.
    //     if (rect.isHidden) {
    //         return;
    //     }
    //     const r = rect.getBoundingBox();
    //     this.ctx.beginPath();

    //     let p1 = this.getPositionOnScreen(r.p1);
    //     let p2 = this.getPositionOnScreen(r.p2);

    //     if (rect.isGlobal) {
    //         // Displaying in screenc coordinates
    //         p1 = this.getPositionOnScreen(this.bb.p1.add(r.p1.x, r.p1.y));
    //         p2 = this.getPositionOnScreen(this.bb.p1.add(r.p2.x, r.p2.y));
    //     }

    //     if (
    //         rect.texture instanceof Emoji ||
    //         rect.texture instanceof CombinedEmoji ||
    //         rect.texture instanceof DirectionableTexture ||
    //         rect.texture instanceof TextTexture
    //         )
    //          {
    //         (rect.texture as NewTexture).newRender(this.ctx, ...p1, p2[0]-p1[0], p2[1]-p1[1]);

    //     } else {
    //         console.log(rect);
    //     }
    // }

    renderGrid() {
        // FIXME: this can be removed probably.
        const rect = this.getBoundingBox();
        for (let i = Math.ceil(rect.p1.x); i <= rect.p2.x; i++) {
            for (let j = Math.ceil(rect.p1.y); j <= rect.p2.y; j++) {
                this.ctx.beginPath();
                const [x, y] = this.getPositionOnScreen(new Point(i, j));
                this.ctx.fillStyle = '#555';
                this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    renderFps(fps: number) {
        this.ctx.fillStyle = "#FFF";
        const text = `${Math.floor(fps)} fps`;
        this.ctx.font = "20px Papyrus";
        const size = this.ctx.measureText(text);
        this.ctx.fillText(text, this.width - size.width - 20, 20 + size.fontBoundingBoxAscent);
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
                    if (l.color.render() !== Color.WHITE.render()) {
                        this.ctx.globalCompositeOperation = "overlay"
                        this.ctx.globalAlpha = lightIntensityAtPoint(new Point(i, j), [l]);
                        this.ctx.fillStyle = l.color.render();
                        this.ctx.fillRect(...pos, w, h);
                    }
                });
                this.ctx.globalCompositeOperation = "source-over";
                this.ctx.globalAlpha = 1;
                const l = lightIntensityAtPoint(new Point(i,j), lightsFiltered);
                const d = this.game.sceneSettings.getDither(l);
                this.ctx.fillStyle = d.render(this.ctx, ...pos, w, h);
                this.ctx.fillRect(...pos, w, h);
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

    renderPauseMenu(obj: PauseMenu) {
        // FIXME: just use regular renderer.
        console.log("RENDER PAUSE MENU");
        const r = obj.getBoundingBox();
        
        let p1 = this.getPositionOnScreen(r.p1);
        let p2 = this.getPositionOnScreen(r.p2);
        if (obj.isGlobal) {
            // Displaying in screenc coordinates
            p1 = this.getPositionOnScreen(this.bb.p1.add(r.p1.x, r.p1.y));
            p2 = this.getPositionOnScreen(this.bb.p1.add(r.p2.x, r.p2.y));
        }

        obj.newRender(this.ctx, ...p1, p2[0]-p1[0], p2[1]-p1[1]);
    }


    render(camera: Camera, gameObjects: GameObjectsContainer, dt: number, game: Game) {
        this.center = camera.center;
        const boundingBox = this.getBoundingBox();
        this.bb = boundingBox;
        this.renderBackground(game.sceneSettings);
        if (this.gridEnabled) {
            this.renderGrid();
        }
        const objects = gameObjects.getObjectsInArea(boundingBox)
        .sort((a,b) => {
            if (a.isGlobal) {
                return 1;
            }
            if (b.isGlobal) {
                return -1;
            }
            return a.getBoundingBox().center.y-b.getBoundingBox().center.y
         });
        const obstructions = gameObjects.getObjectsInArea(boundingBox, TAG.OBSTACLE).map(o => o.getBoundingBox().toLines()).flat();
        const lights = objects.filter(o => o instanceof Light) as Light[];
        this.renderDitheredLight(lights, obstructions); 
        
        for (const obj of objects) {

            obj.render(
                this.ctx,
                this.bb,
                (p: Point) => this.getPositionOnScreen(p)
            );

                // if (obj instanceof RectangleObject) {
                //     this.renderRectangle(obj, lights);
                // } if (obj instanceof PauseMenu) {
                //     this.renderPauseMenu(obj);
                // } else {
                //     // console.log("UNKNOWN", obj);
                // }

                if (this.boundingBoxEnable) {
                    this.ctx.strokeStyle = "rgba(255,0,0,0.6)";
                    this.ctx.lineWidth = 1;
                    const bb = obj.getBoundingBox();
                    const p = this.getPositionOnScreen(bb.p1);
                    const p2 = this.getPositionOnScreen(bb.p2);
                    this.ctx.strokeRect(p[0], p[1], p2[0] - p[0], p2[1] - p[1]);
                }

            
        }

        if (this.fpsEnable) {
            this.renderFps(this.gatherFps(1000 / dt));
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
        

        // GOAL LIGHT
        E.goal.top.render(this.ctx, 4.5*u, u/4, u, u);
        // E.goal.down.newRender(this.ctx, 4.5*u, 6.25*u, u, u);
        E.goal.left.render(this.ctx, u/4, 3*u, u, u);
        // E.goal.right.newRender(this.ctx, 8.5*u, 3*u, u, u);

    }

    postCanvas!: HTMLCanvasElement;
    pattern!: CanvasPattern;
    renderPostEffects() {
        if (this.game.MULTIPLIER < 2) {
            // NO SPACE FOR POST PROCESSING
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


    private fps: number[] = [];

    gatherFps(fps: number): number {
        // FIXME: to be removed.
        this.fps = [fps, ...this.fps];
        if (this.fps.length > 100) {
            this.fps = this.fps.slice(0, 100);
        }
        return Math.floor(this.fps.reduce((a, b) => a + b) / this.fps.length);
    }
}