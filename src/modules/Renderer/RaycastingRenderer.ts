import { Camera } from "../Camera";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Renderer } from "./Renderer";

export class RaycastingRenderer implements Renderer {
    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, private raysNo: number) {

    }

    render(camera: Camera, gameObjects: GameObjectsContainer, dt: number) {
        throw new Error("Method not implemented.");
    }

}