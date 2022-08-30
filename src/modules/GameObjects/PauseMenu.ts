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
    pauseText = new TextTexture(["PAUSED"], 3, 1, 'rgba(0,0,0,0)');
    options = [
        new TextTexture(["Resume"], 4, 1, 'rgba(0,0,0,0)'),
        new TextTexture([diffText(2)], 10, 1, 'rgba(0,0,0,0)'),
        new TextTexture([], 10, 1, "rgba(0,0,0,0)"),
    ]
    current = 0;
    render(ctx: CanvasRenderingContext2D, bb: Rectangle, fn: GetPosFn) {
        ctx.fillStyle = "#101424";
        const width = fn(bb.p2)[0];
        const u = width / 10;
        ctx.fillRect(0, 0, width, width);
        this.pauseText.render(ctx, u, u, this.pauseText.w*u/2, u*this.pauseText.h/2);
        this.options.forEach((opt, i) => {
            if (this.current === i) {
                ctx.fillStyle = "rgba(30, 100, 40, 0.7)";
                ctx.fillRect(u, (2+i/2)*u, u*opt.w/2, u*opt.h/2);
            }
            opt.render(ctx, u, (2.1+i/2)*u, u*opt.w/2, u*opt.h/2);
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
        if (this.controller?.esc) {
            console.log("ENDED");
            this.hasEnded = true;
        }
        if (this.controller!.y > 0) {
            this.current = (this.current + 1) % this.options.length;
            this.cooloff = 200;
            return;
        }
        if (this.controller!.y < 0) {
            this.current = this.current === 0 ? this.options.length -1 : this.current - 1;
            this.cooloff = 200;
            return;
        }

        if (this.controller?.fire) {
            this.cooloff = 500;
            const set = this.game.settings;
            switch (this.current) {
                case 0:
                    this.hasEnded = true;
                    break;
                case 1:
                    set.difficulty = (set.difficulty + 1) % 3; // FIXME: more difficulties
                    break;
                case 2:
                    set.post = !set.post;
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
    next(): Promise<boolean> {
        // I THINK WE DONT NEED THAT AT ALL
        return Promise.reject();
    }
    controller?: KeyboardController;
    game!: Game;
    start(controller: KeyboardController, game: Game): void {
        this.controller = controller;
        this.game = game;
        this.setOptions();
    }
    hasEnded: boolean = false;
}