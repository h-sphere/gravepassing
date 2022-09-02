import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { getLinesIntersection } from "../../utils/math";
import { E } from "../Assets/Emojis";
import { AudioManager } from "../Audio/AudioManager";
import { Camera } from "../Camera";
import { Dither } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Game } from "../Game";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { TextGameObject } from "../GameObjects/TextModule";
import { Interruptor } from "../Interruptor/Interruptor";
import { Line, Point, Rectangle } from "../Primitives";
import { SceneSettings } from "../Scene/Scene";
import { Renderer } from "./Renderer";

export class Renderer2d implements Renderer {
    private bb!: Rectangle;
    private center!: Point;
    constructor(private ctx: CanvasRenderingContext2D, private game: Game) {}

    get width() {
        return this.game.width;
    }

    get height() {
        return this.game.height;
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
        const s = this.getSizePerPixel();
        return new Rectangle(
            new Point(
                this.center.x - (this.width / 2) * s,
                this.center.y - (this.height / 2) * s
            ),
            new Point(
                this.center.x + (this.width / 2) * s,
                this.center.y + (this.width / 2) * s,
            )
        );
    }

    getPositionOnScreen(p: Point): [number, number] {
        const x = (this.center.x - p.x)
        const y = (this.center.y - p.y);
        const ys = this.getSizePerPixel();
        const xs = this.getSizePerPixel();

        return [
            this.width / 2 - x / xs,
            this.height / 2 - y / ys,
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
                    return !find;
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

    renderDebugLine(line: Line, color = '#FFF') {
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
        }
        this.renderHUD(game);
        this.renderPostEffects();
    }


    introTime = 0;
    playedIntroMusic = false;
    introText = new TextGameObject(["GRAVEPASSING"], new Point(2, 0), 8, 2, false, "","#FFF", 20);
    author = new TextGameObject(["by Kacper Kula", "", "with the help of Rae Lee"], new Point(10, 0), 8, 3, false, "","#FFF", 10);
    pressAnyKey = new TextGameObject(["Press [Space]"], new Point(3, 8), 8, 3, false, "", "#FFF", 10);
    keyPressed = false;
    dit = Dither.gD(48, 20, [2,19,13]);
    renderIntro(dt: number) {
        this.dit = Dither.gD(120, Math.min(70, Math.floor(20 + this.introTime / 50)),[2,19,13]);
        this.ctx.fillStyle = '#053021';
        this.ctx.fillRect(0, 0, this.width, this.height);
        for(let i=0;i<10;i++) {
            for(let j=0;j<10;j++) {
                this.dit.render(this.ctx, i*this.getUnitSize(), j*this.getUnitSize(), this.getUnitSize(), this.getUnitSize());
            }
        }

        if (!this.keyPressed) {
            this.pressAnyKey.render(this.ctx, this.getBoundingBox(), (p) => this.getPositionOnScreen(p));
            this.keyPressed = !!this.game.player.controller.v.f;
            return true;
        }
        this.introTime += dt;

        this.introText.render(this.ctx, this.getBoundingBox(), (p) => this.getPositionOnScreen(p));
        const p = new Point(2, Math.min(3, this.introTime / 300));
        this.introText.rectangle.moveTo(p);
        if (p.y >= 3) {
            if (!this.playedIntroMusic) {
                AudioManager.get().intro.play();
                this.playedIntroMusic = true;
            }
            const r = new Point(2, Math.max(8, 10-(this.introTime-800)/200));
            this.author.rectangle.moveTo(r);
            this.author.render(this.ctx, this.getBoundingBox(), (p) => this.getPositionOnScreen(p));
        }
        if (this.introTime > 3500) {
            return false;
        }
        return true;
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
            c.fillStyle = "#000A";
            if (i===current) {
                c.fillStyle = '#090F';
            }
            c.lineWidth = 5;
            c.fillRect(x + q + i * u/2+4*i, y + q / 2 + u, u/2, u/2);

            if (items.length > i) {
                items[i].icon.render(c, x + q + i * u/2+4*i, y + q / 2 + u, u, u);
            }
        }

        this.ctx.font = "16px";
        this.ctx.fillStyle = "white";

        const text = game.player.xpTexture;
        const lvlText = game.player.lvlTexture;
        text.render(this.ctx, 3*u, y+q, 2*u, u/2);
        lvlText.render(this.ctx, 8.5*u-u/4, y+q, 1.5*u, u/2);

        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        const wid = 3.5*u
        this.ctx.fillRect(4.5*u, y+2*q, wid, q/2);
        this.ctx.fillStyle = "rgb(30, 30, 200)"
        this.ctx.fillRect(4.5*u, y+2*q,wid*game.player.lvlProgress, q/2);


        if (this.game.controller.gamepad) {
            E.controller.render(this.ctx, 9*u, 9*u, u/2, u/2)
        } else {
            E.keyboard.render(this.ctx, 9*u, 9*u, u/2, u/2)
        }

        if(game.objective) {
            const xDiff = game.objective.center.x - game.player.center.x ;
            const yDiff =  game.objective.center.y - game.player.center.y;
            if (Math.abs(xDiff) > 5) {
                if (xDiff < 0) {
                    E.goal.l.render(this.ctx, u/4, 3*u, u, u);
                } else {
                    E.goal.r.render(this.ctx, 8.5*u, 3*u, u, u);

                }
            }

            if (Math.abs(yDiff) > 5) {
                if (yDiff < 0) {
                    E.goal.u.render(this.ctx, 4.5*u, u/4, u, u);
                } else {
                    E.goal.d.render(this.ctx, 4.5*u, 6.25*u, u, u);

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


        // this.ctx.globalAlpha = 0.2;
        // this.ctx.globalCompositeOperation = "luminosity";
        // this.ctx.fillStyle = this.pattern;
        // this.ctx.fillRect(0, 0, this.width, this.height);
        


        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.globalAlpha = 1;
    }
}