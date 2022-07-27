import { Point } from "../Primitives";

export interface LineRenderInstruction {
    type: 'line';
    p1: Point;
    p2: Point;
    color: string;
    width: number;
}

export interface PointRenderInstruction {
    type: 'point';
    p: Point;
    color: string;
    radius: number;
}

export type RenderInstruction = LineRenderInstruction | PointRenderInstruction;