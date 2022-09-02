
// FIXME: REWORK IT.
type ValueOf<T> = T[keyof T];
const keys = {
    'ArrowUp': "u",
    'ArrowDown': "d",
    'ArrowLeft': "l",
    'ArrowRight': "r",
    ' ': 'a',
    'x': 'b',
    'Escape': 'e'
 } as const;

type T = Record<ValueOf<typeof keys>, number>;

export class KeyboardController {
    _v: T = Object.values(keys).reduce((a,b) => ({...a, [b]: 0}), {}) as unknown as T;

    get v() {
        console.log(this.gamepad);

        const gp = navigator.getGamepads();
        console.log(gp);
        if (gp && gp.length > 0) {
            this.gamepad = gp[0]!;
        } else {
            this.gamepad = undefined;
        }
        if (this.gamepad && this.gamepad.connected) {
            // console.log(this.gamepad.buttons);
            const b = this.gamepad.buttons;
            const a = this.gamepad.axes;
            console.log(a);
            const v = {
                a: b[0].pressed,
                b: b[1].pressed,
                e: b[9].pressed,
                u: a[1] < -0.2 ? -1 : 0,
                d: a[1] > 0.2 ? 1 : 0,
                l: a[0] < -0.2 ? -1 : 0,
                r: a[0] > 0.2 ? 1 : 0,
            }
            return v;
        }
        return this._v;
    }

    gamepad?: Gamepad;

    constructor() {
        document.addEventListener('keydown', e => {
            if (keys[e.key as keyof typeof keys]) {
                this.v[keys[e.key as keyof typeof keys] as ValueOf<typeof keys>] = 1;
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', e => {
            if (keys[e.key as keyof typeof keys]) {
                this.v[keys[e.key as keyof typeof keys] as ValueOf<typeof keys>] = 0;
                e.preventDefault();
            }
        });
    }

    get x() {
        return this.v.r ? 1 : this.v.l ? -1 : 0;
    }

    get y() {
        return this.v.u ? -1 : this.v.d ? 1 : 0;
    }
}
