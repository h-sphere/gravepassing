import { Light } from "../modules/GameObjects/Light";
import { Point } from "../modules/Primitives";
import { sum } from './functional';

export const lightIntensityAtPoint = (p: Point, lights: Light[]) => {
    return Math.min(1, lights.map(l => l.getIntensityAtPoint(p)).reduce(sum, 0));
}