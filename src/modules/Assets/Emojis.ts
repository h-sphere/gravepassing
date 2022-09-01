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

const createDirectional = (head?: string, body?: string, pants?: string, shirtShift = 0, pantShift = 0, scale: number = 1): Directional => {
    const base = [
        { emoji: pants || "👖", pos: [scale*4, scale*10], size: scale*5, hueShift: pantShift},
        { emoji: body || "🧧", pos: [scale*4, scale*5], size: scale*5, hueShift: shirtShift },
        { emoji: head || "👱", pos: [scale*4, 0], size: scale*5 }
    ];
    return {
        "up": new AnimatedEmoji(base, scale, "white", 10, renderLegs),
        "down": new AnimatedEmoji([...base, glasses], scale, 'white', 10, renderLegs),
        "left": new AnimatedEmoji([...base, singleGlass], scale, 'white', 10, renderLegs),
        "right": new AnimatedEmoji([...base, singleRightGlass], scale, 'white', 10, renderLegs),
    }
}

export const E = {
    portal: new CombinedEmoji([
        { emoji: "✨", size: 15, pos: [0, 5]},
        { emoji: "✨", size: 15, pos: [15, 15]},
        { emoji: "✨", size: 15, pos: [5, 35]},
        { emoji: "🌀", size: 30, pos: [0, 15], hueShift: 50},
    ], 3),
    switch: new CombinedEmoji([
        { emoji: "🔌", size: 30, pos: [0, 15], hueShift: 0},
    ], 3),
    factory: new CombinedEmoji([
        { emoji: "🏢", size: 30, pos: [0, 15]},
        { emoji: "☢️", size: 8, pos: [10, 24]},
        { emoji: "🦴", size: 8, pos: [2, 40]},
        { emoji: "💀", size: 8, pos: [20, 40]},
        { emoji: "📡", size: 10, pos: [16, 6]}
    ], 3),
    playerDir: createDirectional(),

    pigMan: createDirectional("🐷", void 0, void 0, 180, 40),
    frogMan: createDirectional("🦋", void 0, void 0, 170, 200),
    cowMan: createDirectional("🐮", "👔", "👖", 180, 100),

    robotMan: createDirectional("🤖", "👔", "⛓"),
    zombieWoman: createDirectional("👩", "👚", "👖", 0, 30),
    zombie: createDirectional("🐵", "🎽", "🦿"),
    rabbit: createDirectional("🐰", "🔺", "👖", 100, 50),

    devil: createDirectional("👹", "👔", "",200,0,2),

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
        top: new Emoji("⬆️", 10, 1, 0, 6, '#FFF', 260, 120),
        down: new Emoji("⬇️", 10, 1, 0, 5, '#FFF', 260, 120),
        left: new Emoji("⬅️", 10, 1, 0, 6, '#FFF', 260, 120),
        right: new Emoji("➡️", 10, 1, 0, 6, '#FFF', 260, 120)

    },
}