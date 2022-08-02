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

export interface GradientLineInstruction {
    type: 'gradient-line',

    p1: Point;
    p2: Point;
    width: number;
    gradient: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => CanvasGradient;
}

export const pointInstruction = (p: Point, radius: number, color = "white"): PointRenderInstruction => ({
    type: 'point',
    p,
    radius,
    color,
});

export const lineInstruction = (p1: Point, p2: Point, width: number, color: string = "white"): LineRenderInstruction => ({
    type: "line",
    p1,
    p2,
    color,
    width,
});

export const gradientLineInstruction = (p1: Point, p2: Point, width: number, g1: string, g2: string): GradientLineInstruction => ({
    type: 'gradient-line',
    p1,
    p2,
    width,
    gradient: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
        const grd = ctx.createLinearGradient(x1, y1, x2, y2);
        grd.addColorStop(0, g1);
        grd.addColorStop(1, g2);
        return grd;
    }
});

export type RenderInstruction = LineRenderInstruction | PointRenderInstruction | GradientLineInstruction;