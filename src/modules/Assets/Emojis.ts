import { CombinedEmoji, Emoji, EmojiSet } from "../Color/Sprite";

const S = 1;

const base: EmojiSet[] = [
    { emoji: "👖", pos: [S * 4, S * 10], size: S * 5},
    { emoji: "🧧", pos: [S *4, S * 5], size: S * 5},
    { emoji: "👱", pos: [S * 4, 0], size: S * 5},
];

/*

const base: EmojiSettings[] = [
    { emoji: "🧧", pos: [4, 5], size: 5},
    { emoji: "👱", pos: [4, 0], size: 5},
    { emoji: "👖", pos: [4, 10], size: 5},
];
*/
const glasses = {emoji: "🕶", pos: [S * 4 + 1, S - 1], size: S * 4};
const singleGlass = { emoji: "⬛️", pos: [S * 5, S * 1], size: S * 1};
const singleRightGlass = { emoji: "⬛️", pos: [8, 1], size: S * 1};

export const E = {
    player_left: new CombinedEmoji(
        [
            ...base /*.map(e => ({...e, pos: [e.pos[0] - 1, e.pos[1]]}))*/
            , singleGlass], S),
    player_down: new CombinedEmoji([...base, glasses], S),
    player_top: new CombinedEmoji(base, 1),
    player_right: new CombinedEmoji([...base, singleRightGlass], 1),
    pigMan: new CombinedEmoji([
        { emoji: "👖", pos: [S * 4, S * 10], size: S * 5},
    { emoji: "🧧", pos: [S *4, S * 5], size: S * 5},
    { emoji: "🐷", pos: [S * 4, 0], size: S * 5}, glasses]),
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
    itemBg: new CombinedEmoji([
        { emoji: "🟩", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.6)'),
    itemBgOff:new CombinedEmoji([
        { emoji: "⬛️", size: 8, pos: [0, 2]}
    ], 1, 'rgba(255,0,0,0.5)'),
}