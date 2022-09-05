
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

 const isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 1 : 0;

type T = Record<ValueOf<typeof keys>, number>;

export class KeyboardController {
    _v: T = Object.values(keys).reduce((a,b) => ({...a, [b]: 0}), {}) as unknown as T;

    get v() {
        const gp = navigator.getGamepads();
        if (gp && gp.length > 0) {
            this.gamepad = gp[0]!;
        } else {
            this.gamepad = undefined;
        }
        if (this.gamepad && this.gamepad.connected) {
            const b = this.gamepad.buttons;
            const a = this.gamepad.axes;
            const v = {
                a: b[0+isFF].pressed,
                b: b[1+isFF].pressed,
                e: b[9+isFF].pressed,
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

    vibrate(s = 0.5, w = 0.3, d = 100) {
        if (this.gamepad) {
            try {
            (this.gamepad as any).vibrationActuator.playEffect('dual-rumble', {
                duration: d,
                strongMagnitude: s,
                weakMagnitude: w
              })
            } catch (e) { }
        }
    }

    get x() {
        return this.v.r ? 1 : this.v.l ? -1 : 0;
    }

    get y() {
        return this.v.u ? -1 : this.v.d ? 1 : 0;
    }
}
