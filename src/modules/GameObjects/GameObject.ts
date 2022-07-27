import { Line, Point } from "../Primitives";
import { LineRenderInstruction, RenderInstruction } from "./RenderInstruction";

export interface GameObject {
    getRenderInstructions(): RenderInstruction[];
}


export class RenderableLine extends Line implements GameObject {
    constructor(p1: Point, p2: Point, public width: number = 3, public color: string = "red") {
        super(p1, p2);
    }
    getRenderInstructions(): RenderInstruction[] {
        return [{
            type: 'line',
            p1: this.p1,
            p2: this.p2,
            width: this.width,
            color: this.color,
        }]
    }
}

export class RenderablePoint extends Point implements GameObject {
    constructor(x: number, y: number, public radius: number = 0.1, public color: string = 'red') {
        super(x, y);
    }
    getRenderInstructions(): RenderInstruction[] {
        return [{
            type: "point",
            p: this,
            color: this.color,
            radius: this.radius,
        }]
    }

    
}