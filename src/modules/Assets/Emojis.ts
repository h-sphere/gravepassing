import { AnimatedEmoji, CombinedEmoji, Emoji, EmojiSet } from "../Color/Sprite";

const S = 1;
const glasses: EmojiSet = {e: "🕶", pos: [S * 4 + 1, S - 1], size: S * 4, color: "black"};
const singleGlass: EmojiSet = { e: "⬛️", pos: [S * 5, S * 1], size: S * 1};
const singleRightGlass: EmojiSet = { e: "⬛️", pos: [8, 1], size: S * 1};

export interface Directional {
    u: CombinedEmoji;
    d: CombinedEmoji;
    l: CombinedEmoji;
    r: CombinedEmoji;
}

const renderLegs = (s: number, steps: number, c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    if (!s) {
        return;
    }
    ctx.fillStyle = "red";
    if (s/steps <= 0.5) {
        ctx.clearRect(4, 16, 3, -4*(2*s/steps))
    } else {
        ctx.clearRect(7, 16, 3, -4*(Math.abs(2*s/steps-1)))
    }
}

const createDirectional = (head?: string, body?: string, pants?: string, shirtShift = 0, pantShift = 0, scale: number = 1): Directional => {
    const base: EmojiSet[] = [
        { e: pants || "👖", pos: [scale*4, scale*10], size: scale*5, hueShift: pantShift},
        { e: body || "🧧", pos: [scale*4, scale*5], size: scale*5, hueShift: shirtShift },
        { e: head || "👱", pos: [scale*4, 0], size: scale*5 }
    ];
    return {
        "u": new AnimatedEmoji(base, scale, "white", 10, renderLegs),
        "d": new AnimatedEmoji([...base, glasses], scale, 'white', 10, renderLegs),
        "l": new AnimatedEmoji([...base, singleGlass], scale, 'white', 10, renderLegs),
        "r": new AnimatedEmoji([...base, singleRightGlass], scale, 'white', 10, renderLegs),
    }
}

export const E = {
    portal: new CombinedEmoji([
        { e: "✨", size: 15, pos: [0, 5]},
        { e: "✨", size: 15, pos: [15, 15]},
        { e: "✨", size: 15, pos: [5, 35]},
        { e: "🌀", size: 30, pos: [0, 15], hueShift: 50},
    ], 3),
    switch: new CombinedEmoji([
        { e: "🔌", size: 30, pos: [0, 15], hueShift: 0},
    ], 3),
    factory: new CombinedEmoji([
        { e: "🏢", size: 30, pos: [0, 15]},
        { e: "☢️", size: 8, pos: [10, 24]},
        { e: "🦴", size: 8, pos: [2, 40]},
        { e: "💀", size: 8, pos: [20, 40]},
        { e: "📡", size: 10, pos: [16, 6]}
    ], 3),
    playerDir: createDirectional(),

    pigMan: createDirectional("🐷", void 0, void 0, 180, 40),
    frogMan: createDirectional("🦋", void 0, void 0, 170, 200),
    cowMan: createDirectional("🐮", "👔", "👖", 180, 100),

    robotMan: createDirectional("🤖", "👔", "⛓"),
    zombieWoman: createDirectional("👩", "👚", "👖", 0, 30),
    zombie: createDirectional("🐵", "👔", "🦿"),

    devil: createDirectional("👹", "👔", "",200,0,2),

    health: new Emoji("❤️", 6, 1, 0, 5),
    healthOff: new Emoji("❤️", 6, 1, 0, 5, "", 0, 20),
    enemyH: new Emoji("❤️", 4, 1, 0, 0),
    enemyHOff: new Emoji("❤️", 4, 1, 0, 0, "", 0, 20),
    bullet: new Emoji("🔅", 4, 1, 6, 6),
    explamation: new Emoji("❗️", 6, 1),
    keyboard: new Emoji("⌨️", 10, 1),
    controller: new Emoji("🎮", 10, 1),
    item: new CombinedEmoji([
        { e: "💣", size: 6, pos: [1, 3]},
    ]),
    item2: new CombinedEmoji([
        { e: "🔥", size: 6, pos: [0, 2]},
    ]),
    itemBg: new CombinedEmoji([
        { e: "🟩", size: 8, pos: [0, 2]}
    ], 1, "#FFFA"),
    itemBgOff:new CombinedEmoji([
        { e: "⬛️", size: 8, pos: [0, 2]}
    ], 1, "#FFFA"),
    goal: {
        u: new Emoji("⬆️", 10, 1, 0, 6, '#FFF', 260, 120),
        d: new Emoji("⬇️", 10, 1, 0, 5, '#FFF', 260, 120),
        l: new Emoji("⬅️", 10, 1, 0, 6, '#FFF', 260, 120),
        r: new Emoji("➡️", 10, 1, 0, 6, '#FFF', 260, 120)

    },
}