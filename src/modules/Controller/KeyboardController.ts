
type Callback = (diff: number) => void;

type AxisDirection = -1 | 0 | 1;


export class KeyboardController {
    private _x: AxisDirection = 0;
    private _y: AxisDirection = 0;

    private _wheel: number = 0;
    private _rotation: number = 0;

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }
    
    public get wheel() {
        return this._wheel;
    }
    
    public get rotation() {
        return this._rotation;
    }

    constructor() {
        this.attach();
    }

    private attach() {
        document.addEventListener('keydown', e => {
            console.log(e);
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
                    this._rotation = 1;
                    break;
                case 'w':
                    this._rotation = -1;
                    break;
            }
        });

        document.addEventListener('keyup', e => {
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
                    this._rotation = 0;
                    break;
            }
        });

        document.addEventListener('wheel', e => {
            this._wheel = e.deltaY;
            console.log(this._wheel);
        })
    }
}