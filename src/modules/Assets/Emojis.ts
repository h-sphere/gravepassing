import { AnimatedEmoji, CombinedEmoji, Emoji, EmojiSet } from "../Color/Sprite";

const S = 1;

const base: EmojiSet[] = [
    { emoji: "👖", pos: [S * 4, S * 10], size: S * 5},
    { emoji: "🧧", pos: [S *4, S * 5], size: S * 5},
    { emoji: "👱", pos: [S * 4, 0], size: S * 5},
];

const glasses = {emoji: "🕶", pos: [S * 4 + 1, S - 1], size: S * 4};
const singleGlass = { emoji: "⬛️", pos: [S * 5, S * 1], size: S * 1};
const singleRightGlass = { emoji: "⬛️", pos: [8, 1], size: S * 1};

export interface Directional {
    up: Emoji;
    down: Emoji;
    left: Emoji;
    right: Emoji;
}

/**
 * 
 *         { emoji: pants || "👖", pos: [4, 10], size: 5},
        { emoji: body || "🧧", pos: [4, 5], size: 5},
        { emoji: head || "👱", pos: [4, 0], size: 5}
 */

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

const createDirectional = (head?, body?, pants?): Directional => {
    const base = [
        { emoji: pants || "👖", pos: [4, 10], size: 5},
        { emoji: body || "🧧", pos: [4, 5], size: 5},
        { emoji: head || "👱", pos: [4, 0], size: 5}
    ];
    return {
        "up": new AnimatedEmoji(base, 1, "white", 10, renderLegs),
        "down": new AnimatedEmoji([...base, glasses], 1, 'white', 10, renderLegs),
        "left": new AnimatedEmoji([...base, singleGlass], 1, 'white', 10, renderLegs),
        "right": new AnimatedEmoji([...base, singleRightGlass], 1, 'white', 10, renderLegs),
    }
}

/*

const base: EmojiSettings[] = [
    { emoji: "🧧", pos: [4, 5], size: 5},
    { emoji: "👱", pos: [4, 0], size: 5},
    { emoji: "👖", pos: [4, 10], size: 5},
];
*/

export const E = {
    playerDir: createDirectional(),
    pigManDir: createDirectional("🐷"),
    frogMan: createDirectional("🦋"),
    cowMan: createDirectional("🐮", "👔"),
    robot: createDirectional("🤖", "👔", "⛓"),
    health: new Emoji("❤️", 6, 1, 0, 5),
    healthOff: new Emoji("🤍", 6, 1, 0, 5),
    item: new CombinedEmoji([
        // { emoji: "🔲", size: 16, pos: [0, 0]},
        { emoji: "💣", size: 6, pos: [1, 3]},
    ]),
    item2: new CombinedEmoji([
        // { emoji: "🔲", size: 16, pos: [0, 0]},
        { emoji: "🔥", size: 6, pos: [0, 2]},
    ]),
    t: new Emoji("🦷", 6, 1, 0, 3),
    itemBg: new CombinedEmoji([
        { emoji: "🟩", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.6)'),
    itemBgOff:new CombinedEmoji([
        { emoji: "⬛️", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.5)'),
    goal: {
        top: new Emoji("⬆", 16, 1, 0, 4, 'rgba(255,255,255,0.8)'),
        down: new Emoji("⬇", 16, 1, 0, 4, 'rgba(255,255,255,0.8)'),
        left: new Emoji("⬅", 16, 1, 0, 4, 'rgba(255,255,255,0.8)'),
        right: new Emoji("➡", 16, 1, 0, 4, 'rgba(255,255,255,0.8)')

    },
}