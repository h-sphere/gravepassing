import { Texture } from "../Color/Texture";
import { Rectangle } from "../Primitives";
import { GameObject, Renderable } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";

export class RectangleObject implements GameObject, Renderable {

    constructor(public rectangle: Rectangle, public texture: Texture) {}

    getRenderInstructions(): Renderable[] {
        return [this];
    }
    getTags(): string[] {
        return [];
    }
    hasTag(t: string): boolean {
        return false;
    }
    update(dt: number, container: GameObjectsContainer): void {
        
    }
    getBoundingBox(): Rectangle {
        return this.rectangle;
    }
    isGlobal: boolean;
}