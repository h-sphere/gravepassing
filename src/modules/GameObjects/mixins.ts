import { getLinesIntersection } from "../../utils/math";
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

type MethodsToOmit = 'getRenderInstructions' | 'update' | 'getBoundingBox' | 'isGlobal';

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
            const obstacles = container.getObjectsInArea(new Rectangle(this.center, this.center.addVec(distance)), TAG.OBSTACLE) as unknown[] as Line[]; // FIXME
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