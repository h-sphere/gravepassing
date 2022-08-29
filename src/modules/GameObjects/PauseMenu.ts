import { NewTexture } from "../Color/Texture";
import { KeyboardController } from "../Controller/KeyboardController";
import { Interruptable, Interruptor } from "../Interruptor/Interruptor";
import { Point, Rectangle, Line } from "../Primitives";
import { GameObject, GameObject, GameObjectGroup, Renderable } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { EmptyClass, withTags } from "./mixins";
import { TextGameObject, TextTexture } from "./TextModule";

export class PauseMenu extends withTags(EmptyClass) implements GameObject, Interruptable, NewTexture {
    pauseText = new TextTexture(["PAUSED"], 3, 1, 'rgba(0,0,0,0)');
    options = [
        new TextTexture(["Resume"], 4, 1, 'rgba(0,0,0,0)'),
        new TextTexture(["Change Difficulty: [HARD]"], 10, 1, 'rgba(0,0,0,0)')
    ]
    current = 0;
    newRender(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        console.log(x, y, w, h);
        ctx.fillStyle = "#101424";
        ctx.fillRect(x, y, w, h);
        const u = w / 10; // we know it's 10. - we can fix it later
        this.pauseText.newRender(ctx, u, u, 3*u, u);
        this.options.forEach((opt, i) => {
            if (this.current === i) {
                ctx.fillStyle = "rgba(30, 100, 40, 0.7)";
                ctx.fillRect(u, (2+i/2)*u, u*opt.w/2, u*opt.h/2);
            }
            opt.newRender(ctx, u, (2.1+i/2)*u, u*opt.w/2, u*opt.h/2);
        })
    }
    isHidden: boolean = false;
    parentBBExclude: boolean = false;
    center: Point = Point.ORIGIN;
    update(dt: number, container: GameObjectsContainer): void {
        console.log("UPDATING MENU?");
    }
    getBoundingBox(): Rectangle {
        return new Rectangle(Point.ORIGIN, new Point(10, 10));
    }
    zIndex?: number | undefined = 1000;
    isGlobal: boolean = true;
    next(): Promise<boolean> {
        // I THINK WE DONT NEED THAT AT ALL
        return Promise.reject();
    }
    controller?: KeyboardController;
    start(controller: KeyboardController): void {
        this.controller = controller;
    }
    hasEnded: boolean = false;
}