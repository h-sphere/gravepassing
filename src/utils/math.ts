import { Line, Point } from "../modules/Primitives"

export const ELIPSON = 0.0001;

export const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export const getLinesIntersectionInternal = (l1: Line, l2: Line): Point => {
    const denominator = (l1.p1.x - l1.p2.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l1.p2.y) * (l2.p1.x - l2.p2.x);
    const newX = 
        ((l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) * (l2.p1.x - l2.p2.x) -
        (l1.p1.x - l1.p2.x) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)) / denominator;

    const newY = 
        ((l1.p1.x * l1.p2.y - l1.p1.y * l1.p2.x) * (l2.p1.y - l2.p2.y) -
        (l1.p1.y - l1.p2.y) * (l2.p1.x * l2.p2.y - l2.p1.y * l2.p2.x)
        ) / denominator;
    return new Point(newX, newY);
}

export const getLinesIntersection = (l1: Line, l2: Line): Point | null => {
    const p = getLinesIntersectionInternal(l1, l2);
    if (isPointOnLine(p, l1) && isPointOnLine(p, l2)) {
        return p;
    }
    return null;
}

export const isPointOnLine = (p: Point, l: Line): boolean => {
    return distance(l.p1, p) + distance(l.p2, p) - distance(l.p1, l.p2) < ELIPSON;
}

const normaliseAngle = (a: number) => {
    return (a + 2 * Math.PI) % (2 * Math.PI);
}

export const getAngularDistance = (target: number, compare: number) => {
    return ((target - compare) + 2 * Math.PI) % (2 * Math.PI);
}

export const isAngleInRange = (angle: number, minAngle: number, maxAngle: number) => {
    const a = normaliseAngle(angle);
    const a1 = normaliseAngle(minAngle);
    const a2 = normaliseAngle(maxAngle);
    return a >= Math.min(a1, a2) && a <= Math.max(a1, a2);
}