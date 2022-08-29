import { NewTexture } from "../Color/Texture";
import { KeyboardController } from "../Controller/KeyboardController";
import { GameObject } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";

export interface Interruptable {
    next(): Promise<boolean>;
    start(controller: KeyboardController): void;
    hasEnded: boolean;
    
    // should take same update like regular game objects.
}

export type InterGO = Interruptable & GameObject & NewTexture;

export class Interruptor {
    isRunning = false;
    private _inters: InterGO[] = [];
    add(inter: InterGO) {
        // FIXME: priority problem? maybe you can't pause during "cutscenes" or "dialogues"?
        this._inters.push(inter);
    }

    isActive: boolean = false;

    update(controller: KeyboardController) {
        if (!this.isRunning && this._inters.length) {
            // we should start the first one
            const inter = this._inters[0];
            inter.start(controller);
        }

        if (this.isRunning) {
            const inter = this._inters[0];

            // should we be the only ones who send the timer updates?

            if (inter.hasEnded) {
                this._inters = this._inters.slice(1);
                this.isRunning = false;
                this.update(controller);
            }
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.isRunning) {
            this._inters[0].update(-1, null);
// that's for tomorrow's Kacper.
            // this._inters[0].newRender(ctx);
        }
    }
}