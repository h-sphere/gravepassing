import { CombinedEmoji, DirectionableTexture, Emoji } from "../Color/Sprite";
import { NewTexture } from "../Color/Texture";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject, GetPosFn, Renderable } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { EmptyClass, withTags } from "./mixins";
import type { TextTexture } from "./TextModule";

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
    render(ctx: CanvasRenderingContext2D, gameBB: Rectangle, getPosOnScreen: GetPosFn): void {
        if (this.isHidden) {
            return;
        }
        const r = this.getBoundingBox();
        ctx.beginPath();

        let p1 = getPosOnScreen(r.p1);
        let p2 = getPosOnScreen(r.p2);

        if (this.isGlobal) {
            // Displaying in screenc coordinates
            p1 = getPosOnScreen(gameBB.p1.add(r.p1.x, r.p1.y));
            p2 = getPosOnScreen(gameBB.p1.add(r.p2.x, r.p2.y));
        }

        console.log("TEXTURE", this.texture);

        this.texture.render(ctx, ...p1, p2[0]-p1[0], p2[1]-p1[1]);

        // if (
        //     this.texture instanceof Emoji ||
        //     this.texture instanceof CombinedEmoji ||
        //     this.texture instanceof DirectionableTexture ||
        //     this.texture instanceof TextTexture
        //     )
        //      {
        //     (this.texture as NewTexture).newRender(ctx, ...p1, p2[0]-p1[0], p2[1]-p1[1]);

        // } else {
        //     console.log(this);
        // }

    }
    isHidden: boolean = false;
    parentBBExclude: boolean = false;
    zIndex?: number | undefined;
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
    isGlobal: boolean = false;
}