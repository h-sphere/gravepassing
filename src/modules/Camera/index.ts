import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { Color } from "../Color/Color";
import { RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { GradientLineInstruction, LineRenderInstruction, PointRenderInstruction } from "../GameObjects/RenderInstruction";
import { Line, Point } from "../Primitives";

const MAIN_ZOOM_RANGE = 0.1; // points per pixel
const ZOOM_MAGNIFICATION_PER_VALUE = 0.1;

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, public center: Point) {}

    public zoom: number = 3;
    private gridEnabled: boolean = true;

    getSizePerPixel() {
        return (MAIN_ZOOM_RANGE + ZOOM_MAGNIFICATION_PER_VALUE) / this.zoom;
    }

    setCenter(c: Point) {
        this.center = c; // Reference. Maybe do something smarter?
    }

    private getBoundingBox(): [number, number, number, number] {
        const sizePerPixel = this.getSizePerPixel();
        console.log(sizePerPixel);
        return [
            this.center.x - (this.width / 2) * sizePerPixel,
            this.center.y - (this.height / 2) * sizePerPixel,
            this.center.x + (this.width / 2) * sizePerPixel,
            this.center.y + (this.width / 2) * sizePerPixel, 
        ]
    }

    getPositionOnScreen(p: Point): [number, number] {
        return [
            this.width / 2 - (this.center.x - p.x) / this.getSizePerPixel(),
            this.height / 2 - (this.center.y - p.y) / this.getSizePerPixel()
        ];
    }

    renderLine(line: RenderableLine, lights: Light[]) {
        const p1 = this.getPositionOnScreen(line.p1);
        const p2 = this.getPositionOnScreen(line.p2);
        let grd;

        if (line.color instanceof Color) {
        // Compute lights
        const l = line.color.l;

        grd = this.ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
        grd.addColorStop(0, line.color
            .withL(l * lightIntensityAtPoint(line.p1, lights)).toString());
        grd.addColorStop(0.5, line.color
            .withL(l * lightIntensityAtPoint(line.getMidpoint(0.5), lights)).toString())
        grd.addColorStop(1, line.color
            .withL(l * lightIntensityAtPoint(line.p2, lights)).toString());
        } else {
            grd = line.color.render(this.ctx, p1[0], p1[1], p2[0], p2[1]);
            // FIXME: add lighting?
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = line.width;
        this.ctx.strokeStyle = grd;
        this.ctx.moveTo(...p1);
        this.ctx.lineTo(...p2);
        this.ctx.stroke();
    }

    renderPoint(point: RenderablePoint) {
        const r = point.radius / this.getSizePerPixel();
        const p = this.getPositionOnScreen(point);
        this.ctx.beginPath();
        this.ctx.fillStyle = point.color.toString();
        this.ctx.arc(p[0], p[1], r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    renderGrid() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        const [x1, y1, x2, y2] = this.getBoundingBox();
        for(let i = Math.ceil(x1); i <= x2; i++) {
            for(let j = Math.ceil(y1); j <= y2; j++) {
                this.ctx.beginPath();
                const [x, y] = this.getPositionOnScreen(new Point(i, j));
                this.ctx.fillStyle = '#555';
                this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    renderGradientLine(line: GradientLineInstruction) {
        console.log("Rendering line", line);
        const p1 = this.getPositionOnScreen(line.p1);
        const p2 = this.getPositionOnScreen(line.p2);
        this.ctx.beginPath();
        this.ctx.lineWidth = line.width;
        this.ctx.strokeStyle = line.gradient(this.ctx, p1[0], p1[1], p2[0], p2[1]);
        this.ctx.moveTo(...p1);
        this.ctx.lineTo(...p2);
        this.ctx.stroke();
    }

    render(gameObjects: GameObjectsContainer) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        const boundingBox = this.getBoundingBox()
        console.log(`Camera::render(${boundingBox.join(', ')})`);
        if (this.gridEnabled) {
            this.renderGrid();
        }
        const objects = gameObjects.getObjectsInArea(...boundingBox);
        const lights = objects.filter(o => o instanceof Light);
        for (const object of objects) {
            for (const obj of object.getRenderInstructions()) {
                if (obj instanceof RenderableLine) {
                    this.renderLine(obj, lights as unknown as Light[]);
                } else if (obj instanceof RenderablePoint) {
                    this.renderPoint(obj);
                }
            }
        }
    }
}