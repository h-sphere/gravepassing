import { Color } from "../Color/Color";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { withTags } from "./mixins";

export interface GameObject {
    getRenderInstructions(): Renderable[];
    getTags(): string[];
    hasTag(t: string): boolean;
    update(dt: number, container: GameObjectsContainer): void;

    getBoundingBox(): Rectangle;

    isGlobal: boolean;
}

export interface Renderable {
    getBoundingBox(): Rectangle;
}


export class RenderableLine extends withTags(Line) implements GameObject, Renderable {
    constructor(p1: Point, p2: Point, public width: number = 3, public color: Texture = Color.RED) {
        super(p1, p2);
    }
    getRenderInstructions(): Renderable[] {
        return [this];
    }

    update() {}

    static fromLine(l: Line, width: number = 3, color: Texture = Color.RED) {
        return new this(l.p1, l.p2, width, color);
    }

    getBoundingBox() {
        return new Rectangle(this.p1, this.p2);
    }
    
    isGlobal = false;
}

// export class RenderableGradientLine extends RenderableLine {
//     constructor(p1: Point, p2: Point, public width: number = 3, public gradientStart: string, public gradientStop: string) {
//         super(p1, p2, width);
//     }

//     getRenderInstructions(): Renderable[] {
//         return [gradientLineInstruction(this.p1, this.p2, this.width, this.gradientStart, this.gradientStop)]
//     }
// }


export class WallGameObject extends RenderableLine {
    constructor(p1: Point, p2: Point, width: number = 3, color: Texture = Color.RED) {
        super(p1, p2, width, color);
        this._tags.push(TAG.OBSTACLE);
    }
}

export class RenderablePoint extends withTags(Point) implements GameObject, Renderable {
    constructor(x: number, y: number, public radius: number = 0.1, public color: Texture = Color.RED) {
        super(x, y);
    }
    getRenderInstructions(): Renderable[] {
        return [this];
    }

    static fromPoint(p: Point, radius: number = 0.1, color: Texture = Color.RED) {
        return new this(p.x, p.y, radius, color);
    }

    getBoundingBox() {
        return Rectangle.fromPoint(this);
    }

    update() {}

    isGlobal = false;
}