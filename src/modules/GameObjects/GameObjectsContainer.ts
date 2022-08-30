import { Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";

export interface GameObjectsContainer {
    getObjectsInArea(rect: Rectangle, t?: string): GameObject[];
    add(obj: GameObject): void;

    remove(obj: GameObject): void;

    getAll(): GameObject[];

    update(): void;
}