import { CombinedEmoji, DirectionableTexture, Emoji } from "../Color/Sprite";
import { NewTexture, Texture } from "../Color/Texture";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, Renderable } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { EmptyClass, withTags } from "./mixins";

export class RectangleObject extends withTags(EmptyClass) implements GameObject, Renderable {

    public rectangle: Rectangle;

    constructor(public p: Point, public texture: NewTexture, tag?: string|string[], scale = 1) {
        super();
        this.rectangle = new Rectangle(p.add(scale, -scale), p);
        if (tag) {
            if(Array.isArray(tag)) {
                tag.forEach(t => this._tags.push(t));
            } else {
                this._tags.push(tag);
            }
        }
    }
    isHidden: boolean = false;
    parentBBExclude: boolean = false;
    zIndex?: number | undefined;
    toLines(): Line[] {
        // FIXME: we probably dont need this.
        const bb = this.getBoundingBox();
        return [
            new Line(bb.p1, bb.p1.add(bb.width, 0)),
            new Line(bb.p1.add(bb.width, 0), bb.p2),
            new Line(bb.p2, bb.p1.add(0, bb.height)),
            new Line(bb.p1, bb.p1.add(0, bb.height))
        ]
    }
    update(dt: number, container: GameObjectsContainer): void {
        
    }

    collisionBoundingBox() {
        if (this.texture instanceof DirectionableTexture) { // OR EMOJI
            // console.log("MOVING?")
            // console.log("BB", this.texture.getBoundingBox());
            return this.texture.collisionBoundingBox()//.moveBy(this.rectangle.center); //this.rectangle;
        }
        return this.rectangle;
    }

    getBoundingBox(): Rectangle {
        return this.rectangle;
    }
    isGlobal: boolean;
}