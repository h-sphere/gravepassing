
type Callback = (diff: number) => void;

type AxisDirection = -1 | 0 | 1;


export class KeyboardController {
    private _x: AxisDirection = 0;
    private _y: AxisDirection = 0;

    private _wheel: number = 0;

    private _fire: number = 0;

    public esc: number = 0;
    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }
    
    public get wheel() {
        return this._wheel;
    }

    public get fire() {
        return this._fire;
    }
    
    public selection: number = 0;

    constructor() {
        this.attach();
    }

    private attach() {
        document.addEventListener('keydown', e => {
            let p = true;;
            switch (e.key) {
                case 'ArrowUp':
                    this._y = -1;
                    break;
                case 'ArrowDown':
                    this._y = 1;
                    break;
                case 'ArrowLeft':
                    this._x = -1;
                    break;
                case 'ArrowRight':
                    this._x = 1;
                    break;
                case 'q':
                    this.selection = -1;
                    break;
                case 'w':
                    this.selection = 1;
                    break;
                case ' ':
                    this._fire = 1;
                    break;
                case 'Escape':
                    this.esc = 1;
                    break;
                default:
                    console.log("COMBINATION NOT FOUND", e.key);
                    p = false;
            }
            p && e.preventDefault();
        });

        document.addEventListener('keyup', e => {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    this._y = 0;
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this._x = 0;
                    break;
                case 'q':
                case 'w':
                    this.selection = 0;
                    break;
                case ' ':
                    this._fire = 0;
                case 'Escape':
                    this.esc = 0;
            }
        });

        let handler = null;

        document.addEventListener('wheel', e => {
            this._wheel = e.deltaY;
            // console.log(this._wheel);
            if (handler) {
                clearTimeout(handler);
                handler = null;
            }
            handler = setTimeout(() => {
                this._wheel = 0;
                handler = null;
            }, 100);
        })
    }
}