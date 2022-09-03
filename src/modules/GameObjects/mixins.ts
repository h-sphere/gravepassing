import { getLinesIntersection } from "../../utils/math";
import { Line, Point, Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";

export class EmptyClass {}

export type Constructable<T = {}> = new (...args: any[]) => T;

type MethodsToOmit = 'update' | 'getBoundingBox' | 'isGlobal' | 'render';

export function withTags<T extends Constructable>(constructor: T) {
    return class extends constructor implements Omit<GameObject, MethodsToOmit> {
        parentBBExclude: boolean = false;
        isHidden = false;
        protected _tags: string[] = [];
        getTags(): string[] {
            return this._tags;
        }
        hasTag(t: string): boolean {
            return this._tags.findIndex(x => x === t) >= 0;
        } 
    }
}

export interface WithCenter {
    center: Point;
}

export interface WithObstacles {
    get obstacles(): GameObject[];
}

interface WithFeetBox {
    getFeetBox(): Rectangle;
}

const isWithFitBox = (t: any): t is WithFeetBox => {
    return !!t.getFeetBox;
}

interface Movable {
    move(dt: number, direction: Point, speed: number, container: GameObjectsContainer): void;
}

export function withMovement<T extends Constructable<WithCenter & GameObject>>(constructor: T) {
    return class extends constructor implements Movable {
        move(dt: number, direction: Point, speed: number, container: GameObjectsContainer): boolean {
            let distance = direction.mul(dt * speed);
            let line = new Line(this.center, this.center.addVec(distance));
            let shortened = false;


            let bb = this.getBoundingBox();
            if (isWithFitBox(this)) {
                // FIXME: expand one way or another.
                bb = this.getFeetBox().expand(0.01)
            }

            // SIMULATE MOVING BB BY LINE

            const combined = bb.moveBy(line.toPoint());

            // FIXME: FIX STUCK ENEMIES HERE
            const stuck = !!container.getObjectsInArea(bb, "o").length;
            if (stuck) {
                // moving slightly left
                this.center = this.center.add(0.05, 0);
            }

            const obstacles = container.getObjectsInArea(combined, "o").map(o => o.getBoundingBox().toLines()).flat();
            
            if(obstacles.length) {
                // push back just slightly so the user does not intersect anymore
                // this.center = this.center.copy().addVec(direction.copy().neg().mul(dt*speed*3));
                return false;
            }

            for (let ob of obstacles) {
                const i = getLinesIntersection(line, ob);
                if (i) {
                    line.p2 = i;
                    shortened = true;
                }
            }
            this.center = this.center.addVec(line.getMidpoint(shortened ? 0 : 1).diffVec(line.p1)).snapToGrid();
            return true;
        }

    }
}