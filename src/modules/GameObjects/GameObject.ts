import { TAG } from "../constants/tags";
import { Line, Point } from "../Primitives";
import { withTags } from "./mixins";
import { gradientLineInstruction, LineRenderInstruction, RenderInstruction } from "./RenderInstruction";

export interface GameObject {
    getRenderInstructions(): RenderInstruction[];
    getTags(): string[];
    hasTag(t: string): boolean;
}


export class RenderableLine extends withTags(Line) implements GameObject {
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

export class RenderableGradientLine extends RenderableLine {
    constructor(p1: Point, p2: Point, public width: number = 3, public gradientStart: string, public gradientStop: string) {
        super(p1, p2, width);
    }

    getRenderInstructions(): RenderInstruction[] {
        return [gradientLineInstruction(this.p1, this.p2, this.width, this.gradientStart, this.gradientStop)]
    }
}


export class WallGameObject extends RenderableLine {
    constructor(p1: Point, p2: Point, width: number = 3, color: string = "red") {
        super(p1, p2, width, color);
        this._tags.push(TAG.OBSTACLE);
    }
}

export class RenderablePoint extends withTags(Point) implements GameObject {
    constructor(x: number, y: number, public radius: number = 0.1, public color: string = 'red') {
        super(x, y);
    }
    getRenderInstructions(): RenderInstruction[] {
        return [{
            type: "point",
            p: this,
            color: this.color,
            radius: this.radius,
        }];
    }
}