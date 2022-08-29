import { NewTexture } from "./Texture";

export class Color implements NewTexture {
    constructor(public h: number, public s: number, public l: number) {

    }
    render(): string | CanvasGradient | CanvasPattern {
        return this.toString();
    }

    toString() {
        return `hsl(${this.h},${this.s}%, ${this.l}%)`
    }

    static get RED() {
        return new Color(356, 100, 41); // MONZA
    }

    static get GREEN() {
        return new Color(166, 99, 30);
    }

    static get BLUE() {
        return new Color(226, 92, 63);
    }

    static get WHITE() {
        return new Color(360, 100, 100);
    }

    static get YELLOW() {
        return new Color(60, 100, 50);
    }

    withAlpha(a: number) {
        return new ColorWithAlpha(this.h, this.s, this.l, a);
    }

    withL(l: number) {
        return new Color(this.h, this.s, l);
    }

    mixWithColor(color: Color, amount: number = 0.5): Color {
        const x1 = Math.cos(this.h / 180 * Math.PI) * this.s / 100;
        const y1 = Math.sin(this.h / 180 * Math.PI) * this.s / 100;
        const z1 = this.l;

        const x2 = Math.cos(color.h / 180 * Math.PI) * color.s / 100;
        const y2 = Math.sin(color.h / 180 * Math.PI) * color.s / 100;
        const z2 = color.l;

        const x = (1 - amount) * x1 + amount * x2;
        const y = (1 - amount) * y1 + amount * y2;
        const z = (1 - amount) * z1 + amount * z2;

        return new Color(
            Math.atan2(y, x) * 180 / Math.PI,
            Math.sqrt(x*x + y * y) * 100,
            z
        );
    }
}

export class ColorWithAlpha extends Color {
    constructor(h: number, s: number, l: number, public a: number) {
        super(h, s, l);
    }

    toString(): string {
        return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }

    discardAlpha() {
        return new Color(this.h, this.s, this.l);
    }
}