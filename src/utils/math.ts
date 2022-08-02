import { Line, Point } from "../modules/Primitives"

const ELIPSON = 0.0001;

export const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
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