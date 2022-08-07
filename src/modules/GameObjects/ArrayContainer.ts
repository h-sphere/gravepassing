import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Constructable } from "./mixins";

export class ArrayGameObjectsContainer implements GameObjectsContainer {
    getObjectsInArea(top: number, left: number, bottom: number, right: number): GameObject[] {
        return this.objects;
    }

    getObjectsWithTag(t: string): GameObject[] {
        return this.objects
            .filter(o => o.hasTag(t));
    }
    private objects: GameObject[] = [];
    add(obj: GameObject) {
        this.objects.push(obj);
    }

    getAll() {
        return this.objects;
    }
}