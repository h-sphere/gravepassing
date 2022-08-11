import { Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";
import { Constructable } from "./mixins";

export interface GameObjectsContainer {
    getObjectsInArea(rect: Rectangle, t?: string): GameObject[];
    add(obj: GameObject): void;

    getAll(): GameObject[];

    update();
}