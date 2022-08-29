import { Color } from "../Color/Color";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { WithCenter, withTags } from "./mixins";

export interface GameObject {
    parentBBExclude: boolean;
    getTags(): string[];
    hasTag(t: string): boolean;
    update(dt: number, container: GameObjectsContainer): void;

    getBoundingBox(): Rectangle;

    isGlobal: boolean;
    isHidden: boolean;
    zIndex?: number;
    toLines(): Line[];

    // SHOULD THAT BE ENOUGH?
    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle, unitToPx: number): void; 
}

export class GameObjectGroup implements GameObject, WithCenter {
    parentBBExclude: boolean = false;
    center: Point;
    private _tags: string[] = [];
    update(dt: number, container: GameObjectsContainer): void {
        throw new Error("Method not implemented.");
    }
    getBoundingBox(): Rectangle {
        const boxes = this.objects
        .filter(o => !o.parentBBExclude).map(x => x.getBoundingBox());
        if (!boxes.length) {
            return Rectangle.fromPoint(this.center);
        }
        return boxes.reduce((a, b) => Rectangle.boundingBox(a, b));
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

    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle, unitToPx: number) {
        // FIXME: RENDER GROUP PROPERLY?
    }
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