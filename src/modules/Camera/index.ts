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
    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number) {}
    public zoom: number = 15;
    private following: WithCenter;

    get center() {
        return this.following.center;
    }

    follow(go: WithCenter) {
        this.following = go;
    }
}