
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

type T = Record<ValueOf<typeof keys>, number> ;

export class KeyboardController {
    v: T = Object.values(keys).reduce((a,b) => ({...a, [b]: 0}), {}) as unknown as T;

    constructor() {
        document.addEventListener('keydown', e => {
            if (keys[e.key as keyof typeof keys]) {
                this.v[keys[e.key as keyof typeof keys] as ValueOf<typeof keys>] = 1;
            }
        });
        document.addEventListener('keyup', e => {
            if (keys[e.key as keyof typeof keys]) {
                this.v[keys[e.key as keyof typeof keys] as ValueOf<typeof keys>] = 0;
            }
        });
    }

    get x() {
        return this.v.r ? -1 : this.v.l ? 1 : 0;
    }

    get y() {
        return this.v.u ? -1 : this.v.d ? 1 : 0;
    }

    get s() {
        return this.v.q ? -1 : this.v.w ? 1 : 0;
    }
}
