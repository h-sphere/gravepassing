import { Color } from "../Color/Color";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { WithCenter, withTags } from "./mixins";

export interface GameObject {
    parentBBExclude: boolean;
    getRenderInstructions(): Renderable[];
    getTags(): string[];
    hasTag(t: string): boolean;
    update(dt: number, container: GameObjectsContainer): void;

    getBoundingBox(): Rectangle;

    isGlobal: boolean;
    zIndex?: number;
    toLines(): Line[];
}

export class GameObjectGroup implements GameObject, WithCenter {
    parentBBExclude: boolean = false;
    center: Point;
    private _tags: string[] = [];
    update(dt: number, container: GameObjectsContainer): void {
        throw new Error("Method not implemented.");
    }
    getBoundingBox(): Rectangle {
        const box = Rectangle.UNIT;
        return this.objects
        .filter(o => !o.parentBBExclude)
        .reduce((a, b) => Rectangle.boundingBox(a, b.getBoundingBox()), box);
    }
    zIndex?: number | undefined;
    toLines(): Line[] {
        return [];
    }
    private objects: GameObject[] = [];
    add(go: GameObject) {
        this.objects.push(go);
    }

    getAll(): GameObject[] {
        return this.objects;
    }

    remove(go: GameObject) {
        this.objects = this.objects.filter(o => o !== go);
    }

    getRenderInstructions(): Renderable[] {
        return [];
        // return this.objects.map(o => o.getRenderInstructions()).flat();
    }

    protected addTag(t: string) {
        this._tags.push(t);
    }

    getTags(): string[] {
        return [...this._tags];
    }

    hasTag(t: string): boolean {
        return !!this._tags.find(tag => tag === t);
    }

    isGlobal: boolean = false;
}

export interface Renderable {
    getBoundingBox(): Rectangle;
}


export class RenderableLine extends withTags(Line) implements GameObject, Renderable {
    constructor(p1: Point, p2: Point, public width: number = 3, public color: Texture = Color.RED) {
        super(p1, p2);
    }
    parentBBExclude: boolean = false;
    zIndex?: number | undefined;
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

    toLines(): Line[] {
        return [this];
    }
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
    parentBBExclude = false;
    constructor(x: number, y: number, public radius: number = 0.1, public color: Texture = Color.RED) {
        super(x, y);
    }
    getRenderInstructions(): Renderable[] {
        return [this];
    }

    toLines(): Line[] {
        return [new Line(this, this)];
    }

    static fromPoint(p: Point, radius: number = 0.1, color: Texture = Color.RED) {
        return new this(p.x, p.y, radius, color);
    }

    getBoundingBox() {
        return Rectangle.withPointCenter(this, this.radius*2, this.radius*2);
    }

    update() {}

    isGlobal = false;
}