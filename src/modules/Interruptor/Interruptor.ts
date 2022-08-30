import { KeyboardController } from "../Controller/KeyboardController";
import { Game } from "../Game";
import { GameObject, GetPosFn } from "../GameObjects/GameObject";
import { Rectangle } from "../Primitives";

export interface Interruptable {
    onResolution?(fn: () => void): void;
    start(controller: KeyboardController, game: Game): void;
    hasEnded: boolean;
    
    // should take same update like regular game objects.
}

export type InterGO = Interruptable & GameObject;

export class Interruptor {
    isRunning = false;
    private _inters: InterGO[] = [];
    add(inter: InterGO) {
        // FIXME: priority problem? maybe you can't pause during "cutscenes" or "dialogues"?
        this._inters.push(inter);
    }

    isActive: boolean = false;

    update(controller: KeyboardController, game: Game) {
        if (!this.isRunning && this._inters.length) {
            // we should start the first one
            this.isRunning = true;
            const inter = this._inters[0];
            inter.start(controller, game);
        }

        if (this.isRunning) {
            const inter = this._inters[0];

            // should we be the only ones who send the timer updates?

            if (inter.hasEnded) {
                this._inters = this._inters.slice(1);
                this.isRunning = false;
                this.update(controller, game);
            }
        }
    }

    updateInter(dt: number) {
        this.isRunning && this._inters[0].update(dt, null!);
    }

    render(ctx: CanvasRenderingContext2D, bb: Rectangle, fn: GetPosFn) {
        this.isRunning && this._inters[0].render(ctx, bb, fn);
    }
}