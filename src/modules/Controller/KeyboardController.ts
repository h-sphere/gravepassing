type Callback = (diff: number) => void;
export class KeyboardController {
    private xEvents: Callback[] = [];
    private yEvents: Callback[] = [];
    constructor() {
        
    }

    on(event: 'x' | 'y', callback: Callback) {
        if (event === 'x') {
            this.xEvents.push(callback);
        } else {
            this.yEvents.push(callback);
        }
    }

    updateX(diff: number) {
        this.xEvents.forEach(fn => fn(diff));
    }

    updateY(diff: number) {
        console.log("Updating Y", diff);
        this.yEvents.forEach(fn => fn(diff));
    }

    attach() {
        document.addEventListener('keydown', e => {
            console.log(e);
            switch (e.key) {
                case 'ArrowUp':
                    this.updateY(-1);
                    break;
                case 'ArrowDown':
                    this.updateY(1);
                    break;
                case 'ArrowLeft':
                    this.updateX(1);
                    break;
                case 'ArrowRight':
                    this.updateX(-1);
                    break;
            }
        });
    }
}