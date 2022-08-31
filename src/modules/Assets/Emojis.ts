import { AnimatedEmoji, CombinedEmoji, Emoji, EmojiSet } from "../Color/Sprite";

const S = 1;
const glasses = {emoji: "🕶", pos: [S * 4 + 1, S - 1], size: S * 4};
const singleGlass = { emoji: "⬛️", pos: [S * 5, S * 1], size: S * 1};
const singleRightGlass = { emoji: "⬛️", pos: [8, 1], size: S * 1};

export interface Directional {
    up: CombinedEmoji;
    down: CombinedEmoji;
    left: CombinedEmoji;
    right: CombinedEmoji;
}

const renderLegs = (s: number, steps: number, c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    if (!s) {
        return;
    }
    ctx.fillStyle = "red";
    // ctx.fillRect(0, 0, s, s);
    if (s/steps <= 0.5) {
        ctx.clearRect(4, 16, 3, -4*(2*s/steps))
    } else {
        ctx.clearRect(7, 16, 3, -4*(Math.abs(2*s/steps-1)))
    }
}

const createDirectional = (head?: string, body?: string, pants?: string, shirtShift = 0, pantShift = 0): Directional => {
    const base = [
        { emoji: pants || "👖", pos: [4, 10], size: 5, hueShift: pantShift},
        { emoji: body || "🧧", pos: [4, 5], size: 5, hueShift: shirtShift },
        { emoji: head || "👱", pos: [4, 0], size: 5 }
    ];
    return {
        "up": new AnimatedEmoji(base, 1, "white", 10, renderLegs),
        "down": new AnimatedEmoji([...base, glasses], 1, 'white', 10, renderLegs),
        "left": new AnimatedEmoji([...base, singleGlass], 1, 'white', 10, renderLegs),
        "right": new AnimatedEmoji([...base, singleRightGlass], 1, 'white', 10, renderLegs),
    }
}

export const E = {
    factory: new CombinedEmoji([
        { emoji: "🏢", size: 30, pos: [0, 15]},
        { emoji: "☢️", size: 8, pos: [10, 24]},
        { emoji: "🦴", size: 8, pos: [2, 40]},
        { emoji: "💀", size: 8, pos: [20, 40]},
        { emoji: "📡", size: 10, pos: [16, 6]}
    ], 3),
    playerDir: createDirectional(),

    pigMan: createDirectional("🐷"),
    frogMan: createDirectional("🦋"),
    cowMan: createDirectional("🐮", "👔", "👖", 180, 100),

    robotMan: createDirectional("🤖", "👔", "⛓"),
    zombieWoman: createDirectional("👩", "👚", "👖", 0, 30),
    zombie: createDirectional("🐵", "🎽", "🦿"),
    rabbit: createDirectional("🐰", "🔺", "👖", 100, 50),

    health: new Emoji("❤️", 6, 1, 0, 5),
    healthOff: new Emoji("❤️", 6, 1, 0, 5, "", 0, 20),
    enemyH: new Emoji("❤️", 4, 1, 0, 0),
    enemyHOff: new Emoji("❤️", 4, 1, 0, 0, "", 0, 20),
    bullet: new Emoji("🔅", 4, 1, 6, 6),
    explamation: new Emoji("❗️", 6, 1),
    item: new CombinedEmoji([
        { emoji: "💣", size: 6, pos: [1, 3]},
    ]),
    item2: new CombinedEmoji([
        { emoji: "🔥", size: 6, pos: [0, 2]},
    ]),
    itemBg: new CombinedEmoji([
        { emoji: "🟩", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.6)'),
    itemBgOff:new CombinedEmoji([
        { emoji: "⬛️", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.5)'),
    goal: {
        top: new Emoji("⬆", 16, 1, 0, 4, '#FFF'),
        down: new Emoji("⬇", 16, 1, 0, 4, '#FFF'),
        left: new Emoji("⬅", 10, 1, 0, 6, '#FFF'),
        right: new Emoji("➡", 10, 1, 0, 6, '#FFF')

    },
}