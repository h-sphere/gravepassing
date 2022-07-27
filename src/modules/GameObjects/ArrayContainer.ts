import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";

export class ArrayGameObjectsContainer implements GameObjectsContainer {
    getObjectsInArea(top: number, left: number, bottom: number, right: number): GameObject[] {
        return this.objects;
    }
    private objects: GameObject[] = [];
    add(obj: GameObject) {
        this.objects.push(obj);
    }
}