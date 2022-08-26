import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { getLinesIntersection } from "../../utils/math";
import { E } from "../Assets/Emojis";
import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { SIZE } from "../Color/Image";
import { CombinedEmoji, DirectionableTexture, Dither, Emoji, Ground, Sprite, SpriteWithLight } from "../Color/Sprite";
import { Texture, NewTexture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { Game } from "../Game";
import { UsableItem } from "../GameObjects/Bullet";
import { GameObject, RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { SimpleHumanoid } from "../GameObjects/Humanoid";
import { Light } from "../GameObjects/Light";
import { withLight, WithLightIface } from "../GameObjects/mixins";
import { RectangleObject } from "../GameObjects/Rectangle";
import { RenderableSquaredPoint } from "../GameObjects/SquaredPoint";
import { Line, Point, Rectangle } from "../Primitives";
import { SceneSettings } from "../Scene/Scene";
import { Renderer } from "./Renderer";

const MAIN_ZOOM_RANGE = 0.02; // points per pixel
const ZOOM_MAGNIFICATION_PER_VALUE = 0.1;

export class Renderer2d implements Renderer {

    private gridEnabled: boolean = false;
    private fpsEnable: boolean = false;
    private boundingBoxEnable: boolean  = false;

    private bb: Rectangle;

    private center: Point;

    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, private game: Game) {
        ctx.imageSmoothingEnabled = false;
    }

    getSizePerPixel() {
        return 1 / this.game.UNIT_SIZE;
        return 1 / 80;
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
        settings.ground.render(this.ctx, this.getBoundingBox(), settings, this.game); //this.ctx, point[0], point[1], point[0] + unitSize
        //, point[1] + unitSize);

        // this.ctx.fillStyle = 'rgb(20,20,20)'
        // this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // renderLine(line: RenderableLine, lights: Light[]) {
    //     const p1 = this.getPositionOnScreen(line.p1);
    //     const p2 = this.getPositionOnScreen(line.p2);
    //     let grd;

    //     if (line.color instanceof Color) {
    //         // grd = line.color;
    //         // Compute lights
    //         const l = line.color.l;

    //         if (this.debugLinePoints) {
    //             const onScreen = this.getPositionOnScreen(line.p1);
    //             this.ctx.beginPath();
    //             this.ctx.arc(onScreen[0], onScreen[1], 1, 0, 2 * Math.PI);
    //             this.ctx.fill();
    //             const onScreen2 = this.getPositionOnScreen(line.p2);
    //             this.ctx.beginPath();
    //             this.ctx.arc(onScreen2[0], onScreen2[1], 1, 0, 2 * Math.PI);
    //             this.ctx.fill();
    //         }

    //         grd = this.ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
    //         for(let i=0;i<=1;i+=0.02) {
    //             const point = line.getMidpoint(i);
    //             if (this.debugLinePoints) {
    //                 this.ctx.fillStyle = "white";
    //                 const onScreen = this.getPositionOnScreen(point);
    //                 this.ctx.beginPath();
    //                 this.ctx.arc(onScreen[0], onScreen[1], 1, 0, 2 * Math.PI);
    //                 this.ctx.fill();
    //             }
    //             grd.addColorStop(i, line.color
    //                 .withL(l * lightIntensityAtPoint(point, lights)).toString())
    //         }
    //         // grd.addColorStop(0, line.color
    //         //     .withL(l * lightIntensityAtPoint(line.p1, lights)).toString());
    //         // grd.addColorStop(0.5, line.color
    //         //     .withL(l * lightIntensityAtPoint(line.getMidpoint(0.5), lights)).toString())
    //         // grd.addColorStop(1, line.color
    //         //     .withL(l * lightIntensityAtPoint(line.p2, lights)).toString());
    //     } else {
    //         grd = line.color.render(this.ctx, p1[0], p1[1], p2[0], p2[1]);
    //         // FIXME: add lighting?
    //     }

    //     this.ctx.beginPath()
    //     this.ctx.lineWidth = line.width / this.getSizePerPixel() / 20;
    //     this.ctx.strokeStyle = grd;
    //     this.ctx.moveTo(...p1);
    //     this.ctx.lineTo(...p2);
    //     this.ctx.stroke();
    // }

    private renderRectangle(rect: RectangleObject, lights: Light[]) {
        const r = rect.getBoundingBox();
        this.ctx.beginPath();
        // const pattern = this.ctx.createPattern(image, repetition)

        // FIXME: with illumination.

        // DRAW BOUNDING BOX
        // rect.toLines().forEach(l => this.renderDebugLine(l));
        // rect.collisionBoundingBox()
        // .toLines()
        // .forEach(l => this.renderDebugLine(l, 'orange'));

        // rect.getBoundingBox()
        // .toLines()
        // .forEach(l => this.renderDebugLine(l, 'red'))


        const p1 = this.getPositionOnScreen(r.p1);
        const p2 = this.getPositionOnScreen(r.p2);
        if (rect.texture instanceof Emoji || rect.texture instanceof CombinedEmoji || rect.texture instanceof DirectionableTexture) {
            (rect.texture as NewTexture).newRender(this.ctx, ...p1, p2[0]-p1[0], p2[1]-p1[1]);

        } else {
            console.log(rect);
        }
        // if (rect.texture instanceof EmojiWithLight || rect.texture instanceof SpriteWithLight) {
        //     // FIXME: use withLight interface.
        //     const l1 = lightIntensityAtPoint(r.p1, lights);
        //     const l2 = lightIntensityAtPoint(r.p2, lights);
        //     rect.texture.setLight(l1, l2);
        // }


        // FIXME: ADD LIGHTING HERE.

        // /*this.ctx.fillStyle =*/ rect.texture.render(this.ctx, ...p1, ...p2);
        // const p = this.getPositionOnScreen(r.p1);
        // // this.ctx.moveTo(...this.getPositionOnScreen(r.p1));
        // // this.ctx.lineTo(...this.getPositionOnScreen(r.p1.add(r.width, 0)));
        // // this.ctx.lineTo(...this.getPositionOnScreen(r.p2));
        // // this.ctx.lineTo(...this.getPositionOnScreen(r.p1.add(0, r.height)));
        // this.ctx.fillRect(...p, r.width / this.getSizePerPixel(), r.height / this.getSizePerPixel());
        // // this.ctx.fill();
    }

    private resolveCircularColor(color: Texture, ctx, p: [number, number], r) {
        if (color instanceof ColorGradient) {
            return color.renderCircular(ctx, p[0], p[1], r);
        } else {
            return color.toString();
        }
    }

    // renderPoint(point: RenderablePoint) {
    //     const r = point.radius / this.getSizePerPixel();
    //     const p = this.getPositionOnScreen(point);
    //     this.ctx.beginPath();
    //     this.ctx.fillStyle = this.resolveCircularColor(point.color, this.ctx, p, r);
    //     this.ctx.arc(p[0], p[1], r, 0, 2 * Math.PI);
    //     this.ctx.fill();
    // }

    // renderSquarePoint(point: RenderableSquaredPoint, gameObjects: GameObjectsContainer) {
    //     // this.ctx.globalCompositeOperation = 'overlay';
    //     // const r = point.radius / this.getSizePerPixel();
    //     // const p = this.getPositionOnScreen(point);
    //     // this.ctx.fillStyle = this.resolveCircularColor(point.color, this.ctx, p, r);

    //     // const b = point.getBoundingBox();
    //     // for(let i=b.p1.x;i<=b.p2.x;i++) {
    //     //     for (let j=b.p1.y;j<=b.p2.y;j++) {
    //     //         this.ctx.fillStyle = 
    //     //     }
    //     // }
    //     // this.ctx.fillStyle = "red";

    //     // FIXME: filter properly.
    //     // const obstacles = gameObjects.getObjectsInArea(point.getBoundingBox(), TAG.OBSTACLE).map(o => o.toLines()).flat();
    //     // const points = point.getPolygonPoints(obstacles); //.map(p => p.round());
    //     // this.ctx.beginPath();
    //     // const initial = this.getPositionOnScreen(points[0]);
    //     // this.ctx.moveTo(...initial);
    //     // points.forEach((po) => {
    //     //     const pos = this.getPositionOnScreen(po);
    //     //     this.ctx.lineTo(pos[0], pos[1]);
    //     // });
    //     // this.ctx.fill();
    //     // this.ctx.globalCompositeOperation = 'source-over';
    // }

    renderGrid() {
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
                // console.log("Computing", i, j);
                // FIXME: light intensity with obstructions;
                // console.log('lights', lights);
                obstructions.forEach(x => {
                    this.renderDebugLine(x, 'red')
                })
                const lightsFiltered = lights.filter(l => {
                    const line = new Line(l.center, new Point(i + 0.5, j + 0.5));
                    if (l.isGlobal) {
                        return true;
                    }

                    // render helper line

                    // Is light obstructed
                    const find = obstructions.find(o => getLinesIntersection(o, line));
                    if (find) {
                        return false;
                    }
                    // this.renderDebugLine(line);
                    return true;
                })
                const l = lightIntensityAtPoint(new Point(i,j), lightsFiltered);
                // console.log(i,j,l);
                const d = this.game.sceneSettings.getDither(l);
                const pos = this.getPositionOnScreen(new Point(i,j));
                const pos2 = this.getPositionOnScreen(new Point(i+1,j+1));
                this.ctx.fillStyle = d.render(this.ctx, ...pos, ...pos2);
                this.ctx.fillRect(...pos, pos2[0] - pos[0], pos2[1] - pos[1]);
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


    render(camera: Camera, gameObjects: GameObjectsContainer, dt: number, game: Game) {
        this.center = camera.center;
        const boundingBox = this.getBoundingBox();
        this.bb = boundingBox;
        this.renderBackground(game.sceneSettings);
        if (this.gridEnabled) {
            this.renderGrid();
        }
        const objects = gameObjects.getObjectsInArea(boundingBox).sort((a, b) => (a.zIndex || 10) - (b.zIndex || 10));
        const obstructions = gameObjects.getObjectsInArea(boundingBox, TAG.OBSTACLE).map(o => o.toLines()).flat();
        const lights = objects.filter(o => o instanceof Light) as Light[];
        this.renderDitheredLight(lights, obstructions); 
        
        for (const obj of objects) {
                if (obj instanceof RectangleObject) {
                    this.renderRectangle(obj, lights);
                } else {
                    // console.log("UNKNOWN", obj);
                }

                // if (obj instanceof SimpleHumanoid || obj instanceof UsableItem) {
                //     obj.getBoundingBox().toLines().forEach(l => this.renderDebugLine(l, 'orange'));
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
            e.newRender(c, x + q + i*u/2, y + q/2, u, u);
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
            it.newRender(c, x + q + i * u/2+4*i, y + q / 2 + u, u, u);

            if (items.length > i) {
                items[i].icon.newRender(c, x + q + i * u/2+4*i, y + q / 2 + u, u, u);
            }
        }

        this.ctx.font = "16px Times New Roman";
        this.ctx.fillStyle = "white";

        this.ctx.fillText(game.player.xp + " xp", 6*u, y + 2*q);


        // GOAL LIGHT
        E.goal.top.newRender(this.ctx, 4.5*u, u/4, u, u);
        // E.goal.down.newRender(this.ctx, 4.5*u, 6.25*u, u, u);
        E.goal.left.newRender(this.ctx, u/4, 3*u, u, u);
        // E.goal.right.newRender(this.ctx, 8.5*u, 3*u, u, u);

    }

    postCanvas: HTMLCanvasElement;
    pattern: CanvasPattern;
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
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            const m = this.game.MULTIPLIER;
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, m, m);
            // ctx.fillRect(0, 0, m / 2, m / 2);
            // ctx.fillRect(m, m, -m/2, -m/2);
            // RENDERING HERE
            this.pattern = ctx.createPattern(this.postCanvas, "repeat")!;
        }
        this.ctx.fillStyle = this.pattern;
        this.ctx.fillRect(0, 0, this.width, this.height);

    }


    private fps: number[] = [];

    gatherFps(fps): number {
        this.fps = [fps, ...this.fps];
        if (this.fps.length > 100) {
            this.fps = this.fps.slice(0, 100);
        }
        return Math.floor(this.fps.reduce((a, b) => a + b) / this.fps.length);
    }
}