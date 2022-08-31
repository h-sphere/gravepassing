import { Point, Rectangle } from "../Primitives";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { WithCenter } from "./mixins";

export type GetPosFn = (p:Point) => [number, number];

export interface GameObject {
    parentBBExclude: boolean;
    getTags(): string[];
    hasTag(t: string): boolean;
    update(dt: number, container: GameObjectsContainer): void;

    getBoundingBox(): Rectangle;

    isGlobal: boolean;
    isHidden: boolean;
    zIndex?: number;
    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle, getPosOnScreen: GetPosFn): void; 
}

export class GameObjectGroup implements GameObject, WithCenter {
    parentBBExclude: boolean = false;
    isHidden = false;
    center!: Point;
    private _tags: string[] = [];
    update(dt: number, container: GameObjectsContainer): void {}
    getBoundingBox(): Rectangle {
        const boxes = this.objects
        .filter(o => !o.parentBBExclude).map(x => x.getBoundingBox());
        if (!boxes.length) {
            return Rectangle.fromPoint(this.center);
        }
        return boxes.reduce((a, b) => Rectangle.boundingBox(a, b));
    }
    zIndex?: number | undefined;
    private objects: GameObject[] = [];
    add(go: GameObject) {
        this.objects.push(go);
        return go;
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

    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle) {
        // FIXME: RENDER GROUP PROPERLY?
    }
}

export interface Renderable {
    getBoundingBox(): Rectangle;
}
