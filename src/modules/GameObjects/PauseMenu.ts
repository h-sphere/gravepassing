import { TRANSPARENT } from "../../utils/colors";
import { KeyboardController } from "../Controller/KeyboardController";
import { Game } from "../Game";
import { Interruptable } from "../Interruptor/Interruptor";
import { Point, Rectangle } from "../Primitives";
import { GameObject, GetPosFn } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { EmptyClass, withTags } from "./mixins";
import { TextTexture } from "./TextModule";

const difficultyToString = (d: number): string => {
    if (d === 0) {
        return "EASY";
    } else if (d === 1) {
        return "NORMAL"
    } else {
        return "HARD"; 
    }
}

const diffText = (d: number) => "Change difficulty [" + difficultyToString(d) + "]";

const post = "Post-processing";

export class PauseMenu extends withTags(EmptyClass) implements GameObject, Interruptable {
    pauseText = new TextTexture(["PAUSED"], 3, 1, TRANSPARENT);
    options = [
        new TextTexture(["Resume"], 10, 1, TRANSPARENT),
        new TextTexture([diffText(2)], 10, 1, TRANSPARENT),
        new TextTexture([], 10, 1, TRANSPARENT),
        new TextTexture(["Fullscreen"], 10, 1, TRANSPARENT),
    ]
    current = 0;
    private ctx?: CanvasRenderingContext2D;
    render(ctx: CanvasRenderingContext2D, bb: Rectangle, fn: GetPosFn) {
        this.ctx = ctx;
        ctx.fillStyle = "#000A";
        const width = fn(bb.p2)[0];
        const u = width / 10;
        ctx.fillRect(0, 0, width, width);
        this.pauseText.render(ctx, u, u, this.pauseText.w*u/2, u*this.pauseText.h/2);
        this.options.forEach((opt, i) => {
            if (this.current === i) {
                ctx.fillStyle = "rgba(30, 100, 40, 0.7)";
                ctx.fillRect(u, (2+i/2)*u, u*opt.w/2, u*opt.h/2);
            }
            opt.render(ctx, u, (2+i/2)*u, u*opt.w/2, u*opt.h/2);
        })
    }
    isHidden: boolean = false;
    parentBBExclude: boolean = false;
    center: Point = Point.ORIGIN;
    cooloff = 300;
    update(dt: number, container: GameObjectsContainer): void {
        this.cooloff -= dt;
        if (this.cooloff > 0) {
            return;
        }
        if (this.controller?.v.e || this.controller?.v.b) {
            this.hasEnded = true;
        }
        if (this.controller!.y > 0) {
            this.current = (this.current + 1) % this.options.length;
            this.cooloff = 250;
            return;
        }
        if (this.controller!.y < 0) {
            this.current = this.current === 0 ? this.options.length -1 : this.current - 1;
            this.cooloff = 250;
            return;
        }

        if (this.controller?.v.a) {
            this.cooloff = 250;
            const set = this.game.settings;
            switch (this.current) {
                case 0:
                    this.hasEnded = true;
                    break;
                case 1:
                    set.difficulty = (set.difficulty + 1) % 3;
                    break;
                case 2:
                    set.post = !set.post;
                    break;
                case 3:
                    this.ctx?.canvas.requestFullscreen();
                    break;
            }
            this.saveSettings()
            this.setOptions();
        }
    }
    saveSettings() {
        window.localStorage.setItem('hsph_set', JSON.stringify(this.game.settings));
    }

    setOptions() {
        const set = this.game.settings;
        this.options[1].updateTexts([diffText(set.difficulty)])
        this.options[2].updateTexts([post + "[" + (set.post ? 'ON' : 'OFF') +"]"]);
    }

    getBoundingBox(): Rectangle {
        return new Rectangle(Point.ORIGIN, new Point(10, 10));
    }
    zIndex?: number | undefined = 1000;
    isGlobal: boolean = true;
    controller?: KeyboardController;
    game!: Game;
    start(controller: KeyboardController, game: Game): void {
        this.controller = controller;
        this.game = game;
        this.setOptions();
    }
    hasEnded: boolean = false;
}