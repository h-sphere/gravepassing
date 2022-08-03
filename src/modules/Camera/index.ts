import { GameObjectsContainer } from "../GameObjects/GameObjectsContainer";
import { GradientLineInstruction, LineRenderInstruction, PointRenderInstruction } from "../GameObjects/RenderInstruction";
import { Point } from "../Primitives";

const MAIN_ZOOM_RANGE = 0.1; // points per pixel
const ZOOM_MAGNIFICATION_PER_VALUE = 0.1;

export class Camera {
    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, public center: Point) {}

    public zoom: number = 5;
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

    renderLine(line: LineRenderInstruction) {
        const p1 = this.getPositionOnScreen(line.p1);
        const p2 = this.getPositionOnScreen(line.p2);
        this.ctx.beginPath();
        this.ctx.lineWidth = line.width;
        this.ctx.strokeStyle = line.color.toString();
        this.ctx.moveTo(...p1);
        this.ctx.lineTo(...p2);
        this.ctx.stroke();
    }

    renderPoint(point: PointRenderInstruction) {
        const r = point.radius / this.getSizePerPixel();
        const p = this.getPositionOnScreen(point.p);
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
        for (const object of gameObjects.getObjectsInArea(...boundingBox)) {
            for (const instruction of object.getRenderInstructions()) {
                switch (instruction.type) {
                    case 'line':
                        this.renderLine(instruction);
                        break;
                    case 'point':
                        this.renderPoint(instruction);
                        break;
                    case 'gradient-line':
                        this.renderGradientLine(instruction);
                }
            }
        }
    }
}