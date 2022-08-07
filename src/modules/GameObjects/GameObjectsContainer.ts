import { GameObject } from "./GameObject";
import { Constructable } from "./mixins";

export interface GameObjectsContainer {
    getObjectsInArea(top: number, left: number, bottom: number, right: number): GameObject[];
    add(obj: GameObject);
    getObjectsWithTag(t: string): GameObject[];

    getAll(): GameObject[];
}