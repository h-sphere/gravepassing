import { NewTexture, Texture } from "../Color/Texture";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, Renderable } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { EmptyClass, withTags } from "./mixins";

export class RectangleObject extends withTags(EmptyClass) implements GameObject, Renderable {

    public rectangle: Rectangle;

    constructor(public p: Point, public texture: NewTexture, tag?: string, scale = 1) {
        super();
        this.rectangle = new Rectangle(p.add(scale, -scale), p);
        if (tag) {
            this._tags.push(tag);
        }
    }
    toLines(): Line[] {
        return [
            new Line(this.rectangle.p1, this.rectangle.p1.add(this.rectangle.width, 0)),
            new Line(this.rectangle.p1.add(this.rectangle.width, 0), this.rectangle.p2),
            new Line(this.rectangle.p2, this.rectangle.p1.add(0, this.rectangle.height)),
            new Line(this.rectangle.p1, this.rectangle.p1.add(0, this.rectangle.height))
        ]
    }

    getRenderInstructions(): Renderable[] {
        return [this];
    }
    update(dt: number, container: GameObjectsContainer): void {
        
    }
    getBoundingBox(): Rectangle {
        return this.rectangle;
    }
    isGlobal: boolean;
}