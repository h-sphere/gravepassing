import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { RenderableSquaredPoint } from "../GameObjects/SquaredPoint";
import { Line, Point } from "../Primitives";

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, public center: Point) {}
    public zoom: number = 3;
    setCenter(c: Point) {
        this.center = c; // Reference. Maybe do something smarter?
    }
}