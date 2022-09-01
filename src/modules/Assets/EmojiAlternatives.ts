interface OptionalEmojiSet {
    emoji: string;
    pos?: [number, number];
    size?: number;
}

export const alt: Record<string, OptionalEmojiSet> = {
    "🪦": { emoji: "⚰️", pos: [0, 4], size: .9},
    "⛓": { emoji: "👖" },
    "🪨": { emoji: "🌳", pos: [0, -5]},
    "🪵": { emoji: "🌳" },
    "🦴": { emoji: "💀"}
}


export const win: Record<string, OptionalEmojiSet> = {
    "🔥": { emoji: "🔥", pos: [1, -1], size: 1 },
    "💣": { emoji: "💣", pos: [-1, -2]},
    "👱": { emoji: "👱", pos: [-1, 0]},
    "🕶": { emoji: "🕶", size: 1.5, pos: [-1, -1]},
    "⬛️": { emoji: "⬛️", pos: [-1, 0]},
    "👖": { emoji: "👖", pos: [-0.5, 0]},
    "🐷": { emoji: "🐷", pos: [-1, 0]},
    "🦋": { emoji: "🦋", pos: [-1, 0]},
    "🐮": { emoji: "🐮", pos: [-1, 0]},
    "👔": { emoji: "👔", pos: [-1, 0]},
    "👩": { emoji: "👩", pos: [-1, 0]},
    "🤖": { emoji: "🤖", pos: [-1, 0]},
    "👚": { emoji: "👚", pos: [-1, 0]},
    "🐵": { emoji: "🐵", pos: [-1, 0]},
    "☢️": { emoji: "☢️", pos: [5, 0]},
    "👹": { emoji: "👹", pos: [-2, 1]}
}

export const tux: Record<string, OptionalEmojiSet> = {
}