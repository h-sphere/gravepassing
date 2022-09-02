
// FIXME: REWORK IT.
type ValueOf<T> = T[keyof T];
const keys = {
    'ArrowUp': "u",
    'ArrowDown': "d",
    'ArrowLeft': "l",
    'ArrowRight': "r",
    'q': 'q',
    'w': 'w',
    ' ': 'f',
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
                f: b[0].pressed,
                e: b[9].pressed,
                q: b[4].pressed,
                w: b[5].pressed,
                u: a[1] < -0.2 ? -1 : 0,
                d: a[1] > 0.2 ? 1 : 0,
                l: a[0] < -0.2 ? -1 : 0,
                r: a[0] > 0.2 ? 1 : 0,
            }
            console.log(v);
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

        // window.addEventListener('gamepadconnected', e=> {
        //     this.gamepad = e.gamepad;
        //     console.log("CONN");
        // });
    }

    get x() {
        return this.v.r ? 1 : this.v.l ? -1 : 0;
    }

    get y() {
        return this.v.u ? -1 : this.v.d ? 1 : 0;
    }

    get s() {
        return this.v.q ? -1 : this.v.w ? 1 : 0;
    }
}
