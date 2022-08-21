import { getLinesIntersection } from "../../utils/math";
import { Image, SIZE } from "../Color/Image";
import { Dither } from "../Color/Sprite";
import { TAG } from "../constants/tags";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";

export class EmptyClass {}

export type Constructable<T = {}> = new (...args: any[]) => T;

type Mixin<T> = (constructor: Constructable<T>) => new (...args: any[]) => T;

// export const applyMixins = <T, J>(...mixins: readonly Mixin<J>[]) => (F: Constructable<T>) => {
//     let Cl = F;
//     for (let mx of mixins) {
//         Cl = mx(Cl);
//     }
//     return Cl;
// }

type MethodsToOmit = 'getRenderInstructions' | 'update' | 'getBoundingBox' | 'isGlobal' | 'toLines';

export function withTags<T extends Constructable>(constructor: T) {
    return class extends constructor implements Omit<GameObject, MethodsToOmit> {
        protected _tags: string[] = [];
        getTags(): string[] {
            return this._tags;
        }
        hasTag(t: string): boolean {
            return this._tags.findIndex(x => x === t) >= 0;
        } 
    }
}

export interface Rotation {
    rotation: number;
    getVisionRays(fov: number): Line[];
}

export interface WithCenter {
    center: Point;
}

export interface WithObstacles {
    get obstacles(): GameObject[];
}

export function withRotation<T extends Constructable<WithCenter & WithObstacles>>(constructor: T) {
    return class extends constructor implements Rotation {
        protected numberOfRays = 100;
        protected RAY_LENGTH: number = 100;
        protected _rotation: number = 0;

        get rotation() {
            return this._rotation;
        }

        set rotation(v: number) {
            this._rotation = v;
        }
        getVisionRays(fov: number = Math.PI / 2): Line[] {
            const lines: Line[] = [];
            for(let i=0;i<this.numberOfRays;i++) {
                const angle = this.rotation - (fov / 2) + (i * fov / this.numberOfRays);
                let l = new Line(
                    this.center.copy(),
                    new Point(this.center.x + Math.sin(angle) * this.RAY_LENGTH, this.center.y + Math.cos(angle) * this.RAY_LENGTH)
                );
                for(const o of this.obstacles) {
                    if (o instanceof Line) {
                        const p = getLinesIntersection(l, o);
                        if (p) {
                            l.p2 = p;
                        }
                    }
                }
    
                lines.push(l);
            }
            return lines;
        }
    }
}

interface Movable {
    move(dt: number, direction: Point, speed: number, container: GameObjectsContainer);
}

export function withMovement<T extends Constructable<WithCenter>>(constructor: T) {
    return class extends constructor implements Movable {
        move(dt: number, direction: Point, speed: number, container: GameObjectsContainer) {
            let distance = direction.mul(dt * speed);
            let line = new Line(this.center, this.center.addVec(distance));
            let shortened = false;
            const obstacles = container.getObjectsInArea(new Rectangle(this.center, this.center.addVec(distance)), TAG.OBSTACLE).map(o => o.toLines()).flat();
            for (let ob of obstacles) {
                const i = getLinesIntersection(line, ob);
                if (i) {
                    line.p2 = i;
                    shortened = true;
                }
            }
            // move slightly from the end
            this.center = this.center.addVec(line.getMidpoint(shortened ? 0.4 : 1).diffVec(line.p1));
        }

    }
}


export interface WithLightIface {
    setLight(lef: number, right: number): void;
}

export function withLight<T extends Constructable<Image>>(constructor: T) {
    return class extends constructor implements WithLightIface {
        private bmpCopy;
        setLight(left: number, right: number) {
            if (!this.bmp) {
                return 'yellow';
            }
            if (!this.bmpCopy) {
                this.bmpCopy = this.bmp;
            }
            // We could probably tan it later
            this.ctx.clearRect(this.pos[0], this.pos[1], this.w, this.h);
            this.ctx.drawImage(this.bmpCopy, this.pos[0], this.pos[1]);
            // this.ctx.drawImage(Sprite.getImage(), -this.x * SIZE, -this.y * SIZE);
            // const dither = Dither.getDither(left);
            // this.ctx.fillStyle = dither.render(this.ctx, this.pos[0], this.pos[1], this.w, this.h);
            const grd = this.ctx.createLinearGradient(0, 0, this.w, 0);
            grd.addColorStop(0, 'rgba(0, 0, 0,' + (1 - left) + ')');
            grd.addColorStop(1, 'rgba(0, 0, 0,' + (1 - left) + ')'); // right to have continous but this way it looks more natural.
            this.ctx.fillStyle = grd;


            // this.ctx.drawImage(Sprite.getImage(), -this.x * SIZE, -this.y * SIZE);
            // this.ctx.fillStyle = this.d.render(this.ctx, 0, 0, SIZE, SIZE);
            this.ctx.globalCompositeOperation = 'source-atop';
            this.ctx.fillRect(this.pos[0], this.pos[1], this.w, this.h);
            this.generateBmp()
            this.ctx.globalCompositeOperation = 'source-over';
        }
    }
}