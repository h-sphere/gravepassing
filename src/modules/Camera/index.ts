import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { GameObject, RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { WithCenter } from "../GameObjects/mixins";
import { RenderableSquaredPoint } from "../GameObjects/SquaredPoint";
import { Line, Point } from "../Primitives";

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D) {}
    private following: WithCenter;

    get center() {
        if (!this.following) {
            return Point.ORIGIN;
        }
        return this.following.center.mul(1/10, 1/7).round().mul(10, 7).add(0, 2);
    }

    follow(go: WithCenter) {
        this.following = go;
    }
}