import { Rectangle } from "../Primitives";
import { GameObject } from "./GameObject";
import { GameObjectsContainer } from "./GameObjectsContainer";
import { Constructable } from "./mixins";

export class ArrayGameObjectsContainer implements GameObjectsContainer {
    private globalGameObjects: GameObject[] = [];
    getObjectsInArea(rect: Rectangle, t: string | undefined = undefined): GameObject[] {
        if (!t) {
            return this.getAll();
        }
        return [...this.globalGameObjects, ...this.objects]
        .filter(o => o.hasTag(t));
    }
    private objects: GameObject[] = [];
    add(obj: GameObject) {
        if (obj.isGlobal) {
            // console.log(obj);
            this.globalGameObjects.push(obj);
        } else {
            this.objects.push(obj);
        }
    }

    getAll() {
        return [...this.globalGameObjects, ...this.objects];
    }

    update() {
        // nothing here.
    }
}