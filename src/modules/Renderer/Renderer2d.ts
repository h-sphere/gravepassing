import { lightIntensityAtPoint } from "../../utils/lightIntesity";
import { Camera } from "../Camera";
import { Color } from "../Color/Color";
import { ColorGradient } from "../Color/Gradient";
import { Texture } from "../Color/Texture";
import { TAG } from "../constants/tags";
import { RenderableLine, RenderablePoint } from "../GameObjects/GameObject";
import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { Light } from "../GameObjects/Light";
import { RenderableSquaredPoint } from "../GameObjects/SquaredPoint";
import { Line, Point } from "../Primitives";
import { Renderer } from "./Renderer";

const MAIN_ZOOM_RANGE = 0.1; // points per pixel
const ZOOM_MAGNIFICATION_PER_VALUE = 0.1;

export class Renderer2d implements Renderer {

    private gridEnabled: boolean = false;

    private zoom: number;

    private center: Point;

    constructor(private ctx, private width: number, private height: number) {

    }

    getSizePerPixel() {
        return (MAIN_ZOOM_RANGE + ZOOM_MAGNIFICATION_PER_VALUE) / this.zoom;
    }

    private getBoundingBox(): [number, number, number, number] {
        const sizePerPixel = this.getSizePerPixel();
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

    private renderBackground() {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
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

        this.ctx.beginPath()
        this.ctx.lineWidth = line.width / this.getSizePerPixel() / 20;
        this.ctx.strokeStyle = grd;
        this.ctx.moveTo(...p1);
        this.ctx.lineTo(...p2);
        this.ctx.stroke();
    }

    private resolveCircularColor(color: Texture, ctx, p: [number, number], r) {
        if (color instanceof ColorGradient) {
            return color.renderCircular(ctx, p[0], p[1], r);
        } else {
            return color.toString();
        }
    }

    renderPoint(point: RenderablePoint) {
        const r = point.radius / this.getSizePerPixel();
        const p = this.getPositionOnScreen(point);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.resolveCircularColor(point.color, this.ctx, p, r);
        this.ctx.arc(p[0], p[1], r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    renderSquarePoint(point: RenderableSquaredPoint, gameObjects: GameObjectsContainer) {
        const r = point.radius / this.getSizePerPixel();
        const p = this.getPositionOnScreen(point);
        this.ctx.fillStyle = this.resolveCircularColor(point.color, this.ctx, p, r);

        // FIXME: filter properly.
        const points = point.getPolygonPoints(gameObjects.getObjectsWithTag(TAG.OBSTACLE) as unknown[] as Line[]);
        this.ctx.beginPath();
        const initial = this.getPositionOnScreen(points[0]);
        this.ctx.moveTo(...initial);
        points.forEach((po) => {
            this.ctx.lineTo(...this.getPositionOnScreen(po));
        });
        this.ctx.fill();
    }

    renderGrid() {
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


    render(camera: Camera, gameObjects: GameObjectsContainer) {
        this.center = camera.center;
        this.zoom = camera.zoom;
        const boundingBox = this.getBoundingBox();
        this.renderBackground();
        if (this.gridEnabled) {
            this.renderGrid();
        }

        const objects = gameObjects.getObjectsInArea(...boundingBox);
        const lights = objects.filter(o => o instanceof Light);
        for (const object of objects) {
            for (const obj of object.getRenderInstructions()) {
                if (obj instanceof RenderableLine) {
                    this.renderLine(obj, lights as unknown as Light[]);
                } else if (obj instanceof RenderableSquaredPoint) {
                    this.renderSquarePoint(obj, gameObjects);
                } else if (obj instanceof RenderablePoint) {
                    this.renderPoint(obj);
                }
            }
        }
    }
}